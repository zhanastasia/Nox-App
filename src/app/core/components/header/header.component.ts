import { UpdateProfileRequest } from './../../../shared/models/update-profile-request';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TokenService } from './../../../shared/services/token.service';
import { UserService } from './../../../shared/services/user.service';

@Component({
   selector: 'app-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   title = 'Nox App';
   username: string;

   get isLoginMode(): boolean {
      return this.tokenService.isTokenValid();
   }

   constructor(private router: Router, private tokenService: TokenService, private userService: UserService) {}

   ngOnInit() {
      this.displayUsernameFromEmail();
   }

   logout() {
      const tokenTimer = this.tokenService.tokenTimeout;
      this.tokenService.stopTokenTimer(tokenTimer);
      this.tokenService.removeToken();
      this.router.navigate(['login']);
   }

   displayUsernameFromEmail() {
      const requestBody: UpdateProfileRequest = {
         idToken: this.tokenService.token,
         displayName: this.userService.parseEmail(this.tokenService.decodedToken.email),
         photoUrl: '',
         deleteAttribute: [],
         returnSecureToken: false
      };

      this.userService.requstUpdateProfile(requestBody).subscribe(response => {
         console.log('response', response);
         this.username = response.displayName;
      });
   }
}
