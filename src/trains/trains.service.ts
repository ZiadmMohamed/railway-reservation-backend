import { Injectable, NotFoundException } from '@nestjs/common';
import { TrainsRepository } from './repositories/trains.repository';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class TrainsService {
  constructor(private readonly trainsRepository: TrainsRepository) {}

  async create(createTrainDto: CreateTrainDto) {
    return this.trainsRepository.create({
      trainNumber: createTrainDto.trainNumber,
    });
  }
  //   async create(createTrainDto: CreateTrainDto, locale: string) {
  //     return this.trainsRepository.create(
  //       {
  //         trainNumber: createTrainDto.trainNumber,
  //         totalSeats: createTrainDto.totalSeats,
  //         availableSeats: createTrainDto.totalSeats, // Initially all seats are available
  //       },
  //       {
  //         name: createTrainDto.name,
  //         source: createTrainDto.source,
  //         destination: createTrainDto.destination,
  //       },
  //       locale,
  //     );
  //   }
  //   async findAll(page = 1, limit = 10) {
  //     const locale = I18nContext.current()?.lang || 'en';

  //     const [trains, totalCount] = await Promise.all([
  //       this.trainsRepository.findAll(page, limit, locale),
  //       this.trainsRepository.count(),
  //     ]);

  //     return {
  //       data: trains,
  //       meta: {
  //         page,
  //         limit,
  //         total: totalCount,
  //         totalPages: Math.ceil(totalCount / limit),
  //       },
  //     };
  //   }

  //   async findOne(id: string) {
  //     const locale = I18nContext.current()?.lang || 'en';
  //     const train = await this.trainsRepository.findOne(id, locale);

  //     if (!train) {
  //       throw new NotFoundException(I18nContext.current().t('train.notFound'));
  //     }

  //     return train;
  //   }

  //   async update(id: string, updateTrainDto: UpdateTrainDto, locale: string) {
  //     // Check if train exists
  //     await this.findOne(id);

  //     const updateData: any = {};
  //     if (updateTrainDto.number !== undefined) updateData.number = updateTrainDto.number;

  //     // Handle totalSeats update
  //     if (updateTrainDto.totalSeats !== undefined) {
  //       const existing = await this.trainsRepository.findOne(id);
  //       updateData.totalSeats = updateTrainDto.totalSeats;
  //       // Recalculate available seats if total seats changed
  //       const seatsDiff = parseInt(updateTrainDto.totalSeats) - parseInt(existing.totalSeats);
  //       updateData.availableSeats = (parseInt(existing.availableSeats) + seatsDiff).toString();
  //     }

  //     const translationData = {
  //       name: updateTrainDto.name,
  //       source: updateTrainDto.source,
  //       destination: updateTrainDto.destination,
  //     };

  //     return this.trainsRepository.update(id, updateData, translationData, locale);
  //   }

  //   async findAll(page = 1, limit = 10) {
  //     const locale = I18nContext.current()?.lang || 'en';

  //     const [trains, totalCount] = await Promise.all([
  //       this.trainsRepository.findAll(page, limit, locale),
  //       this.trainsRepository.count(),
  //     ]);

  //     return {
  //       data: trains,
  //       meta: {
  //         page,
  //         limit,
  //         total: totalCount,
  //         totalPages: Math.ceil(totalCount / limit),
  //       },
  //     };
  //   }

  //   async findOne(id: string) {
  //     const locale = I18nContext.current()?.lang || 'en';
  //     const train = await this.trainsRepository.findOne(id, locale);

  //     if (!train) {
  //       throw new NotFoundException(I18nContext.current().t('train.notFound'));
  //     }

  //     return train;
  //   }

  //   async update(id: string, updateTrainDto: UpdateTrainDto, locale: string) {
  //     // Check if train exists
  //     await this.findOne(id);

  //     const updateData: any = {};
  //     if (updateTrainDto.number !== undefined) updateData.number = updateTrainDto.number;

  //     // Handle totalSeats update
  //     if (updateTrainDto.totalSeats !== undefined) {
  //       const existing = await this.trainsRepository.findOne(id);
  //       updateData.totalSeats = updateTrainDto.totalSeats;
  //       // Recalculate available seats if total seats changed
  //       const seatsDiff = parseInt(updateTrainDto.totalSeats) - parseInt(existing.totalSeats);
  //       updateData.availableSeats = (parseInt(existing.availableSeats) + seatsDiff).toString();
  //     }

  //     const translationData = {
  //       name: updateTrainDto.name,
  //       source: updateTrainDto.source,
  //       destination: updateTrainDto.destination,
  //     };

  //     return this.trainsRepository.update(id, updateData, translationData, locale);
  //   }

  //   async remove(id: string) {
  //     await this.findOne(id); // Throws if not found
  //     await this.trainsRepository.delete(id);
  //     return { message: I18nContext.current().t('train.deleted') };
  //   }
}
