import { DB } from '../drizzle';
import { stations } from '../../stations/schemas/stations.schema';
import { trains } from '../../trains/schemas/train.schema';
import { seats } from '../../seats/schemas/seats.schema';
import { trips } from '../../trips/schemas/trips.schema';
import { tripStops } from '../../trip-stops/schemas/trip-stops.schema';
import { seedDataIfNotExist } from './seed-helper';
import {
  stationsData,
  trainsData,
  routesData,
  tripsTemplates,
  TrainConfig,
  RouteConfig,
} from './seed-data';
// TODO: refactor
export class DatabaseSeeder {
  private stationNameToIdMap: Map<string, string> = new Map();
  private trainNumberToIdMap: Map<string, string> = new Map();
  private routeNameToConfigMap: Map<string, RouteConfig> = new Map();

  constructor(private db: DB) {
    routesData.forEach(route => {
      this.routeNameToConfigMap.set(route.name, route);
    });
  }

  async seedAll(): Promise<void> {
    console.log('🌱 Starting database seeding...\n');

    await this.seedStations();
    await this.seedTrains();
    await this.seedSeats();
    await this.seedTrips();
    await this.seedTripStops();

    console.log('\n✅ Database seeding completed successfully!');
  }

  async seedStations(): Promise<void> {
    console.log('📍 Seeding stations...');

    await seedDataIfNotExist(
      this.db,
      stations,
      stationsData,
      item => ({
        stationEnglishName: item.stationEnglishName,
      }),
      'Stations',
    );

    const allStations = await this.db.select().from(stations);
    allStations.forEach(station => {
      this.stationNameToIdMap.set(station.stationEnglishName, station.id);
    });

    console.log(`✓ Station mapping built: ${this.stationNameToIdMap.size} stations\n`);
  }

  async seedTrains(): Promise<void> {
    console.log('🚂 Seeding trains...');

    const trainRecords = trainsData.map(train => ({
      trainNumber: train.trainNumber,
    }));

    await seedDataIfNotExist(
      this.db,
      trains,
      trainRecords,
      item => ({
        trainNumber: item.trainNumber,
      }),
      'Trains',
    );

    const allTrains = await this.db.select().from(trains);
    allTrains.forEach(train => {
      this.trainNumberToIdMap.set(train.trainNumber, train.id);
    });

    console.log(`✓ Train mapping built: ${this.trainNumberToIdMap.size} trains\n`);
  }

  async seedSeats(): Promise<void> {
    console.log('💺 Seeding seats...');

    let totalSeatsGenerated = 0;

    for (const trainConfig of trainsData) {
      const trainId = this.trainNumberToIdMap.get(trainConfig.trainNumber);
      if (!trainId) {
        console.warn(`⚠️  Train ${trainConfig.trainNumber} not found, skipping seats`);
        continue;
      }

      const seatsForTrain = this.generateSeatsForTrain(trainId, trainConfig);

      await seedDataIfNotExist(
        this.db,
        seats,
        seatsForTrain,
        item => ({
          trainId: item.trainId,
          coachNumber: item.coachNumber,
          seatNumber: item.seatNumber,
        }),
        `Seats for ${trainConfig.trainNumber}`,
      );

      totalSeatsGenerated += seatsForTrain.length;
    }

    console.log(`✓ Total seats configured: ${totalSeatsGenerated}\n`);
  }

  private generateSeatsForTrain(
    trainId: string,
    trainConfig: TrainConfig,
  ): Array<{
    trainId: string;
    coachNumber: number;
    seatNumber: number;
    class: 'First' | 'Economy' | 'Business';
  }> {
    const seatsArray: Array<{
      trainId: string;
      coachNumber: number;
      seatNumber: number;
      class: 'First' | 'Economy' | 'Business';
    }> = [];

    let currentCoachNumber = 1;

    for (const coachConfig of trainConfig.coaches) {
      for (let i = 0; i < coachConfig.count; i++) {
        for (let seatNum = 1; seatNum <= coachConfig.seatsPerCoach; seatNum++) {
          seatsArray.push({
            trainId,
            coachNumber: currentCoachNumber,
            seatNumber: seatNum,
            class: coachConfig.class,
          });
        }
        currentCoachNumber++;
      }
    }

    return seatsArray;
  }

