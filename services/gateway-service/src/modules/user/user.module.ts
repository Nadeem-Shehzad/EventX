import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { HttpService } from "../../common/http/http.service";
import { EventModule } from "../event/event.module";
import { BookingResolver } from "./booking.resolver";


@Module({
   imports: [EventModule],
   providers: [
      UserResolver,
      UserService,
      BookingResolver,
      HttpService
   ]
})

export class UserModule { }