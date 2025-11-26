import { Component, OnInit } from '@angular/core';
import { TrialStudentService } from '../../Services/trial-student.service';
import { trialStudent } from '../../Models/trialStudent';
import { Router } from '@angular/router';


@Component({
  selector: 'app-trial-student-list',
  templateUrl: './view-trial-student.component.html',
  styleUrls: ['./view-trial-student.component.css']
})
export class TrialStudentListComponent implements OnInit {
  trialStudents: trialStudent[] = [];
  filteredStudents: trialStudent[] = [];
  searchTerm: string = '';

  constructor(private studentService: TrialStudentService, private router: Router) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getTrialStudents().subscribe({
      next: (data) => {
        this.trialStudents = data;
        this.filteredStudents = data;
      },
      error: (err) => {
        alert('Failed to load students: ' + err.message);
      }
    });
  }

  onSearchInput(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filteredStudents = this.trialStudents.filter(student =>
      (student.firstName + ' ' + student.lastName).toLowerCase().includes(this.searchTerm)
    );
  }


  editStudent(student:trialStudent): void {
    this.router.navigate(['/home/trialStudent/UpdateTrialStudent/:studentId',student]);
  }

  deleteStudent(trialStudentId: any): void {
    this.router.navigate(['/home/trialStudent/RemoveTrialStudent',trialStudentId])
    console.log(trialStudentId)

  }

  addNewStudent(): void {
    this.router.navigate(['/home/trialStudent/AddTrialStudent']);
  }
}
