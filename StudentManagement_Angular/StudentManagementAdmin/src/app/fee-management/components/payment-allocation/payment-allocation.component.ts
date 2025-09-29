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
    if (this.feeStructureId) {
      this.loadInstallments(this.feeStructureId);
    }
  }

  loadInstallments(feeStructureId: string) {
    this.studentService.getFeesByFeeStructureId(feeStructureId).subscribe(fees => {
      let remainingAmount = this.data.amountReceived || 0; // take from parent
      this.Installments = fees.map(fee => {
        const alreadyReceived = fee.amountReceived || 0;
        const amount = fee.amount || 0;
        const balance = amount - alreadyReceived;

        let currentAllocation = 0;

        // allocate only if not fully paid
        if (remainingAmount > 0 && balance > 0) {
          if (remainingAmount >= balance) {
            // allocate full balance
            currentAllocation = balance;
            remainingAmount -= balance;
          } else {
            // allocate partial
            currentAllocation = remainingAmount;
            remainingAmount = 0;
          }
        }

        return {
          ...fee,
          originalReceived: alreadyReceived,
          currentReceivedAmount: currentAllocation,      // auto-allocated
          totalReceived: alreadyReceived + currentAllocation,
          balanceAmount: amount - (alreadyReceived + currentAllocation),
          paymentMode: fee.paymentMode != null ? fee.paymentMode : 0,
          remarks: this.data.remarks || ''
        };
      });
    });
  }

  updateBalance(index: number) {
    const row = this.Installments[index];
    const current = Number(row.currentReceivedAmount);
    const alreadyReceived = Number(row.amountReceived) || 0;
    const original = Number(row.originalReceived) || 0;
    const amount = Number(row.amount) || 0;
    const remaining = amount - original;

    // Validate input
    if (current > (amount - alreadyReceived)) {
      alert('Entered amount exceeds remaining balance.');
      row.currentReceivedAmount = 0;
    }
    // Update calculated fields
    // ✅ calculate without overwriting original
    row.totalReceived = original + (Number(row.currentReceivedAmount) || 0);
    row.balanceAmount = amount - row.totalReceived;

    // Auto-status update
    if (row.balanceAmount === 0 && row.totalReceived > 0) {
      row.status = InstallmentStatus.Paid;
    } else if (row.totalReceived > 0 && row.balanceAmount > 0) {
      row.status = InstallmentStatus.PartiallyPaid;
    } else if (row.totalReceived === 0) {
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

    // ✅ Check total allocation vs parent amount
    const totalAllocated = this.Installments.reduce((sum, i) => sum + (Number(i.currentReceivedAmount) || 0), 0);
    const parentReceived = Number(this.data.amountReceived) || 0;

    if (totalAllocated !== parentReceived) {
      alert('Allocated amount does not match received amount. Allocated: '
        + totalAllocated + ', Received: ' + parentReceived);
      return;
    }

    // Prepare data for backend
    const updatedInstallments = this.Installments.map(i => ({
      ...i,

      amountReceived: i.totalReceived,         // total
      currentReceivedAmount: i.currentReceivedAmount,// send separately if backend supports
      dueAmount: i.balanceAmount,

    }));

    this.studentService.updateFeeByFeeStructureIdAllocation(this.feeStructureId, updatedInstallments)
      .subscribe({
        next: () => {
          alert('Installments submitted successfully.');
          this.dialogRef.close(this.data.studentId);

          // ✅ Reset the table
          //this.Installments = [];

          // ✅ Navigate to viewProfile
          //this.route.navigate(['/home/studentProfile/viewProfile', this.data.studentId]);
        },
        error: err => {
          console.error('Submission failed:', err);
          alert('Failed to submit installments.');
        }
      });
  }
}