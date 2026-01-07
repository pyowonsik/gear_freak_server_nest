import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    healthCheck(): {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
    };
    databaseCheck(): Promise<{
        status: string;
        database: string;
        timestamp: string;
    }>;
}
