import { Component, Inject, OnInit } from '@angular/core';
import { reference, studentProfile } from '../../Models/ProfileModels';
import { trialStudent } from 'src/app/trial-student/Models/trialStudent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrialStudentService } from 'src/app/trial-student/Services/trial-student.service';
import { StudentProfileService } from '../../Service/student-profile.service';

@Component({
  selector: 'app-edit-profile-dialog-studentprofile',
  templateUrl: './edit-profile-dialog-studentprofile.component.html',
  styleUrls: ['./edit-profile-dialog-studentprofile.component.css']
})
export class EditProfileDialogStudentprofileComponent implements OnInit {
  profileForm!: FormGroup;
  trialStudentInfo!: trialStudent;
  referenceOptions: { value: number; label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private trialStudentService: TrialStudentService,
    private studentService: StudentProfileService,
    public dialogRef: MatDialogRef<EditProfileDialogStudentprofileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: studentProfile
  ) {
    // Initialize form to prevent undefined errors
    this.profileForm = this.fb.group({
      studentId: [this.data.studentId || '', Validators.required],
      trialStudentId: [this.data.trialStudentId || '', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dob: ['', Validators.required],
      referredBy: ['', Validators.required]
    });

    // Reference dropdown options
    this.referenceOptions = Object.keys(reference)
      .filter(key => isNaN(Number(key)))
      .map(key => ({
        value: reference[key as keyof typeof reference],
        label: key.charAt(0).toUpperCase() + key.slice(1)
      }));
  }

  ngOnInit(): void {
    // Load trial student data
    this.trialStudentService.getTrialStudentById(this.data.trialStudentId).subscribe(
      (trialData: trialStudent) => {
        this.trialStudentInfo = trialData;

        // DOB from studentProfile
        const dob = this.formatDateLocal(this.data.dob);

        // Initialize form with trial student data + DOB
        this.profileForm = this.fb.group({
          studentId: [this.data.studentId, Validators.required],
          trialStudentId: [this.data.trialStudentId, Validators.required],
          firstName: [trialData.firstName || '', Validators.required],
          lastName: [trialData.lastName || '', Validators.required],
          address: [trialData.address || '', Validators.required],
          email: [trialData.email || '', [Validators.required, Validators.email]],
          phone: [trialData.phone || '', Validators.required],
          dob: [dob, Validators.required],
          referredBy: [this.data.referredBy, Validators.required]
        });
      },
      error => {
        console.error('Failed to load trial student data:', error);
      }
    );
  }

  // Format date as yyyy-MM-dd in local timezone
  private formatDateLocal(date: string | Date | null): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Handle Datepicker changes
  onDobChange(selectedDate: Date | null) {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;
      this.profileForm.get('dob')?.setValue(formatted);
    } else {
      this.profileForm.get('dob')?.setValue(null);
    }
  }

  onSave(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;

      // Updated trial student (preserve status)
      const updatedTrialStudent: trialStudent = {
        trialStudentId: formValue.trialStudentId,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        address: formValue.address,
        email: formValue.email,
        phone: formValue.phone,
        status: this.trialStudentInfo.status
      };

      // Updated student profile
      const updatedProfile: studentProfile = {
        studentId: formValue.studentId,
        trialStudentId: formValue.trialStudentId,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        address: formValue.address,
        email: formValue.email,
        phone: formValue.phone,
        dob: formValue.dob,
        referredBy: formValue.referredBy
      };

      console.log("Profile Payload:", updatedProfile);
      console.log("TrialStudent Payload:", updatedTrialStudent);

      // Save sequentially
      this.trialStudentService.updateTrialStudent(updatedTrialStudent.trialStudentId, updatedTrialStudent)
        .subscribe(() => {
          this.studentService.updateStudentProfile(updatedProfile.studentId, updatedProfile)
            .subscribe(() => {
              this.dialogRef.close({ updatedTrialStudent, updatedProfile });
            });
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
