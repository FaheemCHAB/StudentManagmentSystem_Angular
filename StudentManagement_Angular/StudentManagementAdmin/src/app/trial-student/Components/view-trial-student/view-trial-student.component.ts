import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TrialStudentService } from '../../Services/trial-student.service';
import { trialStudent } from '../../Models/trialStudent';
import { StudentProfileService } from 'src/app/student-profile/Service/student-profile.service';

@Component({
  selector: 'app-trial-student-list',
  templateUrl: './view-trial-student.component.html',
  styleUrls: ['./view-trial-student.component.css']
})
export class TrialStudentListComponent implements OnInit {
  trialStudents: trialStudent[] = [];
  filteredStudents: trialStudent[] = [];
  searchTerm: string = '';
  enrollmentMessage: string = '';
  selectedStudent: trialStudent | null = null;

  private dialogRef: MatDialogRef<any> | null = null;

  @ViewChild('confirmEnrollmentDialog') confirmEnrollmentDialog!: TemplateRef<any>;

  constructor(
    private studentService: TrialStudentService,
    private router: Router,
    private profileService: StudentProfileService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getTrialStudents().subscribe({
      next: (data) => {
        this.trialStudents = data;
        this.filteredStudents = data;
      },
      error: (err) => alert('Failed to load students: ' + err.message)
    });
  }

  onSearchInput(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filteredStudents = this.trialStudents.filter(student =>
      (student.firstName + ' ' + student.lastName).toLowerCase().includes(this.searchTerm)
    );
  }

  editStudent(student: trialStudent): void {
    this.router.navigate(['/home/trialStudent/UpdateTrialStudent', student.trialStudentId]);
  }

  deleteStudent(trialStudentId: any): void {
    this.router.navigate(['/home/trialStudent/RemoveTrialStudent', trialStudentId]);
  }

  addNewStudent(): void {
    this.router.navigate(['/home/trialStudent/AddTrialStudent']);
  }

  enrollStudent(student: trialStudent): void {
    this.enrollmentMessage = '';
    this.studentService.hasPaidRegistrationFee(student.trialStudentId).subscribe({
      next: (isPaid) => {
        if (isPaid) {
          this.profileService.enrollmentType = 'trial';
          this.studentService.trialStudentId=student.trialStudentId
          this.router.navigate(
          ['/home/studentProfile/studentProfileHome'],
          { queryParams: { trialStudentId: student.trialStudentId } } // ✅ also pass in query
        );
        } else {
          this.selectedStudent = student;
          this.dialogRef = this.dialog.open(this.confirmEnrollmentDialog, { width: '400px' });
        }
      },
      error: () => {
        this.enrollmentMessage = 'Failed to verify registration fee status. Please try again later.';
      }
    });
  }

  // payNow(): void {
  //   this.dialogRef?.close();
  //   if (this.selectedStudent) {
  //     this.router.navigate(['/home/feePayment/paymentForm', this.selectedStudent.trialStudentId]);
  //   }
  // }
  payNow(): void {
  this.dialogRef?.close();
  if (this.selectedStudent) {
    // Pass the trial student object directly to payment form
    this.router.navigate(['/home/feePayment/paymentForm'], {
      state: { trialStudent: this.selectedStudent }
    });
  }
}


  enrollAnyway(): void {
    this.dialogRef?.close();
    if (this.selectedStudent) {
      this.profileService.enrollmentType = 'trial';
      this.studentService.trialStudentId=this.selectedStudent.trialStudentId;
      this.router.navigate(['/home/studentProfile/studentProfileHome'], {
      queryParams: { trialStudentId: this.selectedStudent.trialStudentId }
    });
    }
  }
}
