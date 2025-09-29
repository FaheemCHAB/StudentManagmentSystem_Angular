import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { experience } from '../../Models/ProfileModels';
import { StudentProfileService } from '../../Service/student-profile.service';

@Component({
  selector: 'app-editexperiencendialog',
  templateUrl: './editexperiencendialog.component.html',
  styleUrls: ['./editexperiencendialog.component.css']
})
export class EditexperiencendialogComponent implements OnInit {
  editForm!: FormGroup;
  studentDob!: Date;
  currentYear: number = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private studentService: StudentProfileService,
    public dialogRef: MatDialogRef<EditexperiencendialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: experience
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.editForm = this.fb.group({
      experienceId: [this.data.experienceId, Validators.required],
      position: [this.data.position, Validators.required],
      companyName: [this.data.companyName, Validators.required],
      totalExperience: [
        this.data.totalExperience,
        [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$|^0$/),
          this.experienceValidator.bind(this)
        ]
      ]
    });

    // Fetch student profile to get DOB
    if (this.data.studentId) {
      this.studentService.getStudentProfileById(this.data.studentId).subscribe({
        next: (student) => {
          if (student?.dob) {
            this.studentDob = new Date(student.dob);
            // Trigger validation update
            this.editForm.get('totalExperience')?.updateValueAndValidity();
          }
        },
        error: (err) => console.error('Error fetching student profile:', err)
      });
    }
  }

  // Custom validator for totalExperience
  experienceValidator(control: AbstractControl): ValidationErrors | null {
    const exp = parseFloat(control.value);
    if (isNaN(exp) || exp < 0) {
      return { invalidExperience: true };
    }
    if (this.studentDob) {
      const minWorkYear = this.studentDob.getFullYear() + 16;
      if (minWorkYear + exp > this.currentYear) {
        return { experienceExceedsAge: true };
      }
    }
    return null;
  }

  get totalExperienceErrors() {
    const control = this.editForm.get('totalExperience');
    return control ? control.errors : null;
  }

  onSave() {
    if (this.editForm.valid) {
      const updatedExperience: experience = {
        ...this.data,
        ...this.editForm.value
      };
      this.dialogRef.close(updatedExperience);
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
