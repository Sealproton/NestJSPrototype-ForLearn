import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return req.session.userID;
    // ถ้าไม่มี userID ก็จะเป็น undefined ก็จะเป็น false มันก็จะไปต่อไม่ได้เพราะ canActivate(false)
  }
}
