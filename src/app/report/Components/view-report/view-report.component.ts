import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { feeStructure } from 'src/app/student-profile/Models/ProfileModels';
import { StudentProfileService } from 'src/app/student-profile/Service/student-profile.service';
import { fees,InstallmentStatus } from '../../Models/fees';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../Services/report.service';


@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit{

  
  fee:any[]=[];
  public feeStatus=InstallmentStatus;
  searchForm!:FormGroup
  filterFee:any[]=[]
  feeStructureId!:string
  studentId!:string
  constructor(
    private service:StudentProfileService,
    private router:Router,
    private fb:FormBuilder,
    private reportService:ReportService){}

  ngOnInit(): void {
    
this.service.getAllFees().subscribe(data => {
  console.log('Received fees data:', data);
    this.fee = data;
    this.filterFee=this.fee
  });
  
  this.searchForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      status: ['']
    });
}

onSearch() {
  const { fromDate, toDate, status } = this.searchForm.value;

  if (!fromDate || !toDate) {
    alert("Please select both From and To dates.");
    return;
  }

  const parsedFromDate = new Date(fromDate);
  const parsedToDate = new Date(toDate);
  // Ensure the date range covers the full day
  parsedFromDate.setHours(0, 0, 0, 0);
  parsedToDate.setHours(23, 59, 59, 999);
  this.reportService.getFeesByCriteria(parsedFromDate, parsedToDate, status).subscribe({
    next: data => {
      this.filterFee = data;
    },
    error: err => {
      console.error(err);
      this.filterFee = [];
    }
  });
}

getTodayTotalCollection(): number {
  const today = new Date();
  let total = 0;

  for (const row of this.filterFee) {
    const dueDate = this.parseLocalDate(row.dueDate);
    const isToday =
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear();

    if (
      isToday &&
      (row.status === this.feeStatus.paid || row.status === this.feeStatus.pending||row.status===this.feeStatus.partiallyPaid) &&
      row.amount
    ) {
      total += Number(row.amount);
    }
  }
  return total;
}

getTodayCollected(): number {
  const today = new Date();
  let total = 0;

  for (const row of this.filterFee) {
    const dueDate = this.parseLocalDate(row.dueDate);
    const isToday =
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear();

    if (isToday && ((row.status === this.feeStatus.paid)||(row.status === this.feeStatus.partiallyPaid)) && row.amountReceived) {
      total += Number(row.amountReceived);
    }
  }
  return total;
}

getTodayPending(): number {
  
   let total = 0;
   total=this.getTodayTotalCollection()-this.getTodayCollected()
  return total;
}

getMonthTotalCollection(): number {
  const month = new Date();
  let total = 0;

  for (const row of this.filterFee) {
    const dueDate = this.parseLocalDate(row.dueDate);
    const isMonth =
      dueDate.getMonth() === month.getMonth() &&
      dueDate.getFullYear() === month.getFullYear();

    if (
      isMonth &&
      (row.status === this.feeStatus.paid || row.status === this.feeStatus.pending||row.status===this.feeStatus.partiallyPaid) &&
      row.amount
    ) {
      total += Number(row.amount);
    }
  }
  return total;
}

getMonthCollected(): number {
  const month = new Date();
  let total = 0;

  for (const row of this.filterFee) {
    const dueDate = this.parseLocalDate(row.dueDate);
    const isMonth =
      dueDate.getMonth() === month.getMonth() &&
      dueDate.getFullYear() === month.getFullYear();

    if (isMonth && ((row.status === this.feeStatus.paid)||(row.status === this.feeStatus.partiallyPaid)) && row.amountReceived) {
      total += Number(row.amountReceived);
    }
  }
  return total;
}

getMonthPending(): number {
  
  let total = 0;
  total=this.getMonthTotalCollection()-this.getMonthCollected();
  return total;
}

viewDetails(item: any): void {
     this.feeStructureId=item.feeStructureId
     console.log('Fee StructureId',this.feeStructureId);
     this.service.getFeeStructureById(this.feeStructureId).subscribe({
    next: (response) => {
      this.studentId = response.studentId;
      console.log('Student ID:', this.studentId);
      this.router.navigate(['/home/studentProfile/viewProfile', this.studentId]);
    },
    error: (err) => {
      console.error('Failed to fetch fee structure:', err);
    }
  });
  }

  displayedColumns: string[] = ['no', 'amount','amountRecieved', 'dueDate','feeStatus', 'detail'];

  getRowClass(row: any): string {
  const today = new Date();
  const dueDate = this.parseLocalDate(row.dueDate);

  if (row.status === this.feeStatus.paid) {
    return 'paid-status'; // Green
  }

  if (row.status === this.feeStatus.partiallyPaid) {
    return 'partial-status'; // Green
  }

  if (
    row.status === this.feeStatus.pending &&
    dueDate.getDate() < today.getDate() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getFullYear() === today.getFullYear()
  ) {
    return 'due-over'; // Red
  }

  if (
    row.status === this.feeStatus.pending &&
    dueDate.getDate() === today.getDate() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getFullYear() === today.getFullYear()
  ) {
    return 'due-today'; // Red
  }

  if (
    row.status === this.feeStatus.pending &&
    dueDate.getDate() > today.getDate() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getFullYear() === today.getFullYear()
  ) {
    return 'due-this-month'; // Yellow
  }

  return '';
}

parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-based
}

parseLocalDated(input: string | Date): Date {
  if (input instanceof Date) {
    return new Date(input); // Return a new Date instance
  }

  if (typeof input === 'string') {
    const [year, month, day] = input.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  throw new Error('Invalid date format');
}
}
