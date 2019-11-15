import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './core/components/login/login.component';

const routes: Routes = [
   { path: 'login', component: LoginComponent },
   {
      path: '',
      loadChildren: () => import('./features/movies/movie.module').then(m => m.MovieModule)
   }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule {}
