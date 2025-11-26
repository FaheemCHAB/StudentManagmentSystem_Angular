import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StudentProfileService } from '../../Service/student-profile.service';
import { CollegeService } from 'src/app/college/Services/college.service';
import { QualificationService } from 'src/app/qualification/Services/qualification.service';
import { ExperienceConfirmDialogComponent } from '../experience-confirm-dialog/experience-confirm-dialog.component';
import { qualifications } from '../../Models/ProfileModels';
import { qualification } from 'src/app/qualification/Models/qualification';
import { ProgressTrackerService } from '../../Service/progress-tracker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.css']
})
export class QualificationComponent implements OnInit {
  @Output() saveAndNext = new EventEmitter<any>();
  
  qualificationForm!: FormGroup;
  colleges: any[] = [];
  qualifications: qualification[] = [];
  studentId!: string | null;
  studentDob!: Date;
  fromViewPage: boolean = false;

  // steps = [
  //   { label: 'Basic Info' },
  //   { label: 'Qualification' },
  //   { label: 'Experience' },
  //   { label: 'Course' },
  //   { label: 'Fees' },
  //   { label: 'Feestructure' }
  // ];
  // currentStep = 1; // zero-based index (1 = Qualification)

  // get progressValue(): number {
  //   return (this.currentStep / (this.steps.length - 1)) * 100;
  // }

  ////**** */
   steps: { label: string }[] = [];
  currentStep = 0;
  progressValue = 0;
  private subs = new Subscription();
    ////**** */


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private studentProfileService: StudentProfileService,
    private collegeservice: CollegeService,
    private qualificationService: QualificationService,
    private progressService: ProgressTrackerService 
  ) {
    this.qualificationForm = this.fb.group({
      collegeName: ['', Validators.required],
      qualificationName: ['', Validators.required],
      passOutYear: ['', [Validators.required, this.validatePassOutYear.bind(this)]]
    });
  }

  ngOnInit(): void {
      /////*** */
        this.steps = this.progressService.steps;
    this.progressService.setStep(2);   // QUALIFICATION = STEP 2
    const sub = this.progressService.currentStep$.subscribe(step => {
      this.currentStep = step;
      this.progressValue = this.progressService.getProgressValue(step);
    });
    this.subs.add(sub);
    /******* */

    this.studentId = this.route.snapshot.paramMap.get('studentId');
    this.fromViewPage = this.route.snapshot.queryParamMap.get('from') === 'view';

    // Fetch student DOB
    if (this.studentId) {
      this.studentProfileService.getStudentProfileById(this.studentId).subscribe({
        next: profile => {
          this.studentDob = new Date(profile.dob);
        },
        error: err => console.error('Error fetching student profile:', err)
      });
    }

    // Load colleges
    this.collegeservice.getColleges().subscribe({
      next: res => this.colleges = res,
      error: err => console.error('Error fetching colleges:', err)
    });

    // Load qualifications
    this.qualificationService.getAllQualifications().subscribe({
      next: qua => this.qualifications = qua,
      error: err => console.error('Error fetching qualifications:', err)
    });
  }

  // Custom validator: pass-out year must be valid and student at least 16
  validatePassOutYear(control: AbstractControl): ValidationErrors | null {
    const year = Number(control.value);
    if (!year || year < 1900 || year > new Date().getFullYear()) {
      return { invalidYear: true };
    }
    if (this.studentDob) {
      const ageAtPassOut = year - this.studentDob.getFullYear();
      if (ageAtPassOut < 16) {
        return { tooYoung: true };
      }
    }
    return null;
  }

  get passOutYearErrors() {
    const control = this.qualificationForm.get('passOutYear');
    if (!control) return null;
    return control.errors;
  }

  onSubmit() {
    if (this.qualificationForm.valid && this.studentId) {
      const newQualification: qualifications = {
        ...this.qualificationForm.value,
        studentId: this.studentId,
        qualificaionId: '', // backend can generate ID
        collegeId: this.colleges.find(c => c.collegeName === this.qualificationForm.value.collegeName)?.collegeId || null
      };

      this.studentProfileService.addQualification(newQualification).subscribe({
        next: response => {
          this.studentProfileService.updateStudentData({ qualification: response });

          this.qualificationForm.reset();
          if (this.fromViewPage) {
            this.router.navigate(['/home/studentProfile/viewProfile', this.studentId]);
          } else {
            const dialogRef = this.dialog.open(ExperienceConfirmDialogComponent, {
              width: '300px',
              data: { message: 'Would you like to add experience now?' }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.router.navigate(['/home/studentProfile/experience', this.studentId]);
                this.progressService.setStep(3);
              } else {
                this.router.navigate(['/home/studentProfile/courseDetails', this.studentId]);
                 this.progressService.setStep(4);
              }
            });
          }
        },
        error: error => console.error('Error adding qualification:', error)
      });
    }
  }

  onCancel() {
    this.router.navigate(['/home/studentProfile/courseDetails', this.studentId]);
    this.progressService.setStep(4);
  }
}
