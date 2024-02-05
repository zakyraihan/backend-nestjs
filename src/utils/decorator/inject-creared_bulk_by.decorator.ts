import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectCreatedBulkBy = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    req.body.created_by = req.user.id;

    return req.body;
  },
);
