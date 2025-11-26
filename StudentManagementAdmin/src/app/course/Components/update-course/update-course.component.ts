import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../Services/course.service';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.css']
})
export class UpdateCourseComponent implements OnInit{
 courseForm!: FormGroup;
  courseId!: any;

   constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
     this.courseId = this.route.snapshot.paramMap.get('courseId');
      console.log(this.courseId)
      this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      installmentCount: ['', Validators.required],
      description: ['', Validators.required],
      courseFee: ['', Validators.required],
      courseDuration: ['', Validators.required],
    });

    this.loadCourseData();
  }
  loadCourseData() {
     this.courseService.getCourseById(this.courseId).subscribe(data => {
      this.courseForm.patchValue({
        courseName: data.courseName,
       courseFee: data.courseFee,
        courseDuration: data.courseDuration,
        installmentCount: data.installmentCount,
        description: data.courseDescription
      });
    });
  }
  onSubmit() {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.value;
      const updatedCourse = {
        courseId: this.courseId,
      courseName: formValue.courseName,
      courseFee: formValue.courseFee,
      courseDuration: formValue.courseDuration,
      installmentCount: formValue.installmentCount,
      courseDescription: formValue.description // ✅ rename properly
      };
        this.courseService.updateCourse(this.courseId, updatedCourse).subscribe(() => {
        //alert('Course updated successfully!');
        this.router.navigate(['/home/course/viewCourse']); 
      });
    }
  }
  }
  


