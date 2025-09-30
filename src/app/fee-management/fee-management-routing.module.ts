import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaymentAllocationComponent } from './components/payment-allocation/payment-allocation.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { ReturnFormComponent } from './components/return-form/return-form.component';
import { TransactionTableComponent } from './components/transaction-table/transaction-table.component';



const routes: Routes = [
  // {path:'',component:PaymentFormComponent},
  {path:'paymentForm',component:PaymentFormComponent},
  {path:'paymentAllocation/:feeStructureId',component:PaymentAllocationComponent},

   { path: 'paymentForm/:studentId', component: PaymentFormComponent }, // enrolled
  { path: 'paymentForm/trial/:trialStudentId', component: PaymentFormComponent }, // trial
  {path:'returnFeeForm',component:ReturnFormComponent},
  {path:'transaction',component:TransactionTableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeeManagementRoutingModule { }
