import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { UserRequest } from '../../../shared/models/user-request.model';
import { TokenService } from './../../../shared/services/token.service';
import { UserService } from './../../../shared/services/user.service';
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

   isSignUpMode = false;

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
      private tokenService: TokenService,
      private userService: UserService
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

      this.tokenService
         .requstToken(requestBody, this.isSignUpMode)
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
            this.tokenService.refreshToken = response.refreshToken;
            this.tokenService.tokenTimer(+response.expiresIn, new Date(0).valueOf());

            this.router.navigate(['']);
         });

      this.loginForm.reset();
   }

   onToggleMode() {
      this.isSignUpMode = !this.isSignUpMode;
   }
}
