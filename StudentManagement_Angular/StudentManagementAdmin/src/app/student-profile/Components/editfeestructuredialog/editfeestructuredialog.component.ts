import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { feeStructure } from '../../Models/ProfileModels';

@Component({
  selector: 'app-editfeestructuredialog',
  templateUrl: './editfeestructuredialog.component.html',
  styleUrls: ['./editfeestructuredialog.component.css']
})
export class EditfeestructuredialogComponent {
feeStructureForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditfeestructuredialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: feeStructure
  ) {
    this.feeStructureForm = this.fb.group({
      installmentId: [{ value: data.installmentId, disabled: true }, Validators.required],
      totalInstallment: [data.totalInstallment, [Validators.required, Validators.min(1)]]
    });
  }

 onSave() {
    if (this.feeStructureForm.valid) {
      const updatedFeeStructure: feeStructure = {
        ...this.data,
        totalInstallment: this.feeStructureForm.get('totalInstallment')?.value
      };
      this.dialogRef.close(updatedFeeStructure);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}