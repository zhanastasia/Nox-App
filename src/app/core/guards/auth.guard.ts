import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { TokenService } from './../../shared/services/token.service';

@Injectable({
   providedIn: 'root'
})
export class AuthGuard implements CanActivate {
   constructor(private router: Router, private tokenService: TokenService) {}

   canActivate() {
      if (!this.tokenService.token) {
         return this.router.createUrlTree(['login']);
      }

      return true;
   }
}
