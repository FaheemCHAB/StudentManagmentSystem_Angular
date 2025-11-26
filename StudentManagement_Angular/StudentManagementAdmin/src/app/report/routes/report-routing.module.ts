import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewReportComponent } from '../Components/view-report/view-report.component';
import { ViewStudentReportComponent } from '../Components/view-student-report/view-student-report.component';

const routes: Routes = [
  {path:'',component:ViewReportComponent},
  {path:'report',component:ViewReportComponent},
  {path:'student-report/:studentId',component:ViewStudentReportComponent}  //CHANGED
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
