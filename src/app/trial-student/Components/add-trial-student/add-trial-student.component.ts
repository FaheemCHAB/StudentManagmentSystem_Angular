import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrialStudentService } from '../../Services/trial-student.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseService } from 'src/app/course/Services/course.service';
import { Course } from 'src/app/course/Models/Course';
@Component({
  selector: 'app-add-trial-student',
  templateUrl: './add-trial-student.component.html',
  styleUrls: ['./add-trial-student.component.css']
})
export class AddTrialStudentComponent implements OnInit {
  studentForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
    courses: Course[] = []; 

  constructor(
    private fb: FormBuilder,
    private trialStudentService: TrialStudentService,
    private router: Router,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  address: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
  courseId: ['', Validators.required] // <-- use CourseId
});

   
     this.loadCourses();
  }
   

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (res) => this.courses = res,
      error: (err) => console.error('Error loading courses', err)
    });
  }

  
  onSubmit(): void {
  if (this.studentForm.invalid) return;

  this.trialStudentService.addTrialStudent(this.studentForm.value).subscribe({
    next: (res) => {
      this.trialStudentService.courseId=res.courseId;
      
      this.successMessage = 'Trial student added successfully';
      this.errorMessage = '';

      // ✅ assuming backend returns created trial student with its id
     const trialStudentId = res.trialStudentId || res.id;

      // Navigate to fee payment form with query param
     this.router.navigate(['/home/feePayment/paymentForm'], { 
        queryParams: { trialStudentId },
         state: { trialStudent: res }   
         
      });
    },
    error: (err: HttpErrorResponse) => {
      if (err.status === 409 && err.error?.message) {
        this.errorMessage = err.error.message; // "Email already exists"
      } else {
        this.errorMessage = 'Something went wrong. Please try again.';
      }
    }
  });
}
 
}
