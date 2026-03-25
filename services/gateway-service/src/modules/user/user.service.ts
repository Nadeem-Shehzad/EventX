import { Injectable } from "@nestjs/common";
import { HttpService } from "../../common/http/http.service";



@Injectable()
export class UserService {

   constructor(private http: HttpService) { }

   async getUser(id: string) {

      if (!id) return null;

      const user = await this.http.get(`${process.env.IDENTITY_SERVICE_URL}/users/internal/${id}`);
      return {
         ...user,
         id
      }
   }


   async getBookings(id: string, page = 1, limit = 5) {
      if (!id) return [];

      const params = new URLSearchParams();
      params.append('id', id);
      params.append('page', String(page));
      params.append('limit', String(limit));

      const response = await this.http.get(
         `${process.env.BOOKING_SERVICE_URL}/bookings/internal/user-bookings?${params.toString()}`
      );

      const { bookings, meta } = response.data;

      return {
         bookings: bookings.map(booking => ({
            ...booking,
            id: booking._id?.toString() || booking.id,
         })),
         meta,
      };

   }
}