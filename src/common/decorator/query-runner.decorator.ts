import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request?.queryRunner) {
      throw new InternalServerErrorException(
        'QueryRunner decorator requires TransactionInterceptor to be applied.',
      );
    }

    return request.queryRunner;
  },
);
