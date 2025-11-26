import { Component, OnInit } from '@angular/core';
import { TrialStudentService } from '../../Services/trial-student.service';
import { trialStudent } from '../../Models/trialStudent';
import { Router } from '@angular/router';
import { studentProfile } from 'src/app/student-profile/Models/ProfileModels';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environment/environment';

@Component({
  selector: 'app-enrolled-students',
  templateUrl: './enrolled-students.component.html',
  styleUrls: ['./enrolled-students.component.css']
})
export class EnrolledStudentsComponent implements OnInit {
  enrolledStudents: trialStudent[] = [];
  filteredStudents: trialStudent[] = [];
  studentProfiles: studentProfile[] = [];
  searchTerm: string = '';
  showStudentList: boolean = false;

  constructor(
    private studentService: TrialStudentService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEnrolledStudents(); // Load once, but don't show yet
    this.loadStudentProfiles();
  }

  loadEnrolledStudents(): void {
    this.studentService.getEnrolledStudents().subscribe({
      next: (data) => {
        this.enrolledStudents = data;
        this.filteredStudents = []; // initially empty
      },
      error: (err) => {
        alert('Failed to load enrolled students: ' + err.message);
      }
    });
  }

  loadStudentProfiles(): void {
    this.http.get<studentProfile[]>(`${environment.baseurl}/studentprofile`)
      .subscribe({
        next: (data) => {
          this.studentProfiles = data;
        },
        error: (err) => {
          alert('Failed to load student profiles: ' + err.message);
        }
      });
  }

  onSearchInput(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();

    if (this.searchTerm) {
      this.filteredStudents = this.enrolledStudents.filter(student =>
        (student.firstName + ' ' + student.lastName).toLowerCase().includes(this.searchTerm)
      );
      this.showStudentList = true;
    } else {
      this.filteredStudents = this.showStudentList ? [...this.enrolledStudents] : [];
    }
  }

  onListStudents(): void {
    this.showStudentList = true;
    this.searchTerm = '';
    this.filteredStudents = [...this.enrolledStudents];
  }

  getStudentId(trialStudentId: string): string | undefined {
    const profile = this.studentProfiles.find(p => p.trialStudentId === trialStudentId);
    return profile?.studentId;
  }

  viewProfile(student: trialStudent): void {
    const studentId = this.getStudentId(student.trialStudentId);
    if (studentId) {
      this.router.navigate(['/home/studentProfile/viewProfile', studentId]);
    } else {
      alert('Student profile not found for trial student ID: ' + student.trialStudentId);
    }
  }
}
