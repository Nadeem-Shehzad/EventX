import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../../user.controller";
import { UserService } from "../../user.service";
import { UserRepository } from "../../user.repository";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AccountOwnerShipGuard } from "src/common/guards/ownership.guard";
import { RoleCheckGuard } from "src/common/guards/role.guard";
import { MockGuard } from "./user.controller.spec";


export async function createUserTestingModule(userMockService: any) {
   const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
         { provide: UserService, useValue: userMockService },
         { provide: UserRepository, useValue: {} },
      ]
   })
   .overrideGuard(JwtAuthGuard).useValue(new MockGuard())
   .overrideGuard(AccountOwnerShipGuard).useValue(new MockGuard())
   .overrideGuard(RoleCheckGuard).useValue(new MockGuard())
   .compile();

   return {
      controller: module.get<UserController>(UserController),
      service: module.get<UserService>(UserService)
   }
}