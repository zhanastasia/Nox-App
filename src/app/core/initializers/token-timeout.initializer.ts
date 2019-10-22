import { Injectable, Injector } from '@angular/core';

import { TokenService } from 'src/app/shared/services/token.service';

@Injectable({ providedIn: 'root' })
export class TokenTimeoutInitializer {
   constructor(private injector: Injector) {}

   initApp(): Promise<any> {
      const tokenService = this.injector.get(TokenService);

      return new Promise(resolve => {
         const token: string = tokenService.token;

         if (token) {
            const expDate = tokenService.getTokenExpirationDate(token);
            const nowDate = new Date().valueOf();

            setTimeout(() => {
               tokenService.renewToken();
            }, expDate.valueOf() - nowDate);
         }

         resolve();
      });
   }
}
