import { EventQueryDTO } from "../../dto/event-query.dto";
import { EventResponseDTO } from "../../dto/event-response.dto";
import { EventStatusDTO } from "../../dto/event-status.dto";
import { PaginationDTO } from "../../dto/pagination.dto";
import { UpdateEventDTO } from "../../dto/update-event.dto";
import { EventStatus, EventType, EventVisibility } from "../../enums/event.enums";
import { EventController } from "../../event.controller";
import { EventService } from "../../event.service";
import { createEventTestingModule } from "./module.factories";
import { Readable } from 'stream';

import { BadRequestException } from '@nestjs/common';
import { BannerImageDTO, CreateEventDTO, TicketTypeDto } from "../../dto/create-event.dto";



describe('EventController - UploadImage', () => {
   let controller: EventController;

   beforeEach(async () => {
      const module = await createEventTestingModule({});
      controller = module.controller;
   });

   it('should return image data when file is provided', () => {
      const mockFile: Express.Multer.File = {
         fieldname: 'image',
         originalname: 'test.jpg',
         encoding: '7bit',
         mimetype: 'image/jpeg',
         size: 1024,
         destination: '/tmp',
         filename: 'public_id_123',
         path: 'https://res.cloudinary.com/demo/image/upload/v123/test.jpg',
         buffer: Buffer.from(''),
         stream: new Readable(),
      };

      const result = controller.UploadImage(mockFile);

      expect(result).toEqual({
         url: mockFile.path,
         publicId: mockFile.filename,
      });
   });

   it('should throw BadRequestException when file is missing', () => {
      expect(() => controller.UploadImage(undefined)).toThrow(BadRequestException);
      expect(() => controller.UploadImage(undefined)).toThrow('Image is required');
   });
});


describe('EventController - addEvent', () => {
   let controller: EventController;
   let service: EventService;

   const mockFile: Express.Multer.File = {
      fieldname: 'bannerImage',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      destination: '/tmp',
      filename: 'public_id_123',
      path: 'https://res.cloudinary.com/demo/image/upload/v123/test.jpg',
      buffer: Buffer.from(''),
      stream: new Readable(),
   };

   const mockEventDTO: CreateEventDTO = {
      title: 'Test Event',
      description: 'Event description',
      category: 'sports',
      tags: 'sports',
      eventType: EventType.OFFLINE,
      startDateTime: new Date(),
      endDateTime: new Date(),
      timezone: 'Asia/Karachi',
      capacity: 200,
      isPaid: false,
      bannerImage: new BannerImageDTO,
      status: EventStatus.DRAFT,
      visibility: EventVisibility.PUBLIC,
      registrationDeadline: new Date(),
      ticketTypes: [new TicketTypeDto()]
   };

   const createdEventResponse = {
      ...mockEventDTO,
      _id: 'event_id_123',
      bannerImage: {
         url: mockFile.path,
         publicId: mockFile.filename,
      },
   };

   beforeEach(async () => {
      const module = await createEventTestingModule({
         createEvent: jest.fn().mockResolvedValue(mockEventDTO)
      });

      controller = module.controller;
      service = module.service;
   });

   it('should create event with banner image', async () => {
      const userId = 'user_123';

      const result = await controller.addEvent(userId, mockEventDTO);

      expect(service.createEvent).toHaveBeenCalledWith(userId, mockEventDTO);
      //expect(result).toEqual(createdEventResponse);
   });
});


describe('EventController - Update Events', () => {
   let controller: EventController;
   let service: EventService;

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
   }];

   beforeEach(async () => {
      const module = await createEventTestingModule({
         updateEvent: jest.fn().mockResolvedValue(mockEventResponse)
      });

      controller = module.controller;
      service = module.service;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call eventService.updateEvents and return DTO response', async () => {

      const id = '6946bb33d16c4c03c0f00000';
      const pagination: UpdateEventDTO = { title: 'T20' };

      const result = await controller.updateEvent(id, pagination);

      expect(service.updateEvent).toHaveBeenCalledWith(id, pagination);
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining(mockEventResponse[0])]));
   });
});


describe('EventController - Get Events', () => {
   let controller: EventController;
   let service: EventService;

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
   }];

   beforeEach(async () => {
      const module = await createEventTestingModule({
         getAllEventsByAggregate: jest.fn().mockResolvedValue(mockEventResponse)
      });

      controller = module.controller;
      service = module.service;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call eventService.getEvents and return DTO response', async () => {

      const page = 1;
      const limit = 10;

      const pagination: PaginationDTO = { page, limit };

      const result = await controller.getEvents(pagination);

      expect(service.getAllEventsByAggregate).toHaveBeenCalledWith(page, limit);
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining(mockEventResponse[0])]));
   });
});


describe('EventController - Get Events By Filters', () => {
   let controller: EventController;
   let service: EventService;

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
   }];

   beforeEach(async () => {
      const module = await createEventTestingModule({
         getEventsByFilter: jest.fn().mockResolvedValue(mockEventResponse)
      });

      controller = module.controller;
      service = module.service;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call eventService.getEventsByFilter and return DTO response', async () => {

      const rawQuery: EventQueryDTO = {
         category: "sports",
         tags: ["cricket,worldcup,t20"],
         city: "Karachi",
         search: "world cup",
         page: 1,
         limit: 10
      };

      const result = await controller.getEventsByFilter(rawQuery);

      expect(service.getEventsByFilter).toHaveBeenCalledWith(rawQuery);
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining(mockEventResponse[0])]));
   });
});


