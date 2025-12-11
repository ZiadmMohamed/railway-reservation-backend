import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PassengerRepository } from './repositories/passenger.repository';
import { UpdatePassenger } from './dto/update-passenger.dto';
import { Passenger } from './schemas/passenger.schema';

@Injectable()
export class PassengerService {
  constructor(private readonly passengerRepository: PassengerRepository) {}

  async create(nationalId: string, passengerName: string, userId: string): Promise<Passenger> {
    const createdPassenger = await this.passengerRepository.create(
      nationalId,
      passengerName,
      userId,
    );

    if (!createdPassenger) throw new BadRequestException('Passenger already exists');

    return createdPassenger;
  }

  async findAll(userId: string, page: number, limit: number) {
    const [passengers, totalCount] = await Promise.all([
      this.passengerRepository.findAll(userId, page, limit),
      this.passengerRepository.count(userId),
    ]);

    return {
      data: passengers,
      meta: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<Passenger> {
    const passenger = await this.passengerRepository.findOne(id, userId);

    if (!passenger) {
      throw new NotFoundException('Passenger not found');
    }

    return passenger;
  }

  async update(id: string, userId: string, updatePassenger: UpdatePassenger): Promise<Passenger> {
    await this.findOne(id, userId);

    const updatedPassenger = await this.passengerRepository.update(id, updatePassenger);
    if (!updatedPassenger) throw new BadRequestException('Failed to update passenger');

    return updatedPassenger;
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);

    await this.passengerRepository.delete(id, userId);
  }
}