  async seedTrips(): Promise<void> {
    console.log('🛤️  Seeding trips...');

    const tripsToSeed: Array<{
      trainId: string;
      destinationFrom: string;
      destinationTo: string;
      departureDate: Date;
      routeConfig: RouteConfig;
    }> = [];

    for (const template of tripsTemplates) {
      const routeConfig = this.routeNameToConfigMap.get(template.routeName);
      if (!routeConfig) {
        console.warn(`⚠️  Route ${template.routeName} not found, skipping`);
        continue;
      }

      const trainId = this.trainNumberToIdMap.get(template.trainNumber);
      if (!trainId) {
        console.warn(`⚠️  Train ${template.trainNumber} not found, skipping`);
        continue;
      }

      const fromStationId = this.stationNameToIdMap.get(routeConfig.stations[0]);
      const toStationId = this.stationNameToIdMap.get(
        routeConfig.stations[routeConfig.stations.length - 1],
      );

      if (!fromStationId || !toStationId) {
        console.warn(`⚠️  Stations for route ${template.routeName} not found, skipping`);
        continue;
      }

      // Generate trips for each day offset
      for (const dayOffset of template.daysFromNow) {
        const departureDate = new Date();
        departureDate.setDate(departureDate.getDate() + dayOffset);
        departureDate.setHours(template.departureHour, template.departureMinute, 0, 0);

        tripsToSeed.push({
          trainId,
          destinationFrom: fromStationId,
          destinationTo: toStationId,
          departureDate,
          routeConfig,
        });
      }
    }

    // Seed trips
    const tripRecords = tripsToSeed.map(trip => ({
      trainId: trip.trainId,
      destinationFrom: trip.destinationFrom,
      destinationTo: trip.destinationTo,
      departureDate: trip.departureDate,
    }));

    await seedDataIfNotExist(
      this.db,
      trips,
      tripRecords,
      item => ({
        trainId: item.trainId,
        destinationFrom: item.destinationFrom,
        destinationTo: item.destinationTo,
      }),
      'Trips',
    );

    console.log(`✓ Trips configured: ${tripsToSeed.length}\n`);

    this.tripsWithRoutes = tripsToSeed;
  }

  private tripsWithRoutes: Array<{
    trainId: string;
    destinationFrom: string;
    destinationTo: string;
    departureDate: Date;
    routeConfig: RouteConfig;
  }> = [];

  async seedTripStops(): Promise<void> {
    console.log('🛑 Seeding trip stops...');

    let totalStopsGenerated = 0;

    const allTrips = await this.db.select().from(trips);

    for (const trip of allTrips) {
      const tripWithRoute = this.tripsWithRoutes.find(
        t =>
          t.trainId === trip.trainId &&
          t.destinationFrom === trip.destinationFrom &&
          t.destinationTo === trip.destinationTo,
      );

      if (!tripWithRoute) {
        continue;
      }

      const stopsForTrip = this.generateTripStops(
        trip.id,
        trip.departureDate,
        tripWithRoute.routeConfig,
      );

      if (stopsForTrip.length > 0) {
        await seedDataIfNotExist(
          this.db,
          tripStops,
          stopsForTrip,
          item => ({
            tripId: item.tripId,
            stopOrder: item.stopOrder,
          }),
          `Trip stops for trip ${trip.id.substring(0, 8)}`,
        );

        totalStopsGenerated += stopsForTrip.length;
      }
    }

    console.log(`✓ Total trip stops configured: ${totalStopsGenerated}\n`);
  }

  private generateTripStops(
    tripId: string,
    departureDate: Date,
    routeConfig: RouteConfig,
  ): Array<{
    tripId: string;
    stationId: string;
    arrivalTime: Date;
    stopOrder: number;
  }> {
    const stopsArray: Array<{
      tripId: string;
      stationId: string;
      arrivalTime: Date;
      stopOrder: number;
    }> = [];

    // Skip first station (origin) and last station (destination)
    // They are already represented by the trip itself
    const intermediateStations = routeConfig.stations.slice(1, -1);

    let currentTime = new Date(departureDate);

    for (let i = 0; i < intermediateStations.length; i++) {
      const stationName = intermediateStations[i];
      const stationId = this.stationNameToIdMap.get(stationName);

      if (!stationId) {
        console.warn(`⚠️  Station ${stationName} not found, skipping stop`);
        continue;
      }

      // Calculate arrival time (add average minutes between stops)
      currentTime = new Date(
        currentTime.getTime() + routeConfig.avgMinutesBetweenStops * 60 * 1000,
      );

      stopsArray.push({
        tripId,
        stationId,
        arrivalTime: new Date(currentTime),
        stopOrder: i + 1, // Start from 1
      });
    }

    return stopsArray;
  }
}
