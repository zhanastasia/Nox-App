import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { MoviesComponent } from './components/movies.component';

const routes: Routes = [{ path: '', component: MoviesComponent, canActivate: [AuthGuard] }];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class MovieRoutingModule {}
