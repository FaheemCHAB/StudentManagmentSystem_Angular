import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentProfileService } from 'src/app/student-profile/Service/student-profile.service';

@Component({
  selector: 'app-view-student-report',
  templateUrl: './view-student-report.component.html',
  styleUrls: ['./view-student-report.component.css']
})
export class ViewStudentReportComponent implements OnInit {
  studentId!: string;
  studentFees: any[] = [];
  studentName: string = '';
  courseName: string = '';

  constructor(
    private route: ActivatedRoute,
    private service: StudentProfileService
  ) {}

  ngOnInit(): void {
    
    this.studentId = this.route.snapshot.paramMap.get('studentId') ?? '';
    console.log('Student ID:', this.studentId);

    if (this.studentId) {
      this.loadStudentFees();
    }
  }

  loadStudentFees(): void {
    this.service.getFeesByStudentId(this.studentId).subscribe({
      next: (data) => {
        console.log('Student fees:', data);
        this.studentFees = data;

        if (data.length > 0) {
          this.studentName = data[0].studentName || 'Unknown';
          this.courseName = data[0].courseName || 'N/A';
        }
      },
      error: (err) => {
        console.error('Error fetching student fees:', err);
      }
    });
  }

  getBalance(item: any): number {
    return (item.amount ?? 0) - (item.amountReceived ?? 0);
  }

}
