import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QualificationRoutingModule } from './qualification-routing.module';
import { AddQualificationComponent } from './Components/add-qualification/add-qualification/add-qualification.component';
import { ViewQualificationComponent } from './Components/view-qualification/view-qualification/view-qualification.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { UpdateQualificationComponent } from './Components/update-qualification/update-qualification/update-qualification.component';


@NgModule({
  declarations: [
   
    AddQualificationComponent,
    ViewQualificationComponent,
    UpdateQualificationComponent
  ],
  imports: [
    CommonModule,
    QualificationRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule

     
  ]
})
export class QualificationModule { }
