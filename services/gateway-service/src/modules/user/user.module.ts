import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { HttpService } from "../../common/http/http.service";


@Module({
   providers: [
      UserResolver,
      UserService,
      HttpService
   ]
})

export class UserModule { }