import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudentProfileService } from 'src/app/student-profile/Service/student-profile.service';

import { CourseService } from 'src/app/course/Services/course.service';
import { Course } from 'src/app/course/Models/Course';
import { fee, InstallmentStatus } from 'src/app/student-profile/Models/ProfileModels';
import { MatDialog } from '@angular/material/dialog';
import { PaymentAllocationComponent } from '../payment-allocation/payment-allocation.component'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  feePaymentForm!: FormGroup;
  students: any[] = [];
  courseId!: string;
  feeStructureId!: string;
  course!: Course;
  student!: any;
  registrationDate!: Date;
  
  // Mapping number to enum
readonly installmentStatusMap: { [key: number]: InstallmentStatus } = {
  0: InstallmentStatus.Paid,
  1: InstallmentStatus.PartiallyPaid,
  2: InstallmentStatus.Pending
};

readonly installmentStatusReverseMap: { [key in InstallmentStatus]: number } = {
  [InstallmentStatus.Paid]: 0,
  [InstallmentStatus.PartiallyPaid]: 1,
  [InstallmentStatus.Pending]: 2
};


  constructor(
    private fb: FormBuilder,
    private studentService: StudentProfileService,
    private dialog: MatDialog,
    private courseService: CourseService,
    private router:Router

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadStudents();
  }

  initForm() {
    this.feePaymentForm = this.fb.group({
      studentProfileId: [''],
      courseId: [''],
      courseName: [''],
      joinedDate: [''],
      dueDate: [''],
      dueAmount: [''],
      amountReceived: [''],
      amountReceivedDate: [{ value: new Date(), disabled: true }],
      paymentMode: [''],
       feeId: [''],  // Add this hidden field
       remarks: ['']  
    });
  }

  loadStudents() {
    this.studentService.getStudentProfile().subscribe((res) => {
      this.students = res;
    });
  }

  onStudentSelect(studentId: string) {
    // 1. Get Student Profile
    this.studentService.getStudentProfileById(studentId).subscribe(student => {
      this.student = student;

      this.feePaymentForm.patchValue({
        joinedDate: new Date(student.registrationTime).toISOString().split('T')[0]
      });
    });

    // 2. Get Course Details
    this.studentService.getCourseDetailsByStudentId(studentId).subscribe(courseList => {
      if (courseList.length > 0) {
        const courseDetail = courseList[0];
        this.courseId = courseDetail.courseId;

        // 3. Get Course Name
        this.courseService.getCourseById(this.courseId).subscribe(course => {
          this.course = course;

          this.feePaymentForm.patchValue({
            courseId: this.courseId,
            courseName: course.courseName
          });
        });
      }
    });

    // 4. Get Fee Structure
    this.studentService.getFeeStructuresByStudentId(studentId).subscribe(feeStructures => {
      if (feeStructures && feeStructures.length > 0) {
        this.feeStructureId = feeStructures[0].installmentId!;
        console.log('feeStructureId :', this.feeStructureId);

        // ✅ Only now call fee API
        this.studentService.getFeesByFeeStructureId(this.feeStructureId).subscribe(feeList => {
          // Convert numeric status to string enum
          feeList.forEach(f => {
  f.status = this.installmentStatusMap[f.status as unknown as number];
});
 const totalAmountReceived = feeList.reduce((sum, fee) => sum + (Number(fee.amountReceived) || 0), 0);
                const totalDueAmount = this.course.courseFee - totalAmountReceived;
          const pendingFees = feeList.filter(f => f.status !== InstallmentStatus.Paid);
          const nextDue = pendingFees.sort((a, b) => a.installmentNumber - b.installmentNumber)[0];

          if (nextDue) {
            this.feePaymentForm.patchValue({
              dueDate: nextDue.dueDate,
              dueAmount: totalDueAmount >= 0 ? totalDueAmount : 0,
              feeId: nextDue.feeId  // Store feeId too
            });
            console.log('feeId',nextDue.feeId)
              console.log('totalDueAmount', totalDueAmount);
            console.log('nextDue', nextDue);
          }
        });
      } else {
        console.warn('No fee structure found');
            this.feePaymentForm.patchValue({
                dueDate: '',
                dueAmount: this.course.courseFee || 0,
                feeId: ''
              });
      }
    });
  }

  onSubmit() {
  const amountReceived = Number(this.feePaymentForm.value.amountReceived) || 0;
  const dueAmount = Number(this.feePaymentForm.value.dueAmount) || 0;

  if (amountReceived <= 0) {
    alert('Enter a valid amount.');
    return;
  }

  if (amountReceived > dueAmount) {
    alert(`Entered amount exceeds allowed due amount (${dueAmount}).`);
    return;
  }

  this.studentService.getFeesByFeeStructureId(this.feeStructureId).subscribe(fees => {
  const sortedFees = fees.sort((a, b) => a.installmentNumber - b.installmentNumber);

  const targetFeeId = this.feePaymentForm.value.feeId;
  console.log('target feeId',targetFeeId)
  const targetFee = sortedFees.find(fee => fee.feeId === targetFeeId);
  console.log(targetFee);

  if (!targetFee) {
    alert('Target installment not found.');
    return;
  }

  const feeAmount = Number(targetFee.amount) || 0;
  const paidAmount = Number(targetFee.amountReceived) || 0;
  const newPaidAmount = paidAmount + amountReceived;
  
  console.log('newPaidamount : ',newPaidAmount)
  const newDueAmount = feeAmount - newPaidAmount;

  let newStatus = targetFee.status;
  if (newDueAmount <= 0 && newPaidAmount > 0) {
    newStatus = InstallmentStatus.Paid;
  } else if (newPaidAmount > 0 && newDueAmount > 0) {
    newStatus = InstallmentStatus.PartiallyPaid;
  }

  const updatedFee = {
    ...targetFee,
    amount: feeAmount,
        amountReceived: amountReceived,  // only new amount!
  dueAmount: targetFee.dueAmount - amountReceived,
        status: this.installmentStatusReverseMap[newStatus],
        paymentMode: this.feePaymentForm.value.paymentMode,
        amountReceivedDate: new Date(),
        currentReceivedAmount:amountReceived,
        remarks: this.feePaymentForm.value.remarks,
        dueDate: this.feePaymentForm.value.dueDate
  };

  this.studentService.updateFeeByFeeStructureId(this.feeStructureId, [updatedFee]).subscribe({
    next: () => {
      alert('Payment allocated successfully.');
     //this.feePaymentForm.reset();
        this.onStudentSelect(this.feePaymentForm.value.studentProfileId || this.student.studentId);
         
    },
    error: err => {
      console.error('Allocation failed:', err);
      alert(err.error);
    }
  });
});
  
}

 allocation() {
  this.dialog.open(PaymentAllocationComponent, {
    width: '100%', // You can adjust width/height as needed
    height: '60%',
    data: { feeStructureId: this.feeStructureId }, // Pass data to the dialog
    disableClose: false // Allow user to click outside to close
  });
   this.feePaymentForm.reset();
}

}


