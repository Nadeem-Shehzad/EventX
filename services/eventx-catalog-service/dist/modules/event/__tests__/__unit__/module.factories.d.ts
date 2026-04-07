import { EventController } from "../../event.controller";
import { EventService } from "../../event.service";
export declare function createEventTestingModule(eventServiceMock: any): Promise<{
    controller: EventController;
    service: EventService;
}>;
