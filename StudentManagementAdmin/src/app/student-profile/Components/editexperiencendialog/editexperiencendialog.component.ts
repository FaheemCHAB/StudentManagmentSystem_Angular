import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { experience } from '../../Models/ProfileModels';

@Component({
  selector: 'app-editexperiencendialog',
  templateUrl: './editexperiencendialog.component.html',
  styleUrls: ['./editexperiencendialog.component.css']
})
export class EditexperiencendialogComponent {
editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditexperiencendialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: experience
  ) {
    this.editForm = this.fb.group({
      experienceId: [data.experienceId, Validators.required],
      position: [data.position, Validators.required],
      companyName: [data.companyName, Validators.required],
      totalExperience: [data.totalExperience, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$|^0$/)]]
    });
  }

  onSave() {
    if (this.editForm.valid) {
      const updatedExperience: experience = {
        ...this.data,
        ...this.editForm.value
      };
      this.dialogRef.close(updatedExperience);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

