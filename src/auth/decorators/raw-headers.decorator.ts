import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const rawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.rawHeaders;
  },
);
