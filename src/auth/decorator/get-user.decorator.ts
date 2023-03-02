import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const requset = ctx.switchToHttp().getRequest();
    return requset.user;
  },
);
