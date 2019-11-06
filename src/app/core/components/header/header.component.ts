import { Component, OnInit } from '@angular/core';

import { TokenService } from './../../../shared/services/token.service';
import { UserService } from './../../../shared/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'app-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   title = environment.appTitle;
   username: string;

   get isLoginMode(): boolean {
      // return this.tokenService.isTokenValid();
      return !!this.tokenService.token;
   }

   constructor(private tokenService: TokenService, private userService: UserService) {}

   ngOnInit() {}

   logout() {
      this.tokenService.logout();
   }

   displayUsername() {
      return this.userService.parseEmail(this.tokenService.decodedToken.email);
   }
}
