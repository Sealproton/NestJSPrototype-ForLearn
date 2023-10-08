import { Body, Controller, Post } from '@nestjs/common';
import { CreateUsetDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUsetDto) {
    this.userService.create(body.email, body.password);
  }
}
