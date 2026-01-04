import { Test, TestingModule } from "@nestjs/testing";
import { EventResponseDTO } from "../../dto/event-response.dto";
import { EventService } from "../../event.service";
import { EventRespository } from "../../event.repository";
import { RedisService } from "src/redis/redis.service";
import { Queue } from "bullmq";
import { QUEUES } from "src/queue/queue.constants";


const mockQueue = {
   add: jest.fn(),          // mock add job
   on: jest.fn(),           // mock events
   pause: jest.fn(),
   resume: jest.fn(),
} as unknown as Queue;

const redisService = {
   get: jest.fn(),
   set: jest.fn()
}

const mockEventResponse: EventResponseDTO[] = [{
   _id: "65a7c2f1b9c1a9d0f2e91a23",
   title: "T20 World Cup 2025",
   description: "An international cricket tournament featuring top teams.",
   category: "Sports",
   tags: ["cricket", "worldcup", "sports"],
   eventType: "offline",

   location: {
      venueName: "National Stadium",
      address: "Main Stadium Road",
      city: "Karachi",
      country: "Pakistan",
      latitude: 24.8607,
      longitude: 67.0011
   },

   bannerImage: {
      url: "https://cdn.eventx.com/events/t20-worldcup/banner.jpg",
      publicId: "events/t20-worldcup/banner"
   },

   startDateTime: new Date("2025-02-10T14:00:00.000Z"),
   endDateTime: new Date("2025-02-10T22:00:00.000Z"),
   timezone: "Asia/Karachi",

   capacity: 30000,
   registeredCount: 18250,

   isPaid: true,
   priceRange: {
      min: 5000,
      max: 25000,
      currency: "PKR"
   }
}];


describe('EventService - Get Events', () => {
   let service: EventService;

   const eventRepository = {
      getEventsByAggregation: jest.fn()
   }


   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            EventService,
            { provide: EventRespository, useValue: eventRepository },
            { provide: RedisService, useValue: redisService },
            { provide: `BullQueue_${QUEUES.EVENT_IMAGE}`, useValue: {} }
         ]
      }).compile();

      service = module.get<EventService>(EventService);
   });


   it('should be defined', () => {
      expect(service).toBeDefined();
   });


   it('should give all events data from redis', async () => {

      const cachedResponse = {
         events: mockEventResponse.map(e => ({
            ...e,
            startDateTime: e.startDateTime.toISOString(),
            endDateTime: e.endDateTime.toISOString(),
         })),
         meta: { total: mockEventResponse.length, page: 1, limit: 10, totalPages: 1 },
      };

      redisService.get.mockResolvedValueOnce(JSON.stringify(cachedResponse));

      const result = await service.getAllEventsByAggregate();

      expect(eventRepository.getEventsByAggregation).not.toHaveBeenCalled();
      expect(result).toEqual(cachedResponse);
   });


   it('should give all events data from DB', async () => {

      redisService.get.mockResolvedValueOnce(null);

      eventRepository.getEventsByAggregation.mockResolvedValueOnce({
         events: mockEventResponse,
         total: mockEventResponse.length,
      });

      const result = await service.getAllEventsByAggregate(1, 10);

      expect(eventRepository.getEventsByAggregation).toHaveBeenCalledWith(1, 10);
      expect(eventRepository.getEventsByAggregation).toHaveBeenCalledTimes(1);
      expect(redisService.set).toHaveBeenCalledWith(
         'all-event-1-10',
         expect.any(String),
         120
      );
      expect(result.meta.total).toBe(mockEventResponse.length);
   });
});


describe('EventService - Get Free Events', () => {
   let service: EventService;

   const eventRepository = {
      getFreeEvents: jest.fn()
   }

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            EventService,
            { provide: EventRespository, useValue: eventRepository },
            { provide: RedisService, useValue: redisService },
            { provide: `BullQueue_${QUEUES.EVENT_IMAGE}`, useValue: {} }
         ]
      }).compile();

      service = module.get<EventService>(EventService);
   });


   it('should be defined', () => {
      expect(service).toBeDefined();
   });


   it('should give all events data from redis', async () => {

      const cachedResponse = {
         events: mockEventResponse.map(e => ({
            ...e,
            startDateTime: e.startDateTime.toISOString(),
            endDateTime: e.endDateTime.toISOString(),
         })),
         meta: { total: mockEventResponse.length, page: 1, limit: 10, totalPages: 1 },
      };

      redisService.get.mockResolvedValueOnce(JSON.stringify(cachedResponse));

      const result = await service.getFreeEvents();

      expect(eventRepository.getFreeEvents).not.toHaveBeenCalled();
      expect(result).toEqual(cachedResponse);
   });


   it('should give all events data from DB', async () => {

      redisService.get.mockResolvedValueOnce(null);

      eventRepository.getFreeEvents.mockResolvedValueOnce({
         events: mockEventResponse,
         total: mockEventResponse.length,
      });

      const result = await service.getFreeEvents(1, 10);

      expect(eventRepository.getFreeEvents).toHaveBeenCalledWith(1, 10);
      expect(eventRepository.getFreeEvents).toHaveBeenCalledTimes(1);
      expect(redisService.set).toHaveBeenCalledWith(
         'free-event-1-10',
         expect.any(String),
         120
      );
      expect(result.meta.total).toBe(mockEventResponse.length);
   });
});


