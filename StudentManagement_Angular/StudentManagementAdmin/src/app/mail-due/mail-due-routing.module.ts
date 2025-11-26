import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodayDueComponent } from './components/today-due/today-due.component';

const routes: Routes = [
  {path:'todayDue',component:TodayDueComponent},
  {path:'',component:TodayDueComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailDueRoutingModule { }
