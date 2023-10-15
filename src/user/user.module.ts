import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
@Module({
  //Use this to create repository for us
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    // Apply Globaly interceptor not jus this controller bull entire appliocation
  ],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
//ใช้ middle ware แทน interceptor เพราะ เราต้องการ currentUser ใช้ใน guard. ถ้าใช้ interceptor guard จะทำงานก่อน จะทำให้ไม่มีข้อมูล
