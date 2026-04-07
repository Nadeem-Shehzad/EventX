import { CanActivate, ExecutionContext } from "@nestjs/common";
import { EventService } from "../event.service";
export declare class EventOwnerShipGuard implements CanActivate {
    private readonly eventService;
    constructor(eventService: EventService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
