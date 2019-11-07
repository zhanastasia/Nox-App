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
import { Token } from '../models/token';
import * as URLConstants from './../../shared/constants/url-constants';
import * as FirebaseConstants from './../../shared/constants/firebase-constants';
import * as LocalStorageKeys from '../constants/localstorage-keys';

@Injectable({
   providedIn: 'root'
})
export class TokenService {
   tokenTimeout: any;
   decodedToken: Token;

   constructor(private httpClient: HttpClient, private router: Router) {
      if (this.token) {
         this.decodedToken = jwt_decode(this.token);
      } else {
         this.decodedToken = null;
      }
   }

   get token(): string {
      return localStorage.getItem(LocalStorageKeys.ID_TOKEN);
   }

   set token(idToken: string) {
      if (!idToken) {
         this.decodedToken = null;
         clearTimeout(this.tokenTimeout);
         localStorage.removeItem(LocalStorageKeys.ID_TOKEN);
      } else {
         this.decodedToken = jwt_decode(idToken);
         localStorage.setItem(LocalStorageKeys.ID_TOKEN, idToken);

         this.tokenTimeout = setTimeout(() => {
            this.renewToken();
         }, this.tokenExpirationDate - new Date().valueOf());
      }
   }

   get refreshToken(): string {
      return localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN);
   }

   set refreshToken(refreshToken: string) {
      if (!refreshToken) {
         localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN);
      } else {
         localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, refreshToken);
      }
   }

   get tokenExpirationDate(): number {
      const date = new Date(0);

      if (this.decodedToken) {
         date.setUTCSeconds(this.decodedToken.exp);
      }

      return date.valueOf();
   }

   isTokenValid(): boolean {
      if (!this.tokenExpirationDate) {
         return false;
      }

      return new Date().valueOf() < this.tokenExpirationDate;
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

   logout() {
      this.token = null;
      this.refreshToken = null;
      this.router.navigate(['login']);
   }
}
