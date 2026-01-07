import { DataSource } from 'typeorm';
export declare class HealthService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    checkDatabaseHealth(): Promise<boolean>;
}
