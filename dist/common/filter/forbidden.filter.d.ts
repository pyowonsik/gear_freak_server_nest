import { ArgumentsHost, ExceptionFilter, ForbiddenException } from '@nestjs/common';
export declare class ForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenException, host: ArgumentsHost): void;
}
