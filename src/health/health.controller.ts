import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/decorator/public.decorator';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
@Public()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('db')
  @ApiOperation({ summary: 'Database health check' })
  @ApiResponse({
    status: 200,
    description: 'Database connection is healthy',
  })
  @ApiResponse({ status: 503, description: 'Database connection failed' })
  async databaseCheck() {
    const isHealthy = await this.healthService.checkDatabaseHealth();

    if (!isHealthy) {
      return {
        status: 'error',
        database: 'unhealthy',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      status: 'ok',
      database: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
