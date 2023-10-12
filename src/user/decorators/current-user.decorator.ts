import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  //Data คือ argument ที่ใส่มาใน decorator
  //Context is wrapper of incomming request
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.currentUser;
  },
);
