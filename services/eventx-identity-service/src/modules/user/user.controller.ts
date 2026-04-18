import {
   Body, Controller, Delete, Get, HttpCode,
   HttpStatus, Param, Put, UnauthorizedException, UploadedFile,
   UseGuards, UseInterceptors, Headers
} from "@nestjs/common";

import { UserService } from "./user.service";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import {
   ApiBearerAuth, ApiBody, ApiOperation,
   ApiParam, ApiResponse, ApiTags
} from "@nestjs/swagger";
import { UserResponseDTO } from "./dto/user-response.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { getCloudinaryStorage } from "../../common/uploads/cloudinary.storage";
import { Roles } from "../../common/decorators/user-roles";
import { RoleCheckGuard } from "../../common/guards/role.guard";
import { GetUserID } from "../../common/decorators/used-id";
import { AccountOwnerShipGuard } from "../../common/guards/ownership.guard";
import { IdempotencyInterceptor } from "src/common/interceptors/idempotency.interceptor";
import { trace, SpanStatusCode } from '@opentelemetry/api';


const tracer = trace.getTracer('identity-service');


@ApiTags('user')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'users', version: '1' })
export class UserController {

   constructor(private readonly userService: UserService) { }

   @UseGuards(JwtAuthGuard, RoleCheckGuard)
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
      return tracer.startActiveSpan('POST /profile', async (rootSpan) => {
         try {

            rootSpan.setAttributes({
               'http.method': 'POST',
               'route': '/auth/login',
               'user.id': id
            });

            const result = await this.userService.getUserProfile(id);

            rootSpan.setStatus({ code: SpanStatusCode.OK });
            return result;

         } catch (error) {
            const err = error as Error;
            rootSpan.recordException(err);
            rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            throw err;

         } finally {
            rootSpan.end();
         }
      })
   }


   @UseGuards(JwtAuthGuard, RoleCheckGuard, AccountOwnerShipGuard)
   @UseInterceptors(IdempotencyInterceptor)
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


   @UseGuards(JwtAuthGuard, RoleCheckGuard, AccountOwnerShipGuard)
   @UseInterceptors(IdempotencyInterceptor)
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

   @UseGuards(JwtAuthGuard, RoleCheckGuard)
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


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @Get(':id')
   //@Roles('admin')
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


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @UseInterceptors(IdempotencyInterceptor)
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


   @UseGuards(JwtAuthGuard, RoleCheckGuard)
   @UseInterceptors(IdempotencyInterceptor)
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


   // internal Services Communications

   @Get('internal/:id')
   async getUserInternal(
      @Param('id') id: string,
      @Headers('x-internal-api-key') apiKey: string,
   ) {

      if (apiKey !== process.env.INTERNAL_API_KEY) {
         throw new UnauthorizedException('Invalid internal API key');
      }

      return this.userService.getUserDataByID(id);
   }
}