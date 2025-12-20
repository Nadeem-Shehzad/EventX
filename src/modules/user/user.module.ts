import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CommonModule } from "src/common/common.module";
import { AccountOwnerShipGuard } from "src/common/guards/ownership.guard";
import { RoleCheckGuard } from "src/common/guards/role.guard";


@Module({
   imports: [
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      forwardRef(() => CommonModule),
   ],
   controllers: [UserController],
   providers: [UserService, UserRepository, JwtAuthGuard, AccountOwnerShipGuard, RoleCheckGuard],
   exports: [UserService, MongooseModule]
})

export class UserModule { }