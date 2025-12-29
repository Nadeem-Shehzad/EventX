import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import { GetUserID } from "src/common/decorators/used-id";
import { AccountOwnerShipGuard } from "src/common/guards/ownership.guard";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { RoleCheckGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/user-roles";
import { getCloudinaryStorage } from "src/common/uploads/cloudinary.storage";
import { FileInterceptor } from "@nestjs/platform-express";


@UseGuards(JwtAuthGuard, RoleCheckGuard)
@Controller('user')
export class UserController {

   constructor(private readonly userService: UserService) { }

   @Get('profile')
   @HttpCode(HttpStatus.OK)
   profile(@GetUserID() id: string) {
      return this.userService.getUserProfile(id);
   }


   @UseGuards(AccountOwnerShipGuard)
   @Put(':id')
   @HttpCode(HttpStatus.CREATED)
   @UseInterceptors(
      FileInterceptor('image', {
         storage: getCloudinaryStorage(),
         limits: { fileSize: 5 * 1024 * 1024 },
      })
   )
   updateProfile(
      @Param('id') id: string,
      @Body() dataToUpdate: UpdateUserDTO,
      @UploadedFile() file?: Express.Multer.File
   ) {
      // Check if a new image was actually uploaded
      if (file) {
         const imageData = {
            url: file.path,
            publicId: file.filename,
         };

         dataToUpdate.image = imageData;
      }
      
      return this.userService.updateProfile(id, dataToUpdate);
   }

   
   @UseGuards(AccountOwnerShipGuard)
   @Delete(':id')
   @HttpCode(HttpStatus.OK)
   deleteAccount(@Param('id') id: string) {
      return this.userService.deleteAccount(id);
   }


   // <------ Admin Apis ------>

   @Get('')
   @Roles('admin')
   @HttpCode(HttpStatus.OK)
   getAllUsers() {
      return this.userService.getAllUsers();
   }

   @Get(':id')
   @Roles('admin')
   @HttpCode(HttpStatus.OK)
   getUserByID(@Param('id') id: string) {
      return this.userService.getUserDataByID(id);
   }

   @Put(':id/admin')
   @Roles('admin')
   @HttpCode(HttpStatus.CREATED)
   updateUserProfile(@Param('id') id: string, @Body() dataToUpdate: UpdateUserDTO) {
      return this.userService.updateProfile(id, dataToUpdate);
   }

   @Delete(':id/admin')
   @Roles('admin')
   @HttpCode(HttpStatus.OK)
   deleteUserAccount(@Param('id') id: string) {
      return this.userService.deleteAccount(id);
   }
}