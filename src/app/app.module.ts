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
import { EmptyComponent } from './core/components/empty/empty.component';
import { LoginComponent } from './core/components/login/login.component';
import { initApp } from './core/initializers/token-timeout.initializer';
import { TokenService } from './shared/services/token.service';

@NgModule({
   declarations: [AppComponent, HeaderComponent, EmptyComponent, LoginComponent],
   imports: [
      BrowserModule,
      HttpClientModule,
      AppRoutingModule,
      FontAwesomeModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot({
         timeOut: 10000,
         positionClass: 'toast-top-full-width',
         preventDuplicates: true
      })
   ],
   providers: [
      {
         provide: APP_INITIALIZER,
         useFactory: initApp,
         multi: true,
         deps: [TokenService]
      }
   ],
   bootstrap: [AppComponent]
})
export class AppModule {}
