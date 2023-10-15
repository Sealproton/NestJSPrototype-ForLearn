import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimatedDto } from './dtos/get-estimate.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class ReportService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}
  create(body: CreateReportDto, user: User) {
    const report = this.repo.create(body);
    report.user = user;
    return this.repo.save(report);
  }
  async changeApproval(id: string, approve: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approve = approve;
    return this.repo.save(report);
  }
  createEstimate(estimateDto: GetEstimatedDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: estimateDto.make })
      .andWhere('model = :model', { model: estimateDto.model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimateDto.lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: estimateDto.year })
      .andWhere('approve Is true')
      .orderBy('ABS(mileage - :mileage)')
      .setParameter('mileage', estimateDto.mileage)
      .limit(3)
      .getRawMany();
  }
}
