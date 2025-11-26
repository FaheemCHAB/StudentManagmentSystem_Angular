import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentProfileService } from '../../Service/student-profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TrialStudentService } from 'src/app/trial-student/Services/trial-student.service';
import { ChangeDetectorRef } from '@angular/core';
import { CourseService } from 'src/app/course/Services/course.service';
import { feeStructure } from '../../Models/ProfileModels';
import { MatTableDataSource } from '@angular/material/table';
import { ProgressTrackerService } from '../../Service/progress-tracker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fee-structure',
  templateUrl: './fee-structure.component.html',
  styleUrls: ['./fee-structure.component.css']
})
export class FeeStructureComponent implements OnInit {

  feeStructureForm!: FormGroup
  installmentsForm!: FormGroup;
  studentId: string | undefined;
  trialStudentId!:string;
  courseDetailId!: string
  showTable: boolean = false;
  createdFeeStructureId!: string
  registrationDate!: Date
  enrolledCourseId!: string
  courseFee!: number
  validationErrorMessage: string = '';
  courseCount: number = 0;
  status!:number
  

  // steps = [
  //   { label: 'Basic Info' },
  //   { label: 'Qualification' },
  //   { label: 'Experience' },
  //   { label: 'Course' },
  //   { label: 'Fees' },
  //   { label: 'Feestructure' }
  // ];
  dataSource = new MatTableDataSource<any>();
  // currentStep = 4; // zero-based index (0 means step 1)

  // get progressValue(): number {
  //   return (this.currentStep / (this.steps.length - 1)) * 100;
  // }

    ////********* */
   steps: { label: string }[] = [];
  currentStep = 0;
  progressValue = 0;
  private subs = new Subscription();
    ////********* */

  constructor(
    private fb: FormBuilder,
    private service: StudentProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private trailService: TrialStudentService,
    private courseService: CourseService,
    private cdRef: ChangeDetectorRef,
    private progressService: ProgressTrackerService
  ) { }


  ngOnInit(): void {

  
 this.steps = this.progressService.steps;
    this.progressService.setStep(5);   

    const stepSub = this.progressService.currentStep$.subscribe(step => {
      this.currentStep = step;
      this.progressValue = this.progressService.getProgressValue(step);
    });
    this.subs.add(stepSub);
    /////*** */

    this.route.paramMap.subscribe(params => {
      this.studentId = params.get('studentId')!;
    });

    this.route.queryParams.subscribe(params => {
      this.courseDetailId = params['courseDetailId'];
      this.trialStudentId = params['trialStudentId'] ?? '';
    });

    // ✅ Fallback from service or localStorage
    if (!this.trialStudentId) {
      this.trialStudentId = this.service.trialStudentId || localStorage.getItem('trialStudentId') || '';
    }
    this.service.trialStudentId = this.trialStudentId;

    console.log('FeeStructureComponent → StudentId:', this.studentId);
    console.log('FeeStructureComponent → CourseDetailId:', this.courseDetailId);
    console.log('FeeStructureComponent → TrialStudentId:', this.trialStudentId);
    if (!this.studentId || !this.courseDetailId) {
      console.error('Missing studentId or courseDetailId');
      this.validationErrorMessage = 'Required data is missing. Please start from the beginning.';
      return;
    }
    console.log('Trial Student ID (FeeStructureComponent):', this.service.trialStudentId);
    this.feeStructureForm = this.fb.group({
      totalInstallment: ['', Validators.required]
    });

    this.installmentsForm = this.fb.group({
      installments: this.fb.array([]),

    });
    this.loadTrialStudentData();
    this.loadCourseDetail();
  }

  loadTrialStudentData() {
    this.trailService.getTrialStudentById(this.service.trialStudentId).subscribe({
      next: (data) => {
        console.log('Trial student data received:', data);

        if (data?.registrationTime) {
          this.registrationDate = new Date(data.registrationTime);
          console.log('Parsed registrationDate:', this.registrationDate);
          this.cdRef.detectChanges(); // fixes ExpressionChanged error
        } else {
          console.error('registrationTime is missing in trial student data');
        }
      },
      error: (err) => {
        console.error('Error fetching trial student:', err);
      }
    });
  }

