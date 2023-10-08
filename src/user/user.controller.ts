import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';
@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.userService.create(body.email, body.password);
  }
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
