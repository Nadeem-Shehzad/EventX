// import { Controller, Get, Res } from '@nestjs/common';
// import type { Response } from 'express';
// import { MetricsService } from './metrics.service';

// @Controller()
// export class MetricsController {
//    constructor(private readonly metricsService: MetricsService) { }

//    @Get('/metrics')
//    async getMetrics(@Res() res: Response) {
//       console.log('------- Getting Logs --------');
//       res.set('Content-Type', this.metricsService.getContentType());

//       const metrics = await this.metricsService.getMetrics();
//       console.log(metrics); // 👈 IMPORTANT // 👈 IMPORTANT

//       res.send(await this.metricsService.getMetrics());
//    }
// }