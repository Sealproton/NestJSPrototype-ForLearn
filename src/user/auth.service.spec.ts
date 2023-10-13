import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;
  beforeEach(async () => {
    //Create fake coppy of userService
    fakeUserService = {
      //Promise.result คือคำสั่งให้สร้าง promise แล้ว resolve ให้ค่าในวงเล็บ
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
    //reassign find in case found user
    fakeUserService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signIn('1243124124@gmail.com', 'laskdjf'),
    ).rejects.toThrow(NotFoundException);
  });
  it('throws if an invalid password is provided', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          email: 'asdf@asdf.com',
          password:
            'b5671bb3ff32b8fc.f3722dacc977b923a72e8662653d3dd4511d1ed2d86ad7bb02fe2361599157b1',
        } as User,
      ]);
    await expect(service.signIn('asdf@asdf.com', 'Zlaskdjf')).rejects.toThrow(
      BadRequestException,
    );
  });
});
