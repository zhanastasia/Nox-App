import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
   providedIn: 'root'
})
export class TokenService {
   get token(): string {
      return localStorage.getItem('idToken');
   }

   set token(idToken: string) {
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

   isTokenValid(idToken?: string): boolean {
      if (!idToken) {
         idToken = this.token;
      }

      const tokenExpirationDate = this.getTokenExpirationDate(idToken);
      if (!tokenExpirationDate) {
         return false;
      }

      return new Date().valueOf() < tokenExpirationDate.valueOf();
   }
}
