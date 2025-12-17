// src/trips/trips.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { TripsRepository } from './repositories/trips.repository';

@Injectable()
export class TripsService {
  constructor(private readonly tripsRepository: TripsRepository) {}

  async getAllTrips(page = 1, limit = 10) {
    const data = await this.tripsRepository.findAll(page, limit);
    const total = await this.tripsRepository.count();

    return {
      data,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async getTripById(id: string) {
    const trip = await this.tripsRepository.findOne(id);

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async deleteTripById(id: string) {
    const trip = await this.tripsRepository.findOne(id);

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    await this.tripsRepository.delete(id);
  }
}
