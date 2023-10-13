import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

describe('AuthService', () => {
  let users: User[] = [];
  let service: AuthService;
  let fakeUserService: Partial<UserService>;
  beforeEach(async () => {
    //Create fake coppy of userService
    fakeUserService = {
      //Promise.result คือคำสั่งให้สร้าง promise แล้ว resolve ให้ค่าในวงเล็บ
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: users.length, email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: fakeUserService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
  it('Itys create new user with a salt and hash the password', async () => {
    const user = await service.signUp('fakeemail@gmail.com', '142asf33');
    expect(user.password).not.toEqual('142asf33');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('asdf@asdf.com', 'asdf');
    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signIn('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });
  it('throws if an invalid password is provided', async () => {
    await service.signUp('test@asdf.com', 'Zlaskdjf');
    await expect(service.signIn('test@asdf.com', 'Zlaskdjf1')).rejects.toThrow(
      BadRequestException,
    );
  });
  it('return user id login successfully', async () => {
    await service.signUp('success@gmail.com', '1234');
    const signin = await service.signIn('success@gmail.com', '1234');
    expect(signin).toBeDefined();
  });
});
