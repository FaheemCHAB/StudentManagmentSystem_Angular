
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../Services/course.service';
import { Route, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  courseForm!: FormGroup;
  showMessage = false;
  errorMessage!:string;
  
  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.courseForm = this.formBuilder.group({
      courseName: ['', Validators.required],
      installmentCount: ['', Validators.required],
      description: ['', Validators.required],
      courseFee: ['', Validators.required],
      courseDuration: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const courseValue = this.courseForm.value;
      const newCourse = {
        courseName: courseValue.courseName,
        courseFee: Number(courseValue.courseFee),
        courseDuration: courseValue.courseDuration,
        installmentCount: Number(courseValue.installmentCount),
        courseDescription: courseValue.description //for API
      };
      console.log('Submitting course:', newCourse);
      this.courseService.addCourse(newCourse).subscribe({
       next:(response)=> {
        this.courseForm.reset();
        console.log("Course added successfully.", response);
        this.router.navigate(['/home/course/viewCourse']);
        this.showMessage = true;
      },
        error: (err: HttpErrorResponse) => {
                  if (err.status === 400 && typeof err.error === 'string') {
                    this.errorMessage = err.error; // "Course already available"
                  } else {
                    this.errorMessage = 'Something went wrong. Please try again.';
                  }
                }
      }
        
      );
  }

}
}