  loadCourseDetail() {

    this.service.getCourseDetailsByStudentId(this.studentId!).subscribe({
    next: (studentCourses) => {
      this.courseCount = studentCourses.length;
      console.log('Course count:', this.courseCount);
    }
  });
    this.service.getCourseDetailsById(this.courseDetailId).subscribe({
      next: (data) => {
        console.log('CourseDetails : ', data);

        // ✅ Check if it's an array and filter the right item by studentId
        const courseDetails = Array.isArray(data) ? data : [data];
        const studentCourses = courseDetails.filter(
          cd => cd.studentProfileId === this.studentId
        );

        

        const selectedCourseDetail = courseDetails.find(cd => cd.studentProfileId === this.studentId);

        if (selectedCourseDetail) {
          this.enrolledCourseId = selectedCourseDetail.courseId;

          if (this.enrolledCourseId) {
            this.courseService.getCourseById(this.enrolledCourseId).subscribe({
              next: (courseData) => {
                console.log('CourseData : ', courseData);
                this.courseFee = courseData.courseFee;
                this.cdRef.detectChanges();
              },
              error: (err) => {
                console.error('Error fetching course data', err);
              }
            });
          }
        } else {
          console.error('No courseDetail matched with current studentId');
        }
      },
      error: (err) => {
        console.error('Error fetching course details:', err);
      }
    });
  }

  get installments(): FormArray {
    return this.installmentsForm.get('installments') as FormArray;
  }

  onSubmit() {
    if (this.feeStructureForm.invalid) return;

    const totalInstallment = this.feeStructureForm.value.totalInstallment;
    const newFeeStructure: feeStructure = {
      studentId: this.studentId!, // <--- trust me, it's there
      courseDetailId: this.courseDetailId,
      totalInstallment
    };

    this.service.addFeeStructure(newFeeStructure).subscribe({
      next: (response) => {
        // alert('Fee structure added successfully');
        this.createdFeeStructureId = response.installmentId; // assuming response returns ID
        console.log(this.createdFeeStructureId)


        this.populateInstallments(totalInstallment);  // use registration date now
        this.showTable = true;
        this.cdRef.detectChanges();
        this.service.enrollmentType='';
        
      },
      error: (err) => {
        console.error('Error saving fee structure:', err);
        alert('Something went wrong!');
      }
    });
  }

  populateInstallments(count: number): void {
    this.installments.clear();

  if (this.service.enrollmentType === 'trial') {
    this.trailService.getRegFeeByTrialId(this.trialStudentId).subscribe({
      next: (data: any) => {
        const status = data?.feeStatus ?? 2; // default Pending
        console.log('feeStatus : ', status);

        if (status === 0) {
          // Registration fee row (paid)
          this.installments.push(
            this.fb.group({
              installmentNumber: [1],
              dueDate: [this.registrationDate ?? new Date(), Validators.required],
              amount: [1000, Validators.required],
              status: [0] // Paid
            })
          );
          this.updateTable();

          for (let i = 2; i <= count + 1; i++) {
            this.installments.push(
              this.fb.group({
                installmentNumber: [i],
                dueDate: ['', Validators.required],
                amount: ['', Validators.required],
                status: [2] // Pending
              })
            );
            this.updateTable();
            console.log('Installments now:', this.installments.value);
          }
        } else {
          // Registration fee not paid → normal installments
          for (let i = 1; i <= count; i++) {
            this.installments.push(
              this.fb.group({
                installmentNumber: [i],
                dueDate: ['', Validators.required],
                amount: ['', Validators.required],
                status: [2] // Pending
              })
            );
            this.updateTable();
            console.log('Installments now:', this.installments.value);
          }
        }

        this.showTable = true;
        this.cdRef.detectChanges();   //  force refresh
      },
      error: (err) => {
        console.error('Error fetching registration fee', err);

        for (let i = 1; i <= count; i++) {
          this.installments.push(
            this.fb.group({
              installmentNumber: [i],
              dueDate: ['', Validators.required],
              amount: ['', Validators.required],
              status: [2] //paid
            })
          );
          this.updateTable();
          console.log('Installments now:', this.installments.value);
        }
        this.showTable = true;
        this.cdRef.detectChanges();   // 🔑 force refresh even on error
      }
    });
  } else {
    // Non-trial enrollment
    for (let i = 1; i <= count; i++) {
      this.installments.push(
        this.fb.group({
          installmentNumber: [i],
          dueDate: ['', Validators.required],
          amount: ['', Validators.required],
          status: [2]
        })
      );
      this.updateTable();
      console.log('Installments now:', this.installments.value);
    }
    this.showTable = true;
    this.cdRef.detectChanges();
  }
  }


//CHANGED
onFirstAmountChange(index: number): void {
  if (index !== 0) return; // only when editing the first row

  const firstAmount = +this.installments.at(0).get('amount')?.value;
  if (!firstAmount || !this.courseFee) return;

  const totalInstallments = this.installments.length;
  const remainingAmount = this.courseFee - firstAmount;

  // Distribute the rest equally
  const equalAmount = Math.floor(remainingAmount / (totalInstallments - 1));
  const remainder = remainingAmount - (equalAmount * (totalInstallments - 1));

  for (let i = 1; i < totalInstallments; i++) {
    const amountCtrl = this.installments.at(i).get('amount');
    if (amountCtrl) {
      const amount = (i === totalInstallments - 1)
        ? equalAmount + remainder
        : equalAmount;
      amountCtrl.setValue(amount);
    }
  }

  this.updateTable();
  console.log('Auto-filled amounts based on first input:', this.installments.value);
}

