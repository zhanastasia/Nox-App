import jwt_decode from 'jwt-decode';
import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class TokenService {
   getToken(): string {
      return localStorage.getItem('idToken');
   }

   setToken(idToken: string) {
      localStorage.setItem('idToken', idToken);
   }

   getTokenExpirationDate(idToken: string): Date {
      if (!idToken) {
         return null;
      }

      const decoded = jwt_decode(idToken);
      if (!decoded.exp) {
         return null;
      }

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);

      return date;
   }

   isTokenValid(idToken: string): boolean {
      const tokenExpirationDate = this.getTokenExpirationDate(idToken);
      if (!tokenExpirationDate) {
         return false;
      }

      return new Date().valueOf() < tokenExpirationDate.valueOf();
   }
}
