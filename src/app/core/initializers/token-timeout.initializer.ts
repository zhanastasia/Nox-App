import { TokenService } from 'src/app/shared/services/token.service';

export function initApp(tokenService: TokenService) {
   return () => {
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
   };
}
