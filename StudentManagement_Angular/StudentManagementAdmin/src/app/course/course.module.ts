import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms'
import { CourseRoutingModule } from './routes/course-routing.module';
import { AddCourseComponent } from './Components/add-course/add-course.component';
import { ViewCourseComponent } from './Components/view-course/view-course.component';
import { UpdateCourseComponent } from './Components/update-course/update-course.component';
import { RemoveCourseComponent } from './Components/remove-course/remove-course.component';

import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AddCourseComponent,
    ViewCourseComponent,
    UpdateCourseComponent,
    RemoveCourseComponent
  ],
  imports: [
    CommonModule,
    CourseRoutingModule,
     ReactiveFormsModule,
     SharedModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
     MatIconModule,
    MatCardModule,

  ]
})
export class CourseModule { }
