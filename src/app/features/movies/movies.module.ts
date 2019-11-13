import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { MoviesComponent } from './components/movies.component';

@NgModule({
   declarations: [MoviesComponent],
   imports: [BrowserModule, HttpClientModule, AppRoutingModule, FontAwesomeModule, ReactiveFormsModule],
   providers: [],
   bootstrap: []
})
export class AppModule {}
