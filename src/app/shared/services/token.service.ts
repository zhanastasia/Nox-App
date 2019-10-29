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
      this.decodedToken = jwt_decode(this.token);
      console.log('constructor', this.decodedToken);
   }

   get token(): string {
      return localStorage.getItem(LocalStorageKeys.ID_TOKEN);
   }

   set token(idToken: string) {
      localStorage.setItem(LocalStorageKeys.ID_TOKEN, idToken);
   }

   get refreshToken(): string {
      return localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN);
   }

   set refreshToken(refreshToken: string) {
      localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, refreshToken);
   }

   getTokenExpirationDate() {
      const date = new Date(0);
      date.setUTCSeconds(this.decodedToken.exp);

      return date;
   }

   isTokenValid(idToken?: string): boolean {
      if (!idToken) {
         idToken = this.token;
      }

      const tokenExpirationDate = this.getTokenExpirationDate();
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
            this.decodedToken.exp = +response.expires_in;
         });
   }

   removeToken() {
      localStorage.removeItem(LocalStorageKeys.ID_TOKEN);
      localStorage.removeItem(LocalStorageKeys.REFRESH_TOKEN);
   }

   tokenTimer(expDate: number, nowDate: number) {
      this.tokenTimeout = setTimeout(() => {
         this.renewToken();
      }, expDate - nowDate);
   }

   stopTokenTimer(tokenTimeout: number) {
      clearTimeout(tokenTimeout);
   }
}
