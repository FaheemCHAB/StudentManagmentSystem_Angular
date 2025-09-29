import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [AuthGuard],
    // Layout component with sidebar + router-outlet
    children: [
      { path: 'course', loadChildren: () => import('../course/course.module').then(m => m.CourseModule) },
      { path: 'college', loadChildren: () => import('../college/college.module').then(m => m.CollegeModule) },
      { path:  'qualification',loadChildren:()=>import('../qualification/qualification.module').then(m=>m.QualificationModule)},
      { path: 'batch', loadChildren: () => import('../batch/batch.module').then(m => m.BatchModule) },
      { path: 'trialStudent', loadChildren: () => import('../trial-student/trial-student.module').then(m => m.TrialStudentModule) },
      { path: 'studentProfile', loadChildren: () => import('../student-profile/student-profile.module').then(m => m.StudentProfileModule) },
      { path: 'report', loadChildren: () => import('../report/report.module').then(m => m.ReportModule) },
      { path: 'mailDue', loadChildren: () => import('../mail-due/mail-due.module').then(m => m.MailDueModule) },
      { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'feePayment', loadChildren: () => import('../fee-management/fee-management.module').then(m => m.FeeManagementModule) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
