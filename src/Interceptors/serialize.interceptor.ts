import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/user/dtos/user-dto';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //Run something before request is handled
    return handler.handle().pipe(
      map((data: any) => {
        //Run something before response has been sent out
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
