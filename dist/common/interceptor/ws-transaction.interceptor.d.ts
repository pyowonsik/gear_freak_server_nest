import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
export declare class WsTransactionInterceptor implements NestInterceptor {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>>;
}
