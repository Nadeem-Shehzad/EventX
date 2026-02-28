import { Module, Global } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';


@Global() // ⭐ so every module can inject MetricsService
@Module({
   controllers: [MetricsController],
   providers: [MetricsService],
   exports: [MetricsService],
})
export class MonitoringModule { }
