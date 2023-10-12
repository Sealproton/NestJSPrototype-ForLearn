import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Session,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';
import { UserDto } from './dtos/user-dto';
import { Serialize } from 'src/Interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
@Controller('auth')
@Serialize(UserDto)
export class UserController {
  constructor(
    private userService: UserService,
    private autsService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.autsService.signUp(email, password);
    session.userID = user.id;
    return user;
  }
  @Post('/signin')
  async signin(
    @Body() { email, password }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.autsService.signIn(email, password);
    session.userID = user.id;
    return user;
  }
  @Post('/signout')
  signout(@Session() session: any) {
    session.userID = null;
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoami(@CurrentUser() user: User) {
    return user;
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(Number(id));
    if (!user) {
      throw new NotFoundException('user Not Found');
    }
    return user;
  }
  @Get('/')
  findAllUser(@Query('email') email: string) {
    return this.userService.find(email);
  }
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(Number(id), body);
  }
}
