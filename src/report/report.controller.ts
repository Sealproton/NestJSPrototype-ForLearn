import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportService } from './report.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}
  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto) {
    return this.reportService.create(body);
  }
}
