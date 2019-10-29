import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UpdateProfileResponse } from '../models/update-profile-response';
import { UpdateProfileRequest } from '../models/update-profile-request';
import * as URLConstants from '../constants/url-constants';

@Injectable({
   providedIn: 'root'
})
export class UserService {
   constructor(private httpClient: HttpClient) {}

   requstUpdateProfile(requestBody: UpdateProfileRequest) {
      return this.httpClient.post<UpdateProfileResponse>(URLConstants.POST_UPDATE_PROFILE_URL, requestBody);
   }

   parseEmail(email: string) {
      // console.log('email', this.email);
      return email.substring(0, email.lastIndexOf('@'));
   }
}
