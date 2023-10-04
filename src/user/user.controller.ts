import { Body, Controller, Post } from '@nestjs/common';
import { CreateUsetDto } from './dtos/create-user.dto';
@Controller('auth')
export class UserController {
  @Post('/signup')
  createUser(@Body() body: CreateUsetDto) {
    console.log(body);
  }
}
