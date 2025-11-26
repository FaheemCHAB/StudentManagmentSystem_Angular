import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './Components/DashBoardView/dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './routes/dashboard-routing.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
  DashboardComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    DashboardRoutingModule,
    MatIconModule
  ]
})
export class DashboardModule { }
