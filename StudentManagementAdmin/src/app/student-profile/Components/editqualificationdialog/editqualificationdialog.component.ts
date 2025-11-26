import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { qualifications } from '../../Models/ProfileModels';
import { CollegeService } from 'src/app/college/Services/college.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-editqualificationdialog',
  templateUrl: './editqualificationdialog.component.html',
  styleUrls: ['./editqualificationdialog.component.css']
})
export class EditqualificationdialogComponent {
qualificationForm!: FormGroup;
  colleges: any[] = [];
  yearPattern = '^[0-9]{4}$'; 

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditqualificationdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: qualifications,
    private collegeService: CollegeService,
    private cdr: ChangeDetectorRef
  ) {
   this.qualificationForm = this.fb.group({
      qualificationId: [{ value: data.qualificationId, disabled: true }, Validators.required],
      collegeName: [data.collegeName || '', Validators.required],
      qualificationName: [data.qualificationName || '', Validators.required],
      passOutYear: [data.passOutYear || '', [Validators.required, Validators.pattern(this.yearPattern)]],
      collegeId: [data.collegeId || '']
    });
  }

 ngOnInit(): void {
    this.collegeService.getColleges().subscribe({
      next: (colleges) => {
        this.colleges = colleges;
        if (this.data.collegeId && this.colleges.length > 0) {
          const college = this.colleges.find(c => c.collegeId === this.data.collegeId);
          if (college) {
            this.qualificationForm.patchValue({ collegeName: college.collegeName });
            this.cdr.detectChanges();
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching colleges:', err);
      }
    });
  }

 onSave() {
    if (this.qualificationForm.valid) {
      const collegeName = this.qualificationForm.value.collegeName;
      const collegeId = this.colleges.find(c => c.collegeName === collegeName)?.collegeId || this.data.collegeId;
      if (!collegeId) {
        console.error('No valid collegeId found for collegeName:', collegeName);
        alert('Please select a valid college.');
        return;
      }
      const updatedQualification: qualifications = {
        ...this.data,
        ...this.qualificationForm.getRawValue(),
        qualificationId: this.qualificationForm.getRawValue().qualificationId, // Ensure correct ID
        collegeId
      };
      console.log('Saving qualification:', updatedQualification);
      this.dialogRef.close(updatedQualification);
    } else {
      console.error('Form is invalid:', this.qualificationForm.errors);
      this.qualificationForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}