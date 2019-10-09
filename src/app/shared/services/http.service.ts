import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HttpService {
   constructor(private http: HttpClient) {}

   post<T, U>(data: T, url: string) {
      if (!data) {
         return;
      }

      return this.http.post<U>(url, data);
   }

   get<T>(url: string) {
      console.log('HttpService.get');
      console.log('url', url);
      return this.http.get<{ [key: string]: T }>(url).pipe(
         map(response => {
            const dataArray: T[] = [];
            for (const key in response) {
               if (response.hasOwnProperty(key)) {
                  dataArray.push({ ...response[key], id: key });
               }
            }
            return dataArray;
         })
      );
   }
}
