import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

import { RefreshTokenRequest } from './../models/token-request.model';
import { TokenResponse } from './../models/token-response.model';
import { UserResponse } from '../models/user-response.model';
import { UserRequest } from '../models/user-request.model';
import * as URLConstants from 'src/app/shared/constants/url-constants';

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

   requstToken(requestBody: UserRequest, isSignUpMode: boolean) {
      const auth$: Observable<UserResponse> = isSignUpMode
         ? this.httpClient.post<UserResponse>(URLConstants.POST_SIGN_UP_USER_URL, requestBody)
         : this.httpClient.post<UserResponse>(URLConstants.POST_SIGN_IN_USER_URL, requestBody);

      return auth$;
   }

   renewToken() {
      const body: RefreshTokenRequest = {
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
            this.refreshToken = response.refresh_token;
         });
   }
}
