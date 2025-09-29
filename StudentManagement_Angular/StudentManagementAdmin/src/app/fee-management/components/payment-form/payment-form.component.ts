import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudentProfileService } from 'src/app/student-profile/Service/student-profile.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CourseService } from 'src/app/course/Services/course.service';
import { Course } from 'src/app/course/Models/Course';
import { InstallmentStatus } from 'src/app/student-profile/Models/ProfileModels';
import { MatDialog } from '@angular/material/dialog';
import { PaymentAllocationComponent } from '../payment-allocation/payment-allocation.component';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { TrialStudentService } from 'src/app/trial-student/Services/trial-student.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  feePaymentForm!: FormGroup;

  students: any[] = [];
  trialStudents: any[] = [];
  student!: any;
  courseList: any[] = [];
  selectedCourseId!: string;
  feeStructureId!: string;
  course!: Course;
  selectedCourse!: Course;
  successMessage: string = '';
  errorMessage: string = '';

  isTrialStudent: boolean = false;

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
    private trialStudentService: TrialStudentService,
    private dialog: MatDialog,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();

    // Load all enrolled students and trial students
    this.loadStudents();
    this.loadTrialStudents();

    // Check if URL has studentId or trialStudentId
    this.route.queryParamMap.subscribe(params => {
      const studentId = params.get('studentId');
      const trialStudentId = params.get('trialStudentId');
      console.log('Trial Student ID : ',trialStudentId);
      const navState = history.state as any;
      if (studentId) {
        this.onStudentSelect(studentId);
      }
      else if (navState?.trialStudent) {
        this.patchTrialStudent(navState.trialStudent);
      }
      else if (trialStudentId) {
        // fallback to API if state is missing (page refresh)
        this.loadTrialStudent(trialStudentId);
      }

    });
  }

  initForm() {
    this.feePaymentForm = this.fb.group({
      studentProfileId: [''],
      trialStudentId: [''],
      courseId: [''],
      courseName: [''],
      joinedDate: [''],
      dueDate: [''],
      dueAmount: [''],
      amountReceived: [''],
      amountReceivedDate: [{ value: new Date(), disabled: true }],
      paymentMode: [''],
      feeId: [''],
      remarks: ['']
    });
  }

  /** Load all enrolled students */
  loadStudents() {
    this.studentService.getStudentProfile().subscribe(res => {
      this.students = res;
    });
  }

  /** Load all trial students */
  loadTrialStudents() {
    this.trialStudentService.getTrialStudents().subscribe(res => {
      this.trialStudents = res;
    });
  }

  /** Load a trial student for payment form */
  loadTrialStudent(trialStudentId: string) {
    this.trialStudentService.getTrialStudentById(trialStudentId).subscribe(trialStudent => {
      this.student = trialStudent;

      // Determine course name: either already in trialStudent or fetch from course service
      const courseName = trialStudent.courseName || trialStudent.course?.courseName || 'N/A';
  // Use actual joinedDate if available, otherwise fallback
    const joinedDate = trialStudent.registrationTime 
      ? new Date(trialStudent.registrationTime).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];

      this.feePaymentForm.patchValue({
        trialStudentId: trialStudent.trialStudentId,
        courseName: courseName,
        joinedDate: joinedDate, 
        dueAmount: 1000 // Hardcoded registration fee
      });
    });
  }


  /** Select enrolled student */
  onStudentSelect(studentId: string) {
    this.isTrialStudent = false;

    this.studentService.getStudentProfileById(studentId).subscribe(student => {
      this.student = student;

      this.feePaymentForm.patchValue({
        studentProfileId: student.studentId,
        joinedDate: new Date(student.registrationTime).toISOString().split('T')[0]
      });
    });

    // 2) load course details for that student and then courses
    this.studentService.getCourseDetailsByStudentId(studentId).subscribe(courseDetails => {
      if (!courseDetails || courseDetails.length === 0) {
        this.courseList = [];
        return;
      }

      const observables = courseDetails.map(cd =>
        this.courseService.getCourseById(cd.courseId).pipe(
          map(course => ({
            ...cd,
            courseName: course.courseName,
            courseFee: course.courseFee,
            course

          }))
        )
      );

      forkJoin(observables).subscribe(fullCourses => {
        this.courseList = fullCourses;

        if (fullCourses.length > 0) {
          // auto-select first course by its ID
          this.onCourseSelect(fullCourses[0]);
        }
      });
    }); // ✅ close subscribe correctly
  }

  /** Course selection (selectedCourseDetail is a CourseDetail with course attached) */
  onCourseSelect(selected: any) {
    if (!selected) return;

    this.selectedCourse = selected;

    this.feePaymentForm.patchValue({
      courseDetailId: selected.courseDetailId,
      courseName: selected.courseId,
      courseFee: selected.courseFee
    });

    // fetch fees only for enrolled students (not trial)
    if (!this.isTrialStudent && this.student?.studentId) {
      this.studentService
        .getFeeStructuresByStudentId(this.student.studentId)
        .subscribe(feeStructures => {
          const feeStructure = feeStructures.find(
            (fs: any) => fs.courseDetailId === selected.courseDetailId
          );

          this.feeStructureId = feeStructure?.installmentId ?? '';

          if (feeStructure) {
            // load fees for this feeStructure
            this.studentService
              .getFeesByFeeStructureId(this.feeStructureId)
              .subscribe(feeList => {
                // convert numeric status to enum
                feeList.forEach(
                  (f: any) =>
                    (f.status = this.installmentStatusMap[f.status as number])
                );

                const totalAmountReceived = feeList.reduce(
                  (sum: number, f: any) =>
                    sum + (Number(f.amountReceived) || 0),
                  0
                );
                const totalDueAmount =
                  (this.selectedCourse?.courseFee || 0) - totalAmountReceived;

                const pendingFees = feeList.filter(
                  (f: any) => f.status !== InstallmentStatus.Paid
                );
                const nextDue = pendingFees.sort(
                  (a: any, b: any) =>
                    a.installmentNumber - b.installmentNumber
                )[0];

                if (nextDue) {
                  this.feePaymentForm.patchValue({
                    dueDate: nextDue.dueDate,
                    dueAmount: totalDueAmount >= 0 ? totalDueAmount : 0,
                    feeId: nextDue.feeId
                  });
                } else {
                  this.feePaymentForm.patchValue({
                    dueDate: '',
                    dueAmount: totalDueAmount >= 0 ? totalDueAmount : 0,
                    feeId: ''
                  });
                }
              });
          } else {
            // no fee structure — fallback to course fee
            this.feePaymentForm.patchValue({
              dueDate: '',
              dueAmount: this.selectedCourse?.courseFee || 0,
              feeId: ''
            });
          }
        });
    }
  }
  // compareCourses(c1: any, c2: any): boolean {
  //   return c1 && c2 ? c1.courseId === c2.courseId : c1 === c2;
  //}

  /** Submit handler */
  onSubmit() {
    if (this.feePaymentForm.value.trialStudentId) {
      const trialStudentId = this.feePaymentForm.value.trialStudentId;
      const amount = Number(this.feePaymentForm.value.amountReceived) || 1000; // default to 1000 if not entered

      this.trialStudentService.payRegistrationFee(trialStudentId, amount).subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Registration fee paid successfully!';
          this.errorMessage = ''; // clear error if any
          // ✅ Reset form after payment
          this.feePaymentForm.reset();

          // Optionally redirect to enroll page
          setTimeout(() => {
            this.router.navigate(['/home/trialStudent']);
          }, 2000);


        },
        error: (err) => {

          this.errorMessage = err?.error?.message || 'Payment failed. Please try again.';
          this.successMessage = '';
        }
      });

      return; // stop further processing
    }
    // For enrolled student: confirm whether to allocate using allocation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Do you want to allocate the fee?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Open allocation dialog (user wants custom allocation)
        this.openAllocationDialog();
      } else {
        // Normal quick-submit allocation to the selected installment
        this.processEnrolledStudentPayment();
      }
    });
  }

  /** Enrolled student payment logic (normal submit) */
  private processEnrolledStudentPayment() {
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

    if (!this.feeStructureId) {
      alert('Fee structure not selected.');
      return;
    }

    this.studentService.getFeesByFeeStructureId(this.feeStructureId).subscribe(fees => {
      const sortedFees = fees.sort((a: any, b: any) => a.installmentNumber - b.installmentNumber);
      const targetFeeId = this.feePaymentForm.value.feeId;
      const targetFee = sortedFees.find((fee: any) => fee.feeId === targetFeeId);

      if (!targetFee) {
        alert('Target installment not found.');
        return;
      }

      const feeAmount = Number(targetFee.amount) || 0;
      const alreadyPaid = Number(targetFee.amountReceived) || 0;

      // new cumulative amount received for this installment
      const cumulativeReceived = alreadyPaid + amountReceived;
      const newDueAmount = feeAmount - cumulativeReceived;

      // determine new enum status and convert to numeric for backend
      let newStatusEnum = targetFee.status;
      if (newDueAmount <= 0 && cumulativeReceived > 0) {
        newStatusEnum = InstallmentStatus.Paid;
      } else if (cumulativeReceived > 0 && newDueAmount > 0) {
        newStatusEnum = InstallmentStatus.PartiallyPaid;
      }

      const updatedFee = {
        ...targetFee,
        // send the cumulative amountReceived (so backend has full total for this installment)
        amountReceived: cumulativeReceived,
        // dueAmount for this installment (backend might also compute it but we pass computed)
        dueAmount: newDueAmount >= 0 ? newDueAmount : 0,
        // backend expects numeric status
        status: this.installmentStatusReverseMap[newStatusEnum],
        paymentMode: this.feePaymentForm.value.paymentMode,
        amountReceivedDate: new Date(),
        // amount that was just received in this transaction
        currentReceivedAmount: amountReceived,
        remarks: this.feePaymentForm.value.remarks,
        dueDate: this.feePaymentForm.value.dueDate
      };

      // call API to update fee(s)
      this.studentService.updateFeeByFeeStructureId(this.feeStructureId, [updatedFee]).subscribe({
        next: () => {
          // Refresh student data and UI after success
          const studentId = this.feePaymentForm.value.studentProfileId || this.student?.studentId;
          this.onStudentSelect(studentId);

          // Reset form AFTER successful save
          this.feePaymentForm.reset();

          // Navigate to profile view (if you want that behavior)
          if (studentId) {
            this.router.navigate(['/home/studentProfile/viewProfile', studentId]);
          }
        },
        error: err => {
          console.error('Allocation failed:', err);
          alert(err?.error || 'Failed to allocate payment.');
        }
      });
    });
  }

  openAllocationDialog() {
    const dialogRef = this.dialog.open(PaymentAllocationComponent, {
      width: '100%',
      height: '60%',
      data: {
        feeStructureId: this.feeStructureId,
        amountReceived: this.feePaymentForm.value.amountReceived,
        studentId: this.student.studentId
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(studentId => {
      if (studentId) {
        this.router.navigate(['/home/studentProfile/viewProfile', studentId]);

        // ✅ Reset form after dialog closes
        this.feePaymentForm.reset();
      }
    });
  }

  private patchTrialStudent(trialStudent: any) {
    this.student = trialStudent;
    const courseName = trialStudent.courseName || trialStudent.course?.courseName || 'N/A';

    this.feePaymentForm.patchValue({
      trialStudentId: trialStudent.trialStudentId,
      courseName: courseName,
      joinedDate: new Date().toISOString().split('T')[0],
      dueAmount: 1000
    });
  }
}
