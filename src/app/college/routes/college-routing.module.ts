import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCollegeComponent } from '../Components/add-college/add-college.component';
import { ViewCollegeComponent } from '../Components/view-college/view-college.component';
import { UpdateCollegeComponent } from '../Components/update-college/update-college.component';
import { RemoveCollegeComponent } from '../Components/remove-college/remove-college.component';

const routes: Routes = [{path:'',component:ViewCollegeComponent},
  {path:'viewCollege',component:ViewCollegeComponent},
  {path:'addCollege',component:AddCollegeComponent},
  {path:'updateCollege/:collegeId',component:UpdateCollegeComponent},
 {path:'removeCollege/:collegeId',component:RemoveCollegeComponent}];


  // path: 'courses', component: ViewCourseComponent },
  //   { path: 'add', component: AddCourseComponent },
  //    { path: '', redirectTo: 'edit/1', pathMatch: 'full' },  
  //   { path: 'edit/:id', component: UpdateCourseComponent },
  // {path : 'remove/:id', component:RemoveCourseComponent},

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeRoutingModule { }
