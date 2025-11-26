import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewReportComponent } from '../Components/view-report/view-report.component';

const routes: Routes = [
  {path:'',component:ViewReportComponent},
  {path:'report',component:ViewReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
