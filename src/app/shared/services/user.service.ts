import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class UserService {
   constructor() {}

   extractUsername(email: string) {
      return email.substring(0, email.lastIndexOf('@'));
   }
}
