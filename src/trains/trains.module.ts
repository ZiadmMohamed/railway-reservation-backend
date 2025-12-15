// import { Module } from '@nestjs/common';
// import { TrainsService } from './trains.service';
// import { TrainsController } from './trains.controller';
// import { TrainsRepository } from './repositories/trains.repository';
// import { AuthModule } from 'src/auth/auth.module';

// @Module({
//   controllers: [TrainsController],
//   imports: [AuthModule],
//   providers: [
//     {
//       provide: TrainsRepository,
//       inject: ['DATABASE'],
//       useFactory: (db: any) => new TrainsRepository(db),
//     },
//     TrainsService,
//   ],
//   exports: [TrainsService],
// })
// export class TrainsModule {}
