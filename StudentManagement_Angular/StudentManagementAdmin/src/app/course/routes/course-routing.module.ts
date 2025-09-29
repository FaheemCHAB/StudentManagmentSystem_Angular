import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCourseComponent } from '../Components/add-course/add-course.component';
import { ViewCourseComponent } from '../Components/view-course/view-course.component';
import { UpdateCourseComponent } from '../Components/update-course/update-course.component';
import { RemoveCourseComponent } from '../Components/remove-course/remove-course.component';


const routes: Routes = [
  { path: '', component: ViewCourseComponent },
  { path: 'viewCourse', component: ViewCourseComponent },
  { path: 'add', component: AddCourseComponent },
  
  { path: 'edit/:courseId', component: UpdateCourseComponent },
  { path: 'remove/:courseId', component: RemoveCourseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
