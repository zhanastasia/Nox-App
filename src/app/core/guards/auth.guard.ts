import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { TokenService } from './../../shared/services/token.service';

@Injectable({
   providedIn: 'root'
})
export class AuthGuard implements CanActivate {
   constructor(private router: Router, private tokenService: TokenService) {}

   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (!this.tokenService.isTokenValid()) {
         return this.router.createUrlTree(['login']);
      }

      return true;
   }
}
