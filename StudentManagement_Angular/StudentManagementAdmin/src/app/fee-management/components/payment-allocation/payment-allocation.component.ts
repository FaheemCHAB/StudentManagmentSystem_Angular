import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { StudentProfileService } from 'src/app/student-profile/Service/student-profile.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { InstallmentStatus } from 'src/app/student-profile/Models/ProfileModels';
@Component({
  selector: 'app-payment-allocation',
  templateUrl: './payment-allocation.component.html',
  styleUrls: ['./payment-allocation.component.css']
})
export class PaymentAllocationComponent implements OnInit {
  feeStructureId!: string;
  Installments: any[] = [];
  displayedColumns: string[] = [
    'installmentNumber', 'amount', 'currentReceivedAmount',
    'totalReceived', 'balanceAmount',
    'status', 'paymentMode', 'remarks'
  ];

  InstallmentStatus = InstallmentStatus;

  installmentStatusOptions = Object.entries(InstallmentStatus)
    .filter(([key]) => isNaN(Number(key)))
    .map(([label, value]) => ({ label, value }));

  constructor(
    private studentService: StudentProfileService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: Router,
    private dialogRef: MatDialogRef<PaymentAllocationComponent>
  ) { }

  ngOnInit(): void {
    this.feeStructureId = this.data.feeStructureId;
    console.log("Received from parent:", this.data.amountReceived, this.data.studentId);
    console.log("AmountReceived:", this.data.amountReceived);
    console.log("PaymentMode:", this.data.paymentMode);
    console.log("Remarks:", this.data.remarks);

    if (this.feeStructureId) {
      this.loadInstallments(this.feeStructureId);
    }
  }


  loadInstallments(feeStructureId: string) {
  this.studentService.getFeesByFeeStructureId(feeStructureId).subscribe(fees => {
    let remainingAmount = this.data.amountReceived || 0;

    this.Installments = fees.map(fee => {
      const alreadyReceived = fee.amountReceived || 0;
      const amount = fee.amount || 0;
      const balance = amount - alreadyReceived;
      let currentAllocation = 0;

   
      if (remainingAmount > 0 && balance > 0) {
        if (remainingAmount >= balance) {
          currentAllocation = balance;
          remainingAmount -= balance;
        } else {
          currentAllocation = remainingAmount;
          remainingAmount = 0;
        }
      }

      const totalReceived = alreadyReceived + currentAllocation;
      const balanceAmount = amount - totalReceived;

     
      let status = InstallmentStatus.Pending;

      if (balanceAmount === 0 && totalReceived > 0) {
        status = InstallmentStatus.Paid;
      } 
      else if (totalReceived > 0 && balanceAmount > 0) {
        status = InstallmentStatus.PartiallyPaid;
      }
return {
  ...fee,
  originalReceived: alreadyReceived,
  currentReceivedAmount: currentAllocation,
  totalReceived: totalReceived,
  balanceAmount: balanceAmount,
  status: status,

  paymentMode: currentAllocation > 0 ? this.data.paymentMode : fee.paymentMode,
  remarks: currentAllocation > 0 ? this.data.remarks : (fee.remarks || "")
};

    });
  });
}




updateBalance(index: number) {
  const row = this.Installments[index];

  const amount = Number(row.amount) || 0;
  const original = Number(row.originalReceived) || 0;   // total received before this payment
  const current = Number(row.currentReceivedAmount) || 0;

  const remaining = amount - original;                // correct remaining balance

  // ❌ Block only if new payment exceeds remaining
  if (current > remaining) {
    alert("Entered amount exceeds remaining balance.");
    row.currentReceivedAmount = remaining;            // Auto adjust instead of resetting to 0
  }

  row.totalReceived = original + row.currentReceivedAmount;
  row.balanceAmount = amount - row.totalReceived;

  // Update status
  if (row.balanceAmount === 0 && row.totalReceived > 0) {
    row.status = InstallmentStatus.Paid;
  } 
  else if (row.totalReceived > 0) {
    row.status = InstallmentStatus.PartiallyPaid;
  } 
  else {
    row.status = InstallmentStatus.Pending;
  }
}


  onSubmit() {
    const isValid = this.Installments.every(i => i.currentReceivedAmount >= 0 && i.status !== null);

    if (!isValid) {
      console.log(this.data.studentId)
      this.route.navigate(['/home/studentProfile/viewProfile', this.data.studentId])
      alert('Please fill all required fields.');
      return;
    }
    const totalAllocated = this.Installments.reduce((sum, i) => sum + (Number(i.currentReceivedAmount) || 0), 0);
    const parentReceived = Number(this.data.amountReceived) || 0;

    if (totalAllocated !== parentReceived) {
      alert('Allocated amount does not match received amount. Allocated: '
        + totalAllocated + ', Received: ' + parentReceived);
      return;
    }


//     const updatedInstallments = this.Installments.map(i => ({
//       feeId: i.feeId,
//      currentReceivedAmount: i.currentReceivedAmount,
//   dueAmount: i.balanceAmount,
//   paymentMode: i.paymentMode,                                          //added
//   remarks: i.remarks,
//   status: i.status
// }));

    const updatedInstallments = this.Installments.map(i => ({
      ...i,

      amountReceived: i.totalReceived,         
      currentReceivedAmount: i.currentReceivedAmount,
      dueAmount: i.balanceAmount,

    }));

    this.studentService.updateFeeByFeeStructureIdAllocation(this.feeStructureId, updatedInstallments)
      .subscribe({
        next: () => {
          alert('Installments submitted successfully.');
          this.dialogRef.close(this.data.studentId);

     
        },
        error: err => {
          console.error('Submission failed:', err);
          alert('Failed to submit installments.');
        }
      });
  }
}