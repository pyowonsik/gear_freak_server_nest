import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const WsQueryRunner = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();

    if (!client?.data?.queryRunner) {
      throw new InternalServerErrorException(
        'WsQueryRunner decorator requires WsTransactionInterceptor to be applied.',
      );
    }

    return client.data.queryRunner;
  },
);
