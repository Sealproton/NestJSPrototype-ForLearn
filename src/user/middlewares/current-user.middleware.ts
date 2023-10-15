import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user.service';
import { User } from '../user.entity';

//find express lib => find Request interface => add currentUser properties ถ้าไม่มี  req.currentUser = user; จะ error
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userID } = req.session || {};
    if (userID) {
      const user = await this.userService.findOne(userID);
      req.currentUser = user;
    }
    next();
  }
}
