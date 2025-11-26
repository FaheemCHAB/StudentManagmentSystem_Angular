import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentProfileService } from '../../Service/student-profile.service';
import { qualifications } from '../../Models/ProfileModels';
import { Router, ActivatedRoute } from '@angular/router';
import { CollegeService } from 'src/app/college/Services/college.service';
import { ExperienceConfirmDialogComponent } from '../experience-confirm-dialog/experience-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { qualification } from 'src/app/qualification/Models/qualification';
import { QualificationService } from 'src/app/qualification/Services/qualification.service';
@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.css']
})
export class QualificationComponent implements OnInit {
  @Output() saveAndNext = new EventEmitter<any>();
  qualificationForm!: FormGroup
  showMessage: boolean = false;
  colleges: any[] = [];
    studentId!: string | null;
   fromViewPage: boolean = false;
    qualifications: qualification[] = []; 
  steps = [
    { label: 'Basic Info' },
    { label: 'Qualification' },
    { label: 'Experience' },
    { label: 'Course' },
    { label: 'Fees' },
    { label: 'Feestructure' }
  ];

  currentStep = 1; // zero-based index (0 means step 1)

  get progressValue(): number {
    return (this.currentStep / (this.steps.length - 1)) * 100;
  }
  constructor(
    private qualificationservice: StudentProfileService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private collegeservice: CollegeService,
    private dialog: MatDialog,
    private qualificationService:QualificationService,
  ) {
    this.qualificationForm = this.fb.group({
      collegeName: ['', Validators.required],
      qualificationName: ['', Validators.required],
      passOutYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
    });
  }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('studentId');
    this.fromViewPage = this.route.snapshot.queryParamMap.get('from') === 'view';
    this.collegeservice.getColleges().subscribe({
      next: (res) => {
        this.colleges = res;
      },
      error: (err) => {
        console.error('Error fetching colleges:', err);
      }
    });
    this.qualificationService.getAllQualifications().subscribe({
      next:(qua)=>{
        this.qualifications=qua;
      },
       error: (err) => {
        console.error('Error fetching qualifications:', err);
      }
    })
  }

  onSubmit() {
    if (this.qualificationForm.valid && this.studentId) {
      const newQualification: qualifications = {
        ...this.qualificationForm.value,
        studentId: this.studentId,
        qualificaionId: '', // Let the service generate this if needed
        collegeId: this.colleges.find(c => c.collegeName === this.qualificationForm.value.collegeName)?.collegeId || null // Map collegeName to collegeId
      };
      console.log('Submitting qualification:', newQualification);

      this.qualificationservice.addQualification(newQualification).subscribe({
        next: (response) => {
          this.qualificationservice.updateStudentData({ qualification: response }); // Use response if the service returns the created object
          this.showMessage = true;
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
              } else {
                this.router.navigate(['/home/studentProfile/courseDetails', this.studentId]);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error adding qualification:', error);
        }
      });
    } else {
      console.error('Invalid form or missing studentId:', this.studentId);
    }
  }

  onCancel() {
    this.router.navigate(['/home/studentProfile/courseDetails', this.studentId]);
  }

  onConfirm() {
    this.router.navigate(['/home/studentProfile/experience', this.studentId]);
  }
}