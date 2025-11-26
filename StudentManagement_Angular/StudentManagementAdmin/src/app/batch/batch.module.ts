import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BatchRoutingModule } from './routes/batch-routing.module';
import { AddBatchComponent } from './Components/add-batch/add-batch.component';
import { UpdateBatchComponent } from './Components/update-batch/update-batch.component';
import { ViewBatchComponent } from './Components/view-batch/view-batch.component';
import { DeleteBatchComponent } from './Components/delete-batch/delete-batch.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AddBatchComponent,
    UpdateBatchComponent,
    ViewBatchComponent,
    DeleteBatchComponent
  ],
  imports: [
    
    FormsModule,
    MatCardModule,
    MatDialogModule,
    MatGridListModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    BatchRoutingModule,
    ReactiveFormsModule
  ]
})
export class BatchModule { }
