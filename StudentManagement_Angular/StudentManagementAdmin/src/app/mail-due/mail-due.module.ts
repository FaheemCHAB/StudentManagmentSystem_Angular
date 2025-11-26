import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailDueRoutingModule } from './mail-due-routing.module';
import { TodayDueComponent } from './components/today-due/today-due.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    TodayDueComponent
  ],
  imports: [
    CommonModule,
    MailDueRoutingModule,
     MatTableModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule
  ]
})
export class MailDueModule { }
