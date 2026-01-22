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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserResponseDTO } from "./dto/user-response.dto";


@ApiTags('user')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleCheckGuard)
@Controller({ path: 'user', version: '1' })
export class UserController {

   constructor(private readonly userService: UserService) { }

   @Get('profile')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get user profile' })
   @ApiResponse({
      status: 200,
      type: UserResponseDTO
   })
   @ApiResponse({ status: 401, description: 'unauthorized' })
   @ApiResponse({ status: 404, description: 'user not found' })
   @ApiResponse({ status: 500, description: 'server error' })
   profile(@GetUserID() id: string) {
      return this.userService.getUserProfile(id);
   }


   @UseGuards(AccountOwnerShipGuard)
   @Put(':id')
   @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: 'Update profile' })
   @ApiParam({
      name: 'id',
      required: true,
      description: 'User ID to be updated',
      schema: {
         type: 'string',
         example: '65b12c8a9f4c2e001f3a9d21',
      },
   })
   @ApiResponse({
      status: 200,
      description: 'Profile updated successfully'
   })
   @ApiResponse({ status: 401, description: 'unauthorized' })
   @ApiResponse({ status: 404, description: 'user not found' })
   @ApiResponse({ status: 500, description: 'server error' })
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
   @ApiOperation({ summary: 'Delete profile' })
   @ApiParam({
      name: 'id',
      required: true,
      description: 'User ID to be deleted',
      schema: {
         type: 'string',
         example: '65b12c8a9f4c2e001f3a9d21',
      },
   })
   @ApiResponse({
      status: 200,
      description: 'Account deleted successfully'
   })
   @ApiResponse({ status: 401, description: 'unauthorized' })
   @ApiResponse({ status: 404, description: 'user not found' })
   @ApiResponse({ status: 500, description: 'server error' })
   deleteAccount(@Param('id') id: string) {
      return this.userService.deleteAccount(id);
   }


   // <------ Admin Apis ------>

   @Get('')
   @Roles('admin')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get all users' })
   @ApiResponse({
      status: 200,
      type: [UserResponseDTO]
   })
   @ApiResponse({ status: 500, description: 'server error' })
   getAllUsers() {
      return this.userService.getAllUsers();
   }


   @Get(':id')
   @Roles('admin')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Get user by id' })
   @ApiParam({
      name: 'id',
      required: true,
      description: 'User ID to be fetched',
      schema: {
         type: 'string',
         example: '65b12c8a9f4c2e001f3a9d21',
      },
   })
   @ApiResponse({
      status: 200,
      type: UserResponseDTO
   })
   @ApiResponse({ status: 401, description: 'unauthorized' })
   @ApiResponse({ status: 404, description: 'user not found' })
   @ApiResponse({ status: 500, description: 'server error' })
   getUserByID(@Param('id') id: string) {
      return this.userService.getUserDataByID(id);
   }


   @Put(':id/admin')
   @Roles('admin')
   @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: 'Admin updates user profile' })
   @ApiParam({
      name: 'id',
      required: true,
      description: 'User ID to be updated',
      schema: {
         type: 'string',
         example: '65b12c8a9f4c2e001f3a9d21',
      },
   })
   @ApiBody({
      type: UpdateUserDTO,
      description: 'Fields to update (partial allowed)',
   })
   @ApiResponse({
      status: 201,
      description: 'Profile updated successfully'
   })
   @ApiResponse({ status: 401, description: 'unauthorized' })
   @ApiResponse({ status: 404, description: 'user not found' })
   @ApiResponse({ status: 500, description: 'server error' })
   updateUserProfile(@Param('id') id: string, @Body() dataToUpdate: UpdateUserDTO) {
      return this.userService.updateProfile(id, dataToUpdate);
   }


   @Delete(':id/admin')
   @Roles('admin')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Delete user account' })
   @ApiParam({
      name: 'id',
      required: true,
      description: 'User ID to be deleted',
      schema: {
         type: 'string',
         example: '65b12c8a9f4c2e001f3a9d21',
      },
   })
   @ApiResponse({
      status: 200,
      description: 'Account deleted successfully'
   })
   @ApiResponse({ status: 401, description: 'unauthorized' })
   @ApiResponse({ status: 404, description: 'user not found' })
   @ApiResponse({ status: 500, description: 'server error' })
   deleteUserAccount(@Param('id') id: string) {
      return this.userService.deleteAccount(id);
   }
}