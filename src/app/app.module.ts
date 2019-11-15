import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/components/header/header.component';
import { LoginComponent } from './core/components/login/login.component';
import { TokenTimeoutInitializer } from './core/initializers/token-timeout.initializer';
import { MovieModule } from './features/movies/movie.module';

export function tokenTimeoutInitializer(tokenTimeoutInit: TokenTimeoutInitializer) {
   return () => tokenTimeoutInit.initApp();
}

@NgModule({
   declarations: [AppComponent, HeaderComponent, LoginComponent],
   imports: [
      BrowserModule,
      HttpClientModule,
      AppRoutingModule,
      FontAwesomeModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      MovieModule,
      ToastrModule.forRoot({
         timeOut: 10000,
         positionClass: 'toast-top-full-width',
         preventDuplicates: true
      })
   ],
   providers: [
      {
         provide: APP_INITIALIZER,
         useFactory: tokenTimeoutInitializer,
         multi: true,
         deps: [TokenTimeoutInitializer]
      }
   ],
   bootstrap: [AppComponent]
})
export class AppModule {}
