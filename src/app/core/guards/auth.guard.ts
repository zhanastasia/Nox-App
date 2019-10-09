import { TokenService } from './../../shared/services/token.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
   providedIn: 'root'
})
export class AuthGuard implements CanActivate {
   constructor(private router: Router, private tokenService: TokenService) {}

   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const idToken = this.tokenService.getToken();

      if (!this.tokenService.isTokenValid(idToken)) {
         return this.router.createUrlTree(['login']);
      }

      return true;
   }
}
