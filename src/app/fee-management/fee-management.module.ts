import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeeManagementRoutingModule } from './fee-management-routing.module';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { PaymentAllocationComponent } from './components/payment-allocation/payment-allocation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { ReturnFormComponent } from './components/return-form/return-form.component';
import { TransactionTableComponent } from './components/transaction-table/transaction-table.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    PaymentFormComponent,
    PaymentAllocationComponent,
    ReturnFormComponent,
    TransactionTableComponent,
    ConfirmDialogComponent,
    
  ],
  imports: [
    CommonModule,
    FeeManagementRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTableModule,
    MatDividerModule

  ]
})
export class FeeManagementModule { }
