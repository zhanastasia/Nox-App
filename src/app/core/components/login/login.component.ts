import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { UserResponse } from '../../../shared/models/user-response.model';
import { UserRequest } from '../../../shared/models/user-request.model';
import { TokenService } from './../../../shared/services/token.service';
import * as URLConstants from 'src/app/shared/constants/url-constants';
import * as FirebaseErrors from './../../../shared/constants/firebase.errors';
import * as UIMessages from '../../../shared/constants/ui-messages';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   faUser = faUser;
   faLock = faLock;
   faUserCircle = faUserCircle;

   isSignInMode = false;

   loginForm = this.fb.group({
      email: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required)
   });

   get email(): string {
      return this.loginForm.get('email').value;
   }

   get password(): string {
      return this.loginForm.get('password').value;
   }

   constructor(
      private fb: FormBuilder,
      private router: Router,
      private toastr: ToastrService,
      private httpClient: HttpClient,
      private tokenService: TokenService
   ) {}

   ngOnInit() {}

   onSubmitLogin() {
      if (!this.loginForm.valid) {
         return null;
      }

      const requestBody: UserRequest = {
         email: this.email,
         password: this.password,
         returnSecureToken: true
      };

      const auth$: Observable<UserResponse> = this.isSignInMode
         ? this.httpClient.post<UserResponse>(URLConstants.POST_SIGN_UP_USER_URL, requestBody)
         : this.httpClient.post<UserResponse>(URLConstants.POST_SIGN_IN_USER_URL, requestBody);
      auth$
         .pipe(
            catchError(err => {
               const error = err.error.error.message;

               switch (error) {
                  case FirebaseErrors.INVALID_PASSWORD:
                     this.toastr.error(UIMessages.ERROR_INCORRECT_EMAIL_PASSWORD);
                     break;
                  case FirebaseErrors.EMAIL_EXISTS:
                     this.toastr.error(UIMessages.ERROR_EMAIL_EXISTS);
                     break;
                  case FirebaseErrors.TOO_MANY_ATTEMPTS_TRY_LATER:
                     this.toastr.error(UIMessages.ERROR_TOO_MANY_ATTEMPTS_TRY_LATER);
                     break;
                  case FirebaseErrors.EMAIL_NOT_FOUND:
                     this.toastr.error(UIMessages.ERROR_EMAIL_NOT_FOUND);
                     break;
               }
               throw err;
            })
         )
         .subscribe(response => {
            if (!response || !response.idToken) {
               this.toastr.error(UIMessages.ERROR_INCORRECT_RESPONSE);
               return;
            }

            this.tokenService.token = response.idToken;
            this.router.navigate(['']);
         });

      this.loginForm.reset();
   }

   onToggleMode() {
      this.isSignInMode = !this.isSignInMode;
   }
}
