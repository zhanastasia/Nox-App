import { NgModule } from '@angular/core';
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
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule {}
