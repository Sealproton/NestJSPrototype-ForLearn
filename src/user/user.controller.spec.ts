import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common/exceptions';
describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;
  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id: 1,
          email: 'test@gmail.com',
          password: '1234',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'adwwsegf' } as User,
        ]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signUp: () => {},
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: fakeUserService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('find all user and returns a list of users with the given email', async () => {
    const user = await controller.findAllUser('test@gmail.com');
    expect(user.length).toEqual(1);
    expect(user[0].email).toEqual('test@gmail.com');
  });
  it('find User and return user in given id', async () => {
    const user = await controller.findUser('1');
    console.log(user);
    expect(user).toBeDefined();
  });
  it('findUser throws an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });
  it('sign in and update sessionwith retur user', async () => {
    const session = { userID: -9999 };
    const user = await controller.signin(
      {
        email: 'test@gmail.com',
        password: '1234',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userID).toEqual(1);
  });
});
