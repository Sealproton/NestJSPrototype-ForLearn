import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportService } from './report.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/Interceptors/serialize.interceptor';
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}
  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }
}
