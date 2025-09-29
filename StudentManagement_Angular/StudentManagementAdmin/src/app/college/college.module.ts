import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollegeRoutingModule } from './routes/college-routing.module';
import { AddCollegeComponent } from './Components/add-college/add-college.component';
import { ViewCollegeComponent } from './Components/view-college/view-college.component';
import { UpdateCollegeComponent } from './Components/update-college/update-college.component';
import { RemoveCollegeComponent } from './Components/remove-college/remove-college.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AddCollegeComponent,
    ViewCollegeComponent,
    UpdateCollegeComponent,
    RemoveCollegeComponent
  ],
  imports: [
    CommonModule,
    CollegeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
         MatIconModule,
        MatCardModule,

  ]
})
export class CollegeModule { }
