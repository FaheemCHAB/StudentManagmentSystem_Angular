import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentProfileRoutingModule } from './routes/student-profile-routing.module';
import { StudentProfileHomeComponent } from './Components/student-profile-home/student-profile-home.component';
import { QualificationComponent } from './Components/qualification/qualification.component';
import { ExperienceComponent } from './Components/experience/experience.component';
import { CourseDetailsComponent } from './Components/course-details/course-details.component';
import { FeeStructureComponent } from './Components/fee-structure/fee-structure.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

import { MatOptionModule } from '@angular/material/core';




import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { MatDialogModule } from '@angular/material/dialog';









import { MatGridListModule } from '@angular/material/grid-list';
import { ViewstudentprofileComponent } from './Components/viewstudentprofile/viewstudentprofile.component';
import { EditProfileDialogStudentprofileComponent } from './Components/edit-profile-dialog-studentprofile/edit-profile-dialog-studentprofile.component';
import { DeleteconfirmdialogComponent } from './Components/deleteconfirmdialog/deleteconfirmdialog.component';
import { EditqualificationdialogComponent } from './Components/editqualificationdialog/editqualificationdialog.component';
import { EditexperiencendialogComponent } from './Components/editexperiencendialog/editexperiencendialog.component';
import { EditcoursedetailsdialogComponent } from './Components/editcoursedetailsdialog/editcoursedetailsdialog.component';
import { EditfeestructuredialogComponent } from './Components/editfeestructuredialog/editfeestructuredialog.component';
import { EditfeedialogComponent } from './Components/editfeedialog/editfeedialog.component';
import { ExperienceConfirmDialogComponent } from './Components/experience-confirm-dialog/experience-confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SecondaryContactComponent } from './Components/secondary-contact/secondary-contact.component';












@NgModule({
  declarations: [
    StudentProfileHomeComponent,
   
    QualificationComponent,
    ExperienceComponent,
    CourseDetailsComponent,
    FeeStructureComponent,

    
    ExperienceConfirmDialogComponent,

    
    ViewstudentprofileComponent,
    EditProfileDialogStudentprofileComponent,
    DeleteconfirmdialogComponent,
    EditqualificationdialogComponent,
    EditexperiencendialogComponent,
    EditcoursedetailsdialogComponent,
    EditfeestructuredialogComponent,
    EditfeedialogComponent,
    ExperienceConfirmDialogComponent,
    SecondaryContactComponent,
   
    

    
  ],
  imports: [
    CommonModule,
    StudentProfileRoutingModule,
MatSnackBarModule,
    MatDialogModule,
    MatListModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  MatTooltipModule,

    MatOptionModule,
    


     MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,

    FormsModule,
    

    MatGridListModule,
    

  ]
})
export class StudentProfileModule { }
