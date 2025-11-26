
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fee, InstallmentStatus} from '../../Models/ProfileModels';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentProfileService } from '../../Service/student-profile.service';



import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-editfeedialog',
  templateUrl: './editfeedialog.component.html',
  styleUrls: ['./editfeedialog.component.css']
})

export class EditfeedialogComponent implements OnInit {
  feeStructureForm!: FormGroup;
  installmentForm!: FormGroup;
  displayedColumns = ['feeId', 'installmentNumber', 'dueDate', 'amount', 'status'];
  validationErrorMessage: string = '';
  originalTotalAmount: number = 0;




  feeStatus = InstallmentStatus;
   feeList: any[] = [];
 
   registrationDate: string = new Date().toISOString().substring(0, 10);
feeStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' }
];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { feeStructure: any; fees: any[] },
    private dialogRef: MatDialogRef<EditfeedialogComponent>,
    private fb: FormBuilder,

    private service: StudentProfileService
  ) {}

  ngOnInit(): void {
    // Build the fixed totalInstallment form
  this.feeStructureForm = this.fb.group({
    totalInstallment: [{ value: this.data.feeStructure.totalInstallment, disabled: true }, Validators.required]
  });

  // Build the installment editing form
  this.installmentForm = this.fb.group({
    installments: this.fb.array(this.data.fees.map((fee) =>
      this.fb.group({
        feeId: [fee.feeId,Validators.required], // not editable
        installmentNumber: [{ value: fee.installmentNumber, disabled: true }], // read-only
        dueDate: [new Date(fee.dueDate), Validators.required],
        amount: [fee.amount, Validators.required],
        status: [fee.status, Validators.required]
      })
    ))
  });

  // 🔸 Store the original total amount for validation
  this.originalTotalAmount = this.data.fees.reduce((sum, fee) => sum + fee.amount, 0);

  // 🔸 Subscribe to changes to validate live
  this.installments.valueChanges.subscribe(() => {
    this.validateAmountUnchanged();
  });

    
  }

  get installments(): FormArray {
    return this.installmentForm.get('installments') as FormArray;
  }


  onUpdate(): void {

    this.validateAmountUnchanged();

  if (this.validationErrorMessage) {
    return; // prevent update if total mismatch
  }
    const feeStructureId = this.data.feeStructure.installmentId;

  // ✅ Extract fee data including disabled fields
 const updatedFees = this.installments.controls.map(group => {
    const value = group.getRawValue();
    return {
      feeId: value.feeId,
      installmentNumber: value.installmentNumber,
      dueDate: this.formatDateOnly(value.dueDate),
      amount: value.amount,
      status: value.status,
      feeStructureId: feeStructureId
    };
  });

  console.log('Submitting updated fees:', updatedFees);

  this.service.updateFeeByFeeStructureId(feeStructureId, updatedFees).subscribe({
    next: () => this.dialogRef.close(true),
    error: (err) => {
      console.error('Error updating fees', err);
      alert('Error updating fees. Please check the console.');
    }
  });
}

formatDateOnly(date: any): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // "yyyy-MM-dd"
}

validateAmountUnchanged(): void {
  const installments = this.installments.getRawValue();
  const updatedTotal = installments.reduce((sum: number, inst: any) => {
    return sum + parseFloat(inst.amount);
  }, 0);

  const difference = updatedTotal - this.originalTotalAmount;



  if (difference !== 0) {
    this.validationErrorMessage = difference > 0
      ? `Updated total is ₹${difference} more than the original amount.`
      : `Updated total is ₹${Math.abs(difference)} less than the original amount.`;
  } else {
    this.validationErrorMessage = '';
  }

}
}