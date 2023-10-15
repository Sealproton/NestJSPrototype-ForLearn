import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (!req.currentUser) {
      return false;
    }
    if (req.currentUser.admin) {
      return true;
    }
    return false;
  }
}
