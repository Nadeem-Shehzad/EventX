import { Test, TestingModule } from "@nestjs/testing";
import { RedisService } from "src/redis/redis.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { EventController } from "../../event.controller";
import { EventService } from "../../event.service";
import { CanActivate } from "@nestjs/common";
import { RoleCheckGuard } from "src/common/guards/role.guard";
import { EventOwnerShipGuard } from "../../guards/ownership.guard";


class MockGuard implements CanActivate {
   canActivate() {
      return true;
   }
}


export async function createEventTestingModule(eventServiceMock: any) {
   const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
         { provide: EventService, useValue: eventServiceMock },
         { provide: RedisService, useValue: {} }
      ]
   })
      .overrideGuard(JwtAuthGuard).useValue(new MockGuard())
      .overrideGuard(RoleCheckGuard).useValue(new MockGuard())
      .overrideGuard(EventOwnerShipGuard).useValue(new MockGuard())
      .compile();

   return {
      controller: module.get<EventController>(EventController),
      service: module.get<EventService>(EventService),
   };
}