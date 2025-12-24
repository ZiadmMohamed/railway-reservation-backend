import { Module } from '@nestjs/common';
import { TrainsService } from './trains.service';
import { TrainsController } from './trains.controller';
import { TrainsRepository } from './repositories/trains.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TrainsController],
  imports: [AuthModule],
  providers: [TrainsRepository, TrainsService],
  exports: [TrainsService],
})
export class TrainsModule {}
