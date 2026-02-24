import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { CommonModule } from "../../common/common.module";
import { LoggingModule } from "../../logging/logging.module";


@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      LoggingModule,
      CommonModule,
   ],
   controllers: [UserController],
   providers: [UserService, UserRepository],
   exports: [UserService, MongooseModule]
})

export class UserModule { }