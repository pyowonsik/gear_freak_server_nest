import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request?.user?.sub) {
      throw new InternalServerErrorException(
        'UserId decorator requires authentication. Ensure route is protected.',
      );
    }

    return request.user.sub;
  },
);
