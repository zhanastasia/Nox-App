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

   get isAuthenticated(): boolean {
      return !!this.tokenService.token;
   }

   get username(): string {
      if (this.tokenService.decodedToken) {
         return this.userService.extractUsername(this.tokenService.decodedToken.email);
      }
   }

   constructor(private tokenService: TokenService, private userService: UserService) {}

   ngOnInit() {}

   logout() {
      this.tokenService.logout();
   }
}
