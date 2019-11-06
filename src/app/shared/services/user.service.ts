import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class UserService {
   constructor() {}

   parseEmail(email: string) {
      return email.substring(0, email.lastIndexOf('@'));
   }
}
