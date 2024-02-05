import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectCreatedBulkBy = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const test = req.body.data.map((items) => {
      return {
        ...items,
        created_by: {
          id: req.user.id,
        },
      };
    });

    req.body.data = test;

    return req.body;
  },
);
