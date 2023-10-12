import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptors';
@Module({
  //Use this to create repository for us
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    // Apply Globaly interceptor not jus this controller bull entire appliocation
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
})
export class UserModule {}
