import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../Services/course.service';

@Component({
  selector: 'app-remove-course',
  templateUrl: './remove-course.component.html',
  styleUrls: ['./remove-course.component.css']
})
export class RemoveCourseComponent {
 
 courseId!: any
constructor(private router: Router, private service: CourseService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    console.log(this.courseId);
  }


  onCancel() {

    this.router.navigate(['/home/course/viewCourse'])
  }

  onConfirm() {

    this.service.deleteCourse(this.courseId).subscribe(response => {


      console.log("Course removed successfully");
      this.router.navigate(['/home/course/viewCourse'])
    },
      error => {
        console.error("Error removing product")
      });
  }


}