  //CHANGED
  onFirstDueDateChange(index: number): void {

  if (index !== 0) return;

  const firstDate = this.installments.at(0).get('dueDate')?.value;
  if (!firstDate || !this.courseFee) return;

  const baseDate = new Date(firstDate);
  const totalInstallments = this.installments.length;

  
  const equalAmount = Math.floor(this.courseFee / totalInstallments);
  const remainder=this.courseFee-(equalAmount * totalInstallments);

  for (let i = 0; i < totalInstallments; i++) {
    
    const next = new Date(baseDate);
    next.setMonth(baseDate.getMonth() + i);

    //  Handle overflow (Feb 30 → Feb 28)
    const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    if (baseDate.getDate() > lastDay) next.setDate(lastDay);

    this.installments.at(i).get('dueDate')?.setValue(next);

    const amountCtrl = this.installments.at(i).get('amount');
    if (amountCtrl){

    const amount=i ===totalInstallments -1 ? equalAmount + remainder : equalAmount;
    amountCtrl.setValue(amount);
    }
  }

  this.updateTable(); 
  console.log('Auto-filled:', this.installments.value);
}




  submitInstallments() {
    this.validationErrorMessage = ''; // Clear previous error

    const installments = this.installments.value;

    const totalEnteredAmount = installments.reduce((sum: number, inst: any) => {
      return sum + parseFloat(inst.amount);
    }, 0);

    const difference = totalEnteredAmount - this.courseFee;

    if (difference !== 0) {
      this.validationErrorMessage = difference > 0
        ? `Entered amount is ₹${difference} higher than Course Fee.`
        : `Entered amount is ₹${Math.abs(difference)} lesser than Course Fee.`;

      return; // stop submission
    }

    const fees = installments.map((inst: any) => ({
      feeStructureId: this.createdFeeStructureId,
      installmentNumber: inst.installmentNumber,
      amount: parseFloat(inst.amount),



      dueAmount: parseFloat(inst.amount),

      dueDate: inst.dueDate instanceof Date
        ? this.formatDateToYMD(inst.dueDate)
        : this.formatDateToYMD(new Date(inst.dueDate)),
      status: parseInt(inst.status)
    }));

    this.service.addFees(fees).subscribe({
      next: () => { 
             ///////**** */
                this.progressService.setStep(6);
          /////*** */
        this.router.navigate(['/home/studentProfile/viewProfile', this.studentId]);
      },
      error: (err) => {
        console.error('Failed to save fees', err);
        if (err.error?.errors) {
          console.error('Validation Errors:', err.error.errors);
        }
        this.validationErrorMessage = 'Error saving installments';
      }
    });
  }

  formatDateToYMD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  updateTable() {
  this.dataSource.data = this.installments.controls;
}
}