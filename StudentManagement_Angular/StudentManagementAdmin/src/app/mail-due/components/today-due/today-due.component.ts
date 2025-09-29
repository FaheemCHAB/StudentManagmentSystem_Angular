import { Component, OnInit } from '@angular/core';
import { StudentProfileService } from 'src/app/student-profile/Service/student-profile.service';
import { TrialStudentService } from 'src/app/trial-student/Services/trial-student.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MailService } from '../../Services/mail.service';
@Component({
  selector: 'app-today-due',
  templateUrl: './today-due.component.html',
  styleUrls: ['./today-due.component.css']
})
export class TodayDueComponent implements OnInit{

  displayedColumns: string[] = ['selectRow','no', 'studentName', 'email', 'pendingFee', 'dueDate'];
  pendingList: any[] = [];
  selection = new SelectionModel<any>(true, []); // Allow multi-select

  constructor(private feeService:StudentProfileService,private mailService:MailService){}
  ngOnInit(): void {
   
    this.loadTodayPendingFees();
  }

  loadTodayPendingFees(): void {
    this.feeService.getTodayPendingFees().subscribe({
      next: (data) => {
        this.pendingList = data.map((item: any) => ({
          ...item,
          selected: false // Add checkbox control
        }));
        console.log("Pending fee list:", this.pendingList);
      },
      error: (err) => {
        console.error("Failed to fetch pending fees:", err);
      }
    });
  }

  
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.pendingList.length;
  return numSelected === numRows;
}

toggleAllRows(event: any) {
  if (this.isAllSelected()) {
    this.selection.clear();
  } else {
    this.pendingList.forEach(row => this.selection.select(row));
  }
}

sendReminderToSelected() {
  const selectedStudents = this.selection.selected;

  if (selectedStudents.length === 0) {
    alert("Please select at least one student.");
    return;
  }

  // Collect emails from selected students
  const emails = selectedStudents.map(student => student.email);

  // Send all emails together
  this.mailService.sendRemindersToList(emails).subscribe({
    next: () => {
      alert("Reminders sent to selected students.");
      console.log("Success");
    },
    error: (err) => {
      console.error("Failed to send reminders:", err);
      
    }
  });
}
}