describe('EventService - Get Filter Based Events', () => {
   let service: EventService;

   const eventRepository = {
      getEventsByFilter: jest.fn()
   }

   beforeEach(async () => {
      jest.clearAllMocks();

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            EventService,
            { provide: EventRespository, useValue: eventRepository },
            { provide: RedisService, useValue: {} },
            { provide: `BullQueue_${QUEUES.EVENT_IMAGE}`, useValue: {} }
         ]
      }).compile();

      service = module.get<EventService>(EventService);
   });


   it('should be defined', () => {
      expect(service).toBeDefined();
   });


   it('should be category based data', async () => {

      const filters: any = {
         status: 'published',
         isDeleted: false
      }
      filters.category = 'sports';

      eventRepository.getEventsByFilter.mockResolvedValueOnce({
         events: mockEventResponse,
         meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1
         }
      });

      const result = await service.getEventsByFilter(filters);

      expect(eventRepository.getEventsByFilter).toHaveBeenCalledWith(filters, { limit: 10, skip: 0 });
      expect(eventRepository.getEventsByFilter).toHaveBeenCalledTimes(1);
      expect(result.meta.total).toBe(mockEventResponse.length);
   });

   it('should be Tags based data', async () => {

      const filter: any = {
         status: 'published',
         isDeleted: false,
         tags: ['sports'],
      };

      eventRepository.getEventsByFilter.mockResolvedValueOnce({
         events: mockEventResponse,
         meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1
         }
      });

      const result = await service.getEventsByFilter(filter);

      expect(eventRepository.getEventsByFilter)
         .toHaveBeenLastCalledWith(
            { status: 'published', isDeleted: false, tags: { $in: ['sports'] } },
            { limit: 10, skip: 0 }
         );
      expect(eventRepository.getEventsByFilter).toHaveBeenCalledTimes(1);
      expect(result.meta.total).toBe(mockEventResponse.length);
   });

   it('should be Search based data', async () => {

      const search = 'T20';
      const filter: any = {
         status: 'published',
         isDeleted: false,
         search: 'T20',
      };

      eventRepository.getEventsByFilter.mockResolvedValueOnce({
         events: mockEventResponse,
         meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1
         }
      });

      const result = await service.getEventsByFilter(filter);

      expect(eventRepository.getEventsByFilter)
         .toHaveBeenLastCalledWith(
            { status: 'published', isDeleted: false, title: { $regex: search, $options: 'i' } },
            { limit: 10, skip: 0 }
         );
      expect(eventRepository.getEventsByFilter).toHaveBeenCalledTimes(1);
      expect(result.meta.total).toBe(mockEventResponse.length);
   });


   it('should be City based data', async () => {

      const filter: any = {
         status: 'published',
         isDeleted: false,
         city: 'Lahore',
      };

      eventRepository.getEventsByFilter.mockResolvedValueOnce({
         events: mockEventResponse,
         meta: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1
         }
      });

      const result = await service.getEventsByFilter(filter);

      expect(eventRepository.getEventsByFilter)
         .toHaveBeenLastCalledWith(
            {
               status: 'published',
               isDeleted: false,
               'location.city': 'Lahore',
            },
            { limit: 10, skip: 0 }
         );
      expect(eventRepository.getEventsByFilter).toHaveBeenCalledTimes(1);
      expect(result.meta.total).toBe(mockEventResponse.length);
   });
});


describe('EventService - Get Free Events', () => {
   let service: EventService;

   const eventRepository = {
      filterEventsByStatus: jest.fn()
   }

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            EventService,
            { provide: EventRespository, useValue: eventRepository },
            { provide: RedisService, useValue: {} },
            { provide: `BullQueue_${QUEUES.EVENT_IMAGE}`, useValue: {} }
         ]
      }).compile();

      service = module.get<EventService>(EventService);
   });


   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('should Give Events based on Status', async () => {

      const status = 'published';


      eventRepository.filterEventsByStatus.mockResolvedValueOnce({
         events: mockEventResponse,
         total: mockEventResponse.length
      });

      const result = await service.filterEventsByStatus(status, 1, 10);

      expect(eventRepository.filterEventsByStatus).toHaveBeenCalledTimes(1);
      expect(eventRepository.filterEventsByStatus).toHaveBeenCalledWith('published', 1, 10);
      expect(result.meta.total).toBe(mockEventResponse.length);
   });
});


describe('EventService - Get Visbility Summary', () => {
   let service: EventService;

   const eventRepository = {
      eventVisibilitySummary: jest.fn()
   }

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            EventService,
            { provide: EventRespository, useValue: eventRepository },
            { provide: RedisService, useValue: {} },
            { provide: `BullQueue_${QUEUES.EVENT_IMAGE}`, useValue: {} }
         ]
      }).compile();

      service = module.get<EventService>(EventService);
   });


   it('should be defined', () => {
      expect(service).toBeDefined();
   });

   it('should Give Events based on Status', async () => {

      const result = await service.eventVisibilitySummary();

      expect(eventRepository.eventVisibilitySummary).toHaveBeenCalledWith();
      expect(eventRepository.eventVisibilitySummary).toHaveBeenCalledTimes(1);
   });
});