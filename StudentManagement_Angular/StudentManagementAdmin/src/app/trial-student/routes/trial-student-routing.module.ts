import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTrialStudentComponent } from '../Components/add-trial-student/add-trial-student.component';
import { TrialStudentListComponent } from '../Components/view-trial-student/view-trial-student.component';
import { UpdateTrialStudentComponent } from '../Components/update-trial-student/update-trial-student.component';
import { RemoveTrialStudentComponent } from '../Components/remove-trial-student/remove-trial-student.component';
import { EnrolledStudentsComponent } from '../Components/enrolled-students/enrolled-students.component';

const routes: Routes = [
  {path:'',component:TrialStudentListComponent},
    {path:'ViewTrialStudent',component:TrialStudentListComponent},
    {path:'AddTrialStudent',component:AddTrialStudentComponent},
    {path:'UpdateTrialStudent/:studentId',component:UpdateTrialStudentComponent},
   {path:'RemoveTrialStudent/:studentId',component:RemoveTrialStudentComponent},
   { path: 'EnrolledStudents', component: EnrolledStudentsComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrialStudentRoutingModule { }
