import { Component, OnInit } from '@angular/core';
import { Course } from '../../Models/Course';
import { CourseService } from '../../Services/course.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.css']
})
export class ViewCourseComponent implements OnInit {

  courseList: Course[] = [];
  filteredList: Course[] = [];
  searchTerm: string = '';
  showCourseList: boolean = false;

  constructor(
    private service: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses() {
    this.service.getAllCourses().subscribe({
      next: (response) => {
        this.courseList = response;
        this.filteredList = []; // Initially hidden
      },
      error: () => {
        console.error("Error fetching data");
      }
    });
  }

  onSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTerm = term;

    if (term) {
      this.filteredList = this.courseList.filter(course =>
        course.courseName?.toLowerCase().includes(term)
      );
      this.showCourseList = true; // show filtered when searching
    } else {
      this.filteredList = this.showCourseList ? [...this.courseList] : [];
    }
  }

  onListCourses() {
    this.showCourseList = true;
    this.searchTerm = '';
    this.filteredList = [...this.courseList];
  }

  addNewCourse() {
    this.router.navigate(['/home/course/add']);
  }

  editCourse(course: Course) {
    this.router.navigate(['/home/course/edit', course.courseId]);
  }

  deleteCourse(courseId: any) {
    this.router.navigate(['/home/course/remove', courseId]);
  }
}
