import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const InjectBulkCreatedBy = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const iseng = req.body.data.map((items) => {
      return { ...items, created_by: { id: req.user.id } };
    });

    req.body.data = iseng;

    return req.body;
  },
);
