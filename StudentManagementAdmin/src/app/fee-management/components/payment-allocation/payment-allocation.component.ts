import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { StudentProfileService } from 'src/app/student-profile/Service/student-profile.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    'installmentNumber', 'amount', 'amountReceived', 'balanceAmount',
    'status', 'paymentMode', 'remarks'
  ];

  InstallmentStatus = InstallmentStatus;

  installmentStatusOptions = Object.entries(InstallmentStatus)
    .filter(([key]) => isNaN(Number(key)))
    .map(([label, value]) => ({ label, value }));

  constructor(
    private studentService: StudentProfileService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.feeStructureId = this.data.feeStructureId;
    if (this.feeStructureId) {
      this.loadInstallments(this.feeStructureId);
    }
  }

  loadInstallments(feeStructureId: string) {
    this.studentService.getFeesByFeeStructureId(feeStructureId).subscribe(fees => {
      this.Installments = fees.map(fee => ({
        ...fee,
        amountReceived: fee.amountReceived || 0,
        balanceAmount: (fee.amount || 0) - (fee.amountReceived || 0),
        paymentMode: fee.paymentMode != null ? fee.paymentMode : 0 
      }));
    });
  }

  updateBalance(index: number) {
    const row = this.Installments[index];
    const received = Number(row.amountReceived) || 0;
    const amount = Number(row.amount) || 0;
    row.balanceAmount = amount - received;
    row.dueAmount = row.balanceAmount;


    // Auto-status update
    if (row.balanceAmount === 0 && received > 0) {
      row.status = InstallmentStatus.Paid;
    } else if (received > 0 && row.balanceAmount > 0) {
      row.status = InstallmentStatus.PartiallyPaid;
    } else if (received === 0) {
      row.status = InstallmentStatus.Pending;
    }
  }

  onSubmit() {
    const isValid = this.Installments.every(i => i.amountReceived >= 0 && i.status !== null);

    if (!isValid) {
      alert('Please fill all required fields.');
      return;
    }

    // Send to backend
    this.studentService.updateFeeByFeeStructureIdAllocation(this.feeStructureId, this.Installments)
      .subscribe({
        next: () => {
          alert('Installments submitted successfully.');
        },
        error: err => {
          console.error('Submission failed:', err);
          alert('Failed to submit installments.');
        }
      });
  }
}