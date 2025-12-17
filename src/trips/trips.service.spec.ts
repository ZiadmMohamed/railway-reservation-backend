import { Test, TestingModule } from '@nestjs/testing';
import { TripsService } from './trips.service';
import { TripsRepo } from './repository/trips.repo';
import { TrainsRepository } from './../trains/repositories/trains.repository';
import { stationRepo } from 'src/stations/repository/station.repo';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TripsService', () => {
  let service: TripsService;
  let tripsRepo: TripsRepo;

  // إعداد الـ Mocks
  const mockTripsRepo = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockTrainsRepo = {
    findOne: jest.fn(),
  };

  const mockStationsRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        { provide: TripsRepo, useValue: mockTripsRepo },
        { provide: TrainsRepository, useValue: mockTrainsRepo },
        { provide: stationRepo, useValue: mockStationsRepo },
      ],
    }).compile();

    service = module.get<TripsService>(TripsService);
    tripsRepo = module.get<TripsRepo>(TripsRepo);
  });

  afterEach(() => {
    jest.clearAllMocks(); // تنظيف الاستدعاءات بين الاختبارات
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CreateTrip', () => {
    const createTripDto = {
      trainId: 'train-uuid',
      destinationFrom: 'station-a',
      destinationTo: 'station-b',
    };

    it('should successfully create a trip when all entities exist', async () => {
      // ترتيب (Arrange)
      mockTrainsRepo.findOne.mockResolvedValue({ id: 'train-uuid' });
      mockStationsRepo.findOne.mockResolvedValueOnce({ id: 'station-a' }); // لـ destinationFrom
      mockStationsRepo.findOne.mockResolvedValueOnce({ id: 'station-b' }); // لـ destinationTo
      mockTripsRepo.create.mockResolvedValue({ id: 'trip-123', ...createTripDto });

      // تنفيذ (Act)
      const result = await service.CreateTrip(createTripDto as any);

      // تأكيد (Assert)
      expect(result).toHaveProperty('id', 'trip-123');
      expect(tripsRepo.create).toHaveBeenCalledWith(createTripDto);
    });

    it('should throw NotFoundException if train is not found', async () => {
      mockTrainsRepo.findOne.mockResolvedValue(null);

      await expect(service.CreateTrip(createTripDto as any)).rejects.toThrow(
        new NotFoundException('train not found'),
      );
    });

    it('should throw NotFoundException if destinationFrom is not found', async () => {
      mockTrainsRepo.findOne.mockResolvedValue({ id: 'train-uuid' });
      mockStationsRepo.findOne.mockResolvedValueOnce(null); // المحطة الأولى غير موجودة

      await expect(service.CreateTrip(createTripDto as any)).rejects.toThrow(
        new NotFoundException('destinationFrom not found'),
      );
    });
  });

  describe('findOne', () => {
    it('should return a trip if it exists', async () => {
      const mockTrip = { id: 'trip-1' };
      mockTripsRepo.findOne.mockResolvedValue(mockTrip);

      const result = await service.findOne('trip-1');
      expect(result).toEqual(mockTrip);
    });

    it('should throw NotFoundException if trip does not exist', async () => {
      mockTripsRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(new NotFoundException('trip not found'));
    });
  });

  describe('Updatetrip', () => {
    const updateDto = { destinationFrom: 'new-station' };

    it('should update and return the trip if it exists', async () => {
      mockTripsRepo.findOne.mockResolvedValue({ id: 'trip-1' }); // دالة findOne الداخلية
      mockTripsRepo.update.mockResolvedValue({ id: 'trip-1', ...updateDto });

      const result = await service.Updatetrip('trip-1', updateDto as any);

      expect(result.destinationFrom).toBe('new-station');
      expect(tripsRepo.update).toHaveBeenCalledWith('trip-1', updateDto);
    });

    it('should throw BadRequestException if update fails', async () => {
      mockTripsRepo.findOne.mockResolvedValue({ id: 'trip-1' });
      mockTripsRepo.update.mockResolvedValue(null); // فشل التحديث

      await expect(service.Updatetrip('trip-1', updateDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
