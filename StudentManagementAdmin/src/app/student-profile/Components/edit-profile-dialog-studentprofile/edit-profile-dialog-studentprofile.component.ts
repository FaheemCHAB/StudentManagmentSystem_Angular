import { Component, Inject, OnInit } from '@angular/core';
import { reference, studentProfile } from '../../Models/ProfileModels';
import { trialStudent } from 'src/app/trial-student/Models/trialStudent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrialStudentService } from 'src/app/trial-student/Services/trial-student.service';
import { StudentProfileService } from '../../Service/student-profile.service';
import { StudentStatus } from 'src/app/trial-student/Models/trialStudent';

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
  ) {// Initialize form with default values to prevent undefined errors
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
    this.referenceOptions = Object.keys(reference)
      .filter(key => isNaN(Number(key)))
      .map(key => ({
        value: reference[key as keyof typeof reference],
        label: key.charAt(0).toUpperCase() + key.slice(1)
      }));
  }

  ngOnInit(): void {
    this.trialStudentService.getTrialStudentById(this.data.trialStudentId).subscribe(
      (trialData: trialStudent) => {
        this.trialStudentInfo = trialData;

        const dob = typeof this.data.dob === 'string'
          ? new Date(this.data.dob)
          : this.data.dob instanceof Date
          ? this.data.dob
          : null;

        this.profileForm = this.fb.group({
          studentId: [this.data.studentId, Validators.required],
          trialStudentId: [this.data.trialStudentId, Validators.required],
          firstName: [trialData.firstName || '', Validators.required],
          lastName: [trialData.lastName || '', Validators.required],
          address: [trialData.address || '', Validators.required],
          email: [trialData.email || '', [Validators.required, Validators.email]],
          phone: [trialData.phone || '', Validators.required],
          dob: [dob ? dob.toISOString().split('T')[0] : '', Validators.required],
          referredBy: [this.data.referredBy, Validators.required]
        });
      },
      error => {
        console.error('Failed to load trial student data:', error);
      }
    );
  }

  onSave(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;

      const dobDateOnly = typeof formValue.dob === 'string'
        ? formValue.dob.split('T')[0]
        : formValue.dob instanceof Date
        ? formValue.dob.toISOString().split('T')[0]
        : null;

      const updatedTrialStudent: trialStudent = {
        trialStudentId: formValue.trialStudentId,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        address: formValue.address,
        email: formValue.email,
        phone: formValue.phone,
        status: this.trialStudentInfo.status // ✅ Preserved status
      };

      const updatedProfile: studentProfile = {
        ...this.data,
        dob: dobDateOnly,
        referredBy: formValue.referredBy
      };

      this.trialStudentService.updateTrialStudent(updatedTrialStudent.trialStudentId, updatedTrialStudent).subscribe(() => {
        this.studentService.updateStudentProfile(updatedProfile.studentId, updatedProfile).subscribe(() => {
          this.dialogRef.close({ updatedTrialStudent, updatedProfile });
        });
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}