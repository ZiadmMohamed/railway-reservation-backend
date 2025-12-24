import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { CreateTripDTO } from './DTO/create-trip.DTO';
import { UpdateTripDto } from './DTO/update.trip.DTO';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
jest.mock('@thallesp/nestjs-better-auth', () => ({
  Roles: () => jest.fn(), // تحويل Roles إلى دالة وهمية لا تفعل شيئاً
  AuthGuard: jest.fn().mockImplementation(() => ({ canActivate: () => true })),
  AllowAnonymous: () => jest.fn(),
}));
describe('TripsController', () => {
  let controller: TripsController;
  let service: TripsService;

  // إنشاء محاكاة (Mock) للخدمة
  const mockTripsService = {
    CreateTrip: jest.fn(dto => {
      return {
        id: 'uuid-123',
        ...dto,
      };
    }),
    Updatetrip: jest.fn((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [
        {
          provide: TripsService,
          useValue: mockTripsService,
        },
      ],
    })
      // تجاوز الـ Guard إذا أردت اختبار المنطق فقط بدون صلاحيات
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TripsController>(TripsController);
    service = module.get<TripsService>(TripsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CreateTrip', () => {
    it('should create a new trip and return success message', async () => {
      const dto: CreateTripDTO = {
        // أضف البيانات المطلوبة بناءً على الـ DTO الخاص بك
        destinationTo: 'station-1',
        destinationFrom: 'station-2',
        departureDate: new Date(),
        trainId: 'train-1',
      } as any;

      const result = await controller.CreateTrip(dto);

      expect(result).toEqual({
        message: 'trip created successfully',
        data: expect.any(Object),
      });
      expect(service.CreateTrip).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update an existing trip and return success message', async () => {
      const id = 'uuid-123';
      const dto: UpdateTripDto = {
        destinationFrom: 'updated-station',
      };

      const result = await controller.update(id, dto);

      expect(result).toEqual({
        message: 'trip updated successfully',
        data: expect.any(Object),
      });
      expect(service.Updatetrip).toHaveBeenCalledWith(id, dto);
    });
  });
});
