import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { qualifications } from '../../Models/ProfileModels';
import { CollegeService } from 'src/app/college/Services/college.service';
import { StudentProfileService } from '../../Service/student-profile.service';

@Component({
  selector: 'app-editqualificationdialog',
  templateUrl: './editqualificationdialog.component.html',
  styleUrls: ['./editqualificationdialog.component.css']
})
export class EditqualificationdialogComponent implements OnInit {
  qualificationForm!: FormGroup;
  colleges: any[] = [];
  yearPattern = '^[0-9]{4}$'; 
  minAllowedYear: number = 1900;
  maxAllowedYear: number = new Date().getFullYear();
  studentDob!: Date;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditqualificationdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: qualifications,
    private collegeService: CollegeService,
    private studentProfileService: StudentProfileService,
    private cdr: ChangeDetectorRef
  ) {
    this.qualificationForm = this.fb.group({
      qualificationId: [{ value: data.qualificationId, disabled: true }, Validators.required],
      collegeName: [data.collegeName || '', Validators.required],
      qualificationName: [data.qualificationName || '', Validators.required],
      passOutYear: [
        data.passOutYear || '',
        [Validators.required, Validators.pattern(this.yearPattern), this.yearValidator.bind(this)]
      ],
      collegeId: [data.collegeId || '']
    });
  }

  ngOnInit(): void {
    // Fetch colleges
    this.collegeService.getColleges().subscribe({
      next: (colleges) => {
        this.colleges = colleges;
        if (this.data.collegeId && this.colleges.length > 0) {
          const college = this.colleges.find(c => c.collegeId === this.data.collegeId);
          if (college) {
            this.qualificationForm.patchValue({ collegeName: college.collegeName });
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching colleges:', err)
    });

    // Fetch student DOB
    this.studentProfileService.getStudentProfileById(this.data.studentId).subscribe({
      next: (student) => {
        if (student?.dob) {
          this.studentDob = new Date(student.dob);
          this.minAllowedYear = this.studentDob.getFullYear() + 16; // Must be at least 16
          this.qualificationForm.get('passOutYear')?.updateValueAndValidity();
        }
      },
      error: (err) => console.error('Error fetching student profile:', err)
    });
  }

  // ✅ Custom Year Validator
  yearValidator(control: AbstractControl): ValidationErrors | null {
    const year = Number(control.value);
    if (!year || year < this.minAllowedYear || year > this.maxAllowedYear) {
      return { invalidYear: true };
    }
    if (this.studentDob) {
      const ageAtPassOut = year - this.studentDob.getFullYear();
      if (ageAtPassOut < 16) {
        return { tooYoung: true };
      }
    }
    return null;
  }

  get passOutYearErrors() {
    const control = this.qualificationForm.get('passOutYear');
    return control?.errors;
  }

  onSave() {
    if (this.qualificationForm.valid) {
      const collegeName = this.qualificationForm.value.collegeName;
      const collegeId = this.colleges.find(c => c.collegeName === collegeName)?.collegeId || this.data.collegeId;

      if (!collegeId) {
        alert('Please select a valid college.');
        return;
      }

      const updatedQualification: qualifications = {
        ...this.data,
        ...this.qualificationForm.getRawValue(),
        qualificationId: this.qualificationForm.getRawValue().qualificationId,
        collegeId
      };

      console.log('Saving qualification:', updatedQualification);
      this.dialogRef.close(updatedQualification);
    } else {
      this.qualificationForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
