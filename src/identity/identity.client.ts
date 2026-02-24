import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";


@Injectable()
export class IdentityClient {

   private readonly logger = new Logger(IdentityClient.name);
   constructor(private readonly httpService: HttpService) { }

   async getUserById(userId: string): Promise<{ name: string, email: string } | null> {
      try {
         
         const response = await firstValueFrom(
            this.httpService.get(`/user/internal/${userId}`,{
               headers: {
                  'x-internal-api-key': process.env.INTERNAL_API_KEY
               }
            })
         );

         return response.data;
         
      } catch (error) {
         this.logger.error(`Failed to fetch user ${userId}: ${error.message}`);
         return null;
      }
   }
}