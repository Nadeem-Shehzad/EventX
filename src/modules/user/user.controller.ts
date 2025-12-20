import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import { GetUserID } from "src/common/decorators/used-id";
import { AccountOwnerShipGuard } from "src/common/guards/ownership.guard";
import { UpdateUserDTO } from "./dto/update-user.dto";


@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {

   constructor(private readonly userService: UserService) { }

   @Get('profile')
   @HttpCode(HttpStatus.OK)
   profile(@GetUserID() id: string) {
      return this.userService.getUserProfile(id);
   }

   @Get(':id')
   @HttpCode(HttpStatus.OK)
   getUserByID(@Param('id') id: string) {
      return this.userService.getUserDataByID(id);
   }

   // get all users - admin

   @UseGuards(AccountOwnerShipGuard)
   @Put(':id')
   @HttpCode(HttpStatus.CREATED)
   updateProfile(@Param('id') id: string, @Body() dataToUpdate: UpdateUserDTO) {
      return this.userService.updateProfile(id, dataToUpdate);
   }

   @UseGuards(AccountOwnerShipGuard)
   @Delete(':id')
   @HttpCode(HttpStatus.OK)
   deleteAccount(@Param('id') id: string) {
      return this.userService.deleteAccount(id);
   }
}