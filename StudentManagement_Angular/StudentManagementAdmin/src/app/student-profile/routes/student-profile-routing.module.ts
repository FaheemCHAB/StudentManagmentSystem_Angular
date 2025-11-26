import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentProfileHomeComponent } from '../Components/student-profile-home/student-profile-home.component';
import { QualificationComponent } from '../Components/qualification/qualification.component';
import { ExperienceComponent } from '../Components/experience/experience.component';
import { FeeStructureComponent } from '../Components/fee-structure/fee-structure.component';

import { CourseDetailsComponent } from '../Components/course-details/course-details.component';
import { ViewstudentprofileComponent } from '../Components/viewstudentprofile/viewstudentprofile.component';
import { SecondaryContactComponent } from '../Components/secondary-contact/secondary-contact.component';


const routes: Routes = [
   {path:'',component:StudentProfileHomeComponent},
  {path:'studentProfileHome',component:StudentProfileHomeComponent},
   {path:'studentProfileHome/:trialStudentId',component:StudentProfileHomeComponent},
 {path:'qualification/:studentId',component:QualificationComponent},
  {path:'experience/:studentId',component:ExperienceComponent},
  {path:'course/:studentId',component:CourseDetailsComponent},
  {path:'feeStructure',component:FeeStructureComponent},
  {path:'feeStructure/:studentId',component:FeeStructureComponent},

  {path:'courseDetails/:studentId',component:CourseDetailsComponent},
  {path:'viewProfile/:studentId',component:ViewstudentprofileComponent},
  { path: 'secondary-contact/:studentId', component: SecondaryContactComponent }//added

    
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentProfileRoutingModule { }
