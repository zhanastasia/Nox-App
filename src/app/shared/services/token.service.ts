import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

import { TokenRequest } from './../models/token-request.model';
import { TokenResponse } from './../models/token-response.model';

@Injectable({
   providedIn: 'root'
})
export class TokenService {
   constructor(private httpClient: HttpClient) {}

   get token(): string {
      return localStorage.getItem('idToken');
   }

   set token(idToken: string) {
      localStorage.setItem('idToken', idToken);
   }

   get refreshToken(): string {
      return localStorage.getItem('refreshToken');
   }

   set refreshToken(refreshToken: string) {
      localStorage.setItem('refreshToken', refreshToken);
   }

   getTokenExpirationDate(idToken: string) {
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

   renewToken() {
      const body: TokenRequest = {
         grant_type: 'refresh_token',
         refresh_token: this.refreshToken
      };

      this.httpClient
         .post<TokenResponse>(
            'https://securetoken.googleapis.com/v1/token?key=AIzaSyAfAY0epIj65g7ceQLDwqERnrl91cCPbIQ',
            body
         )
         .subscribe(response => {
            this.token = response.id_token;
         });
   }
}
