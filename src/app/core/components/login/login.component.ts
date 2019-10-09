import { ResponseBody } from './../../../shared/models/response-body.model';
import { User } from './../../models/user.model';
import { HttpService } from './../../../shared/services/http.service';

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { POST_SING_UP_USER } from 'src/app/shared/constants/constants';
import { POST_SING_IN_USER } from 'src/app/shared/constants/constants';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   faUser = faUser;
   faLock = faLock;
   faUserCircle = faUserCircle;

   isLogged = false;
   error: string = null;

   @Output()
   dataSubmited: EventEmitter<User> = new EventEmitter<User>();

   constructor(
      private httpService: HttpService,
      private fb: FormBuilder,
      private router: Router,
      private toastr: ToastrService
   ) {}

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

   ngOnInit() {}

   onSubmitLogin() {
      if (!this.loginForm.valid) {
         return null;
      }

      const requestBody: object = {
         email: this.email,
         password: this.password,
         returnSecureToken: true
      };

      const auth$: Observable<ResponseBody> = this.isLogged
         ? this.httpService.post<object, ResponseBody>(requestBody, POST_SING_UP_USER())
         : this.httpService.post<object, ResponseBody>(requestBody, POST_SING_IN_USER());
      auth$
         .pipe(
            catchError(err => {
               this.error = err.error.error.message;

               switch (this.error) {
                  case 'INVALID_PASSWORD':
                     this.toastr.error('Incorrect email or password', 'Error');
                     break;
                  case 'EMAIL_EXISTS':
                     this.toastr.error('Email exists', 'Error');
                     break;
                  case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                     this.toastr.error(
                        'We have blocked all requests from this device due to unusual activity. Try again later.',
                        'Error'
                     );
                     break;
                  case 'EMAIL_NOT_FOUND':
                     this.toastr.error(
                        'There is no user record corresponding to this identifier. The user may have been deleted.',
                        'Error'
                     );
                     break;
               }
               throw err;
            })
         )
         .subscribe(response => {
            if (!response || !response.idToken) {
               this.toastr.error('Incorrect response from Firebase', 'Error');
               return;
            }
            localStorage.setItem('idToken', response.idToken);
            this.router.navigate(['']);
         });

      this.loginForm.reset();
   }

   onClickCreateAccount() {
      this.isLogged = !this.isLogged;
   }
}
