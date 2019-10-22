import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

import { RefreshTokenRequest } from '../models/refresh-token-request.model';
import { TokenResponse } from './../models/token-response.model';
import { UserResponse } from '../models/user-response.model';
import { UserRequest } from '../models/user-request.model';
import * as URLConstants from 'src/app/shared/constants/url-constants';
import * as FirebaseConstants from 'src/app/shared/constants/firebase-constants';

@Injectable({
   providedIn: 'root'
})
export class TokenService {
   constructor(private httpClient: HttpClient, private router: Router) {}

   get token(): string {
      return localStorage.getItem('idToken');
   }

   set token(idToken: string) {
      localStorage.setItem('idToken', idToken);
   }

   get refreshToken(): string {
      return localStorage.getItem(FirebaseConstants.GRAND_TYPE);
   }

   set refreshToken(refreshToken: string) {
      localStorage.setItem(FirebaseConstants.GRAND_TYPE, refreshToken);
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
         grant_type: FirebaseConstants.GRAND_TYPE,
         refresh_token: this.refreshToken
      };

      this.httpClient
         .post<TokenResponse>(URLConstants.POST_REFRESH_TOKEN_URL, body)
         .pipe(
            catchError(err => {
               this.router.navigate(['login']);
               throw err;
            })
         )
         .subscribe(response => {
            this.token = response.id_token;
            this.refreshToken = response.refresh_token;
         });
   }
}
