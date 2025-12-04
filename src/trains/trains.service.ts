import { Injectable, NotFoundException } from '@nestjs/common';
import { TrainsRepository } from './repositories/trains.repository';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';

@Injectable()
export class TrainsService {
  constructor(private readonly trainsRepository: TrainsRepository) {}

  async create(createTrainDto: CreateTrainDto) {
    return this.trainsRepository.create({
      name: createTrainDto.name,
      number: createTrainDto.number,
      source: createTrainDto.source,
      destination: createTrainDto.destination,
      totalSeats: createTrainDto.totalSeats,
      availableSeats: createTrainDto.totalSeats, // Initially all seats are available
    });
  }

  async findAll(page = 1, limit = 10) {
    const [trains, totalCount] = await Promise.all([
      this.trainsRepository.findAll(page, limit),
      this.trainsRepository.count(),
    ]);

    return {
      data: trains,
      meta: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async findOne(id: string) {
    const train = await this.trainsRepository.findOne(id);

    if (!train) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }

    return train;
  }

  async update(id: string, updateTrainDto: UpdateTrainDto) {
    // Check if train exists
    const existing = await this.findOne(id);

    const updateData: any = {};
    if (updateTrainDto.name !== undefined) updateData.name = updateTrainDto.name;
    if (updateTrainDto.number !== undefined) updateData.number = updateTrainDto.number;
    if (updateTrainDto.source !== undefined) updateData.source = updateTrainDto.source;
    if (updateTrainDto.destination !== undefined)
      updateData.destination = updateTrainDto.destination;
    if (updateTrainDto.totalSeats !== undefined) {
      updateData.totalSeats = updateTrainDto.totalSeats;
      // Recalculate available seats if total seats changed
      const seatsDiff = parseInt(updateTrainDto.totalSeats) - parseInt(existing.totalSeats);
      updateData.availableSeats = (parseInt(existing.availableSeats) + seatsDiff).toString();
    }

    return this.trainsRepository.update(id, updateData);
  }

  async remove(id: string) {
    await this.findOne(id); // Throws if not found
    await this.trainsRepository.delete(id);
    return { message: `Train with ID ${id} has been deleted` };
  }
}
