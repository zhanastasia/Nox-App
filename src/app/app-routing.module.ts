import { LoginComponent } from './core/components/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptyComponent } from './core/components/empty/empty.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
   { path: '', component: EmptyComponent, canActivate: [AuthGuard] },
   { path: 'login', component: LoginComponent }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule {}
