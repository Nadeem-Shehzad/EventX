import {
   BadRequestException,
   Body, Controller, Get, HttpCode,
   HttpStatus, Logger, Post, UploadedFile,
   UseGuards, UseInterceptors
} from "@nestjs/common";
import { EventService } from "./event.service";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { GetUserID } from "src/common/decorators/used-id";
import { RoleCheckGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/user-roles";
import { CreateEventDTO } from "./dto/create-event.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { getCloudinaryStorage } from "src/common/uploads/cloudinary.storage";


@UseGuards(JwtAuthGuard, RoleCheckGuard)
@Controller('event')
export class EventController {

   constructor(private readonly eventService: EventService) { }
   private readonly logger = new Logger(EventService.name);

   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('')
   @Roles('organizer')
   @HttpCode(HttpStatus.CREATED)
   @UseInterceptors(
      FileInterceptor('bannerImage', {
         storage: getCloudinaryStorage(),
         limits: { fileSize: 5 * 1024 * 1024 },
      })
   )
   addEvent(
      @GetUserID() id: string,
      @Body() data: CreateEventDTO,
      @UploadedFile() file?: Express.Multer.File
   ) {
      if (!file) throw new BadRequestException('Image is required');

      const imageData = {
         url: file.path,
         publicId: file.filename // multer-storage-cloudinary puts the public_id here
      };

      data.bannerImage = imageData;
      return this.eventService.createEvent(id, data);
   }


   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Get('')
   @HttpCode(HttpStatus.OK)
   getEvents() {
      return this.eventService.getAllEventsByAggregate();
   }
}