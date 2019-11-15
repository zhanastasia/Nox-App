import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieRoutingModule } from './movie-routing.module';
import { MoviesComponent } from './components/movies.component';

@NgModule({
   declarations: [MoviesComponent],
   imports: [CommonModule, MovieRoutingModule]
})
export class MovieModule {}
