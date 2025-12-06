import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PassengerRepository } from './repositories/passenger.repository';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { Passenger } from './schemas/passenger.schema';

@Injectable()
export class PassengerService {
  constructor(private readonly passengerRepository: PassengerRepository) {}

  async create(
    nationalId: string,
    passengerName: string,
    userId: string = '7KwL4UDRMfjqYHZMUILdh8AO9EaVcwpe',
  ): Promise<Passenger> {
    const createdPassenger = await this.passengerRepository.create(
      nationalId,
      passengerName,
      userId,
    );

    if (!createdPassenger) throw new BadRequestException('Passenger already exists');

    return createdPassenger;
  }

  async findAll(page = 1, limit = 10) {
    const [passengers, totalCount] = await Promise.all([
      this.passengerRepository.findAll(page, limit),
      this.passengerRepository.count(),
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

  async findOne(id: string) {
    const passenger = await this.passengerRepository.findOne(id);

    if (!passenger) {
      throw new NotFoundException('Passenger not found');
    }

    return passenger;
  }

  async update(id: string, updatePassengerDto: UpdatePassengerDto) {
    await this.findOne(id);

    const updatedPassenger = await this.passengerRepository.update(id, updatePassengerDto);
    if (!updatedPassenger) throw new BadRequestException('Failed to update passenger');

    return updatedPassenger;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.passengerRepository.delete(id);
    return { message: 'Passenger deleted successfully' };
  }
}
