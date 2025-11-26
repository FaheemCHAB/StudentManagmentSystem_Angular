import { Component, OnInit } from '@angular/core';
import { StudentProfileService } from 'src/app/student-profile/Service/student-profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReturnMode } from '../../Models/feePayment';
import { FeemanagementService } from '../../Services/feemanagement.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-return-form',
  templateUrl: './return-form.component.html',
  styleUrls: ['./return-form.component.css']
})
export class ReturnFormComponent implements OnInit{

  returnForm!:FormGroup;
  students: any[] = [];
  returnModes = [
    { key: ReturnMode.Debit, value: 'Debit' },
    { key: ReturnMode.Credit, value: 'Credit' }
  ];
  constructor(
    private fb:FormBuilder,
    private studentService:StudentProfileService,
    private feeService:FeemanagementService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.returnForm = this.fb.group({
      studentId: ['', Validators.required],
      returnMode: ['', Validators.required],
      returnAmount: ['', [Validators.required, Validators.min(1)]],
      returnDate: [new Date(), Validators.required],
      remarks: ['']
    });
    this.loadStudents();
  }

  loadStudents(){
    this.studentService.getStudentProfile().subscribe((res)=>{
    this.students=res
    })
  }

   onSubmit() {
    if (this.returnForm.valid) {
      this.feeService.addReturnFee(this.returnForm.value).subscribe({
        next: (res) => {
          console.log('Return Fee Added', res);
          // Get studentId from form value
        const studentId = this.returnForm.get('studentId')?.value;
          this.router.navigate(['/home/studentProfile/viewProfile',studentId])
        },
        error: (err) => {
          console.error('Error while saving', err);
        }
      });
    }
  }
}

