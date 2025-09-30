import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/Components/DashBoardView/dashboard.component';

const routes: Routes = [
{ path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'admin-login', loadChildren: () => import('./admin-login/admin-login.module').then(m => m.AdminLoginModule) },
  { path: '', redirectTo: 'admin-login', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin-login' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
