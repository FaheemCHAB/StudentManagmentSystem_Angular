import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TrialStudentRoutingModule } from './routes/trial-student-routing.module';

import { AddTrialStudentComponent } from './Components/add-trial-student/add-trial-student.component';
import { UpdateTrialStudentComponent } from './Components/update-trial-student/update-trial-student.component';
import { RemoveTrialStudentComponent } from './Components/remove-trial-student/remove-trial-student.component';
import { TrialStudentListComponent } from './Components/view-trial-student/view-trial-student.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EnrolledStudentsComponent } from './Components/enrolled-students/enrolled-students.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';  


@NgModule({
  declarations: [
    AddTrialStudentComponent,
    UpdateTrialStudentComponent,
    RemoveTrialStudentComponent,
    TrialStudentListComponent,
    EnrolledStudentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TrialStudentRoutingModule,
    MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
         MatIconModule,
        MatCardModule,
        MatSelectModule,
        MatDialogModule
  ]
})
export class TrialStudentModule { }
