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

   getTokenExpirationDate(idToken: string) {
      if (!idToken) {
         return; // To Do: return something
      }

      const decoded = jwt_decode(idToken);
      if (decoded.exp === undefined) {
         return null;
      }

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);

      return date;
   }

   isTokenValid(idToken: string): boolean {
      const tokenExpirationDate = this.getTokenExpirationDate(idToken);
      if (tokenExpirationDate === undefined) {
         return false;
      }

      return new Date().valueOf() < tokenExpirationDate.valueOf();
   }
}
