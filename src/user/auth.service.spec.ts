import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async () => {
    //Create fake coppy of userService
    const fakeUserService: Partial<UserService> = {
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
});
