import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { LoggingModule } from "../../logging/logging.module";
import { MyRedisModule } from "src/redis/redis.module";


@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      LoggingModule,
      MyRedisModule,
   ],
   controllers: [UserController],
   providers: [UserService, UserRepository],
   exports: [UserService, MongooseModule]
})

export class UserModule { }