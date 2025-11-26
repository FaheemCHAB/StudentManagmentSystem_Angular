import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrialStudentService } from '../../Services/trial-student.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-trial-student',
  templateUrl: './add-trial-student.component.html',
  styleUrls: ['./add-trial-student.component.css']
})
export class AddTrialStudentComponent implements OnInit {
  studentForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private trialStudentService: TrialStudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) return;

    this.trialStudentService.addTrialStudent(this.studentForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        //alert(this.successMessage);
        this.router.navigate(['/home/trialStudent']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409 && err.error?.message) {
          this.errorMessage = err.error.message; // "Email already exists"
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
        //alert('Error adding student: ' + this.errorMessage);
      }
    });
  }
}