describe('EventController - Get Free Events', () => {
   let controller: EventController;
   let service: EventService;

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

      isPaid: true
   }];

   beforeEach(async () => {
      const module = await createEventTestingModule({
         getFreeEvents: jest.fn().mockResolvedValue(mockEventResponse)
      });

      controller = module.controller;
      service = module.service;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call eventService.getFreeEvents and return DTO response', async () => {

      const page = 1;
      const limit = 10;

      const pagination: PaginationDTO = { page, limit };

      const result = await controller.getFreeEvents(pagination);

      expect(service.getFreeEvents).toHaveBeenCalledWith(page, limit);
      expect(service.getFreeEvents).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining(mockEventResponse[0])]));
   });
});


describe('EventController - Get Paid Events', () => {
   let controller: EventController;
   let service: EventService;

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

      isPaid: true
   }];

   beforeEach(async () => {
      const module = await createEventTestingModule({
         getPaidEvents: jest.fn().mockResolvedValue(mockEventResponse)
      });

      controller = module.controller;
      service = module.service;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call eventService.getPaidEvents and return DTO response', async () => {

      const page = 1;
      const limit = 10;

      const pagination: PaginationDTO = { page, limit };

      const result = await controller.getPaidEvents(pagination);

      expect(service.getPaidEvents).toHaveBeenCalledWith(page, limit);
      expect(service.getPaidEvents).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining(mockEventResponse[0])]));
   });
});


describe('EventController - Get Oragnizer Events', () => {
   let controller: EventController;
   let service: EventService;

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

      isPaid: true
   }];

   beforeEach(async () => {
      const module = await createEventTestingModule({
         getOrganizerEvents: jest.fn().mockResolvedValue(mockEventResponse)
      });

      controller = module.controller;
      service = module.service;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call eventService.getPaidEvents and return DTO response', async () => {

      const id = '6946bb33d16c4c03c0f00000';
      const page = 1;
      const limit = 10;

      const result = await controller.getOrganizerEvents(id, page, limit);

      expect(service.getOrganizerEvents).toHaveBeenCalledWith(id, page, limit);
      expect(service.getOrganizerEvents).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining(mockEventResponse[0])]));
   });
});


describe('EventController - Get Oragnizer Own Events', () => {
   let controller: EventController;
   let service: EventService;

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

      isPaid: true
   }];

   beforeEach(async () => {
      const module = await createEventTestingModule({
         getOrganizerOwnEvents: jest.fn().mockResolvedValue(mockEventResponse)
      });

      controller = module.controller;
      service = module.service;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call eventService.Get Oragnizer Own Events and return DTO response', async () => {

      const id = '6946bb33d16c4c03c0f00000';
      const page = 1;
      const limit = 10;

      const result = await controller.getOrganizerOwnEvents(id, page, limit);

      expect(service.getOrganizerOwnEvents).toHaveBeenCalledWith(id, page, limit);
      expect(service.getOrganizerOwnEvents).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining(mockEventResponse[0])]));
   });
});


describe('EventController - Get Events By Status', () => {
   let controller: EventController;
   let service: EventService;

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

      isPaid: true
   }];

   beforeEach(async () => {
      const module = await createEventTestingModule({
         filterEventsByStatus: jest.fn().mockResolvedValue(mockEventResponse)
      });

      controller = module.controller;
      service = module.service;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call eventService.filterEventsByStatus and return DTO response', async () => {

      const page = 1;
      const limit = 10;
      const query: EventStatusDTO = {
         status: EventStatus.PUBLISHED
      }

      const result = await controller.getEventsByStatus(query, page, limit);

      expect(service.filterEventsByStatus).toHaveBeenCalledWith(query.status, page, limit);
      expect(service.filterEventsByStatus).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.arrayContaining([expect.objectContaining(mockEventResponse[0])]));
   });
});


describe('EventController - Get Status Summary', () => {
   let controller: EventController;
   let service: EventService;

   const mockEventResponse: EventResponseDTO[] = [];

   beforeEach(async () => {
      const module = await createEventTestingModule({
         eventStatusSummary: jest.fn().mockResolvedValue(mockEventResponse)
      });

      controller = module.controller;
      service = module.service;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call eventService.eventStatusSummary and return DTO response', async () => {

      const result = await controller.eventsStatusSummary();

      expect(service.eventStatusSummary).toHaveBeenCalledWith();
      expect(service.eventStatusSummary).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockEventResponse);
   });
});


describe('EventController - Get Publish Event', () => {
   let controller: EventController;
   let service: EventService;

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

      isPaid: true
   }];

   beforeEach(async () => {
      const module = await createEventTestingModule({
         publishEvent: jest.fn().mockResolvedValue(mockEventResponse)
      });

      controller = module.controller;
      service = module.service;
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   it('should call eventService.publishEvent and return DTO response', async () => {

      const eventId = '6946bb33d16c4c03c0f00000';
      const organizerId = '6946bb33d16c4c03c0f00000';

      const result = await controller.publishEvent(eventId, organizerId);

      expect(service.publishEvent).toHaveBeenCalledWith(eventId, organizerId);
      expect(service.publishEvent).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockEventResponse);
   });
});