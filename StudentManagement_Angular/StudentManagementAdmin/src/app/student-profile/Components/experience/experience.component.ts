import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { StudentProfileService } from '../../Service/student-profile.service';
import { experience } from '../../Models/ProfileModels';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressTrackerService } from '../../Service/progress-tracker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {

  experienceForm!: FormGroup;
  showMessage: boolean = false;
  studentId!: any;
  studentDob!: Date; // student date of birth
  maxExperience: number = 0;

  // steps = [
  //   { label: 'Basic Info' },
  //   { label: 'Qualification' },
  //   { label: 'Experience' },
  //   { label: 'Course' },
  //   { label: 'Fees' },
  //   { label: 'Feestructure' }
  // ];

  // currentStep = 2; // zero-based index (0 means step 1)

  // get progressValue(): number {
  //   return (this.currentStep / (this.steps.length - 1)) * 100;
  // }

  ////***** */
  steps: { label: string }[] = [];
  currentStep = 0;
  progressValue = 0;
  private subs = new Subscription();
    ////***** */


  constructor(
    private fb: FormBuilder,
    private studentService: StudentProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private progressService: ProgressTrackerService
  ) { }

  ngOnInit(): void {

    ///////****** */
     this.steps = this.progressService.steps;
    this.progressService.setStep(3);
    const stepSub = this.progressService.currentStep$.subscribe(step => {
      this.currentStep = step;
      this.progressValue = this.progressService.getProgressValue(step);
    });
    this.subs.add(stepSub);
    /////***/// */

    this.studentId = this.route.snapshot.paramMap.get('studentId') ?? '';

    // Initialize form
    this.experienceForm = this.fb.group({
      position: ['', Validators.required],
      companyName: ['', Validators.required],
      totalExperience: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
          this.experienceValidator.bind(this)
        ]
      ]
    });

    // Fetch student DOB to calculate max experience
    if (this.studentId) {
      this.studentService.getStudentProfileById(this.studentId).subscribe({
        next: (student) => {
          if (student?.dob) {
            this.studentDob = new Date(student.dob);
            const currentYear = new Date().getFullYear();
            const startWorkYear = this.studentDob.getFullYear() + 16;
            this.maxExperience = currentYear - startWorkYear;
            if (this.maxExperience < 0) this.maxExperience = 0;
          }
        },
        error: (err) => console.error('Error fetching student profile:', err)
      });
    }
  }

  // Custom validator: student must be at least 16 + experience cannot exceed current year
  experienceValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const exp = parseFloat(control.value);
    if (isNaN(exp) || exp < 0) {
      return { invalidExperience: true };
    }
    if (this.maxExperience !== undefined && exp > this.maxExperience) {
      return { experienceExceedsAge: true };
    }
    return null;
  }

  get totalExperienceErrors() {
    return this.experienceForm.get('totalExperience')?.errors;
  }

  onSubmit() {
    if (this.experienceForm.valid && this.studentId) {
      const newExperience: experience = {
        ...this.experienceForm.value,
        studentId: this.studentId
      };

      this.studentService.addExperience(newExperience).subscribe({
        next: (response) => {
          this.studentService.updateStudentData({ experience: newExperience });
          this.experienceForm.reset();
          this.showMessage = true;

          /////******* */
            this.progressService.setStep(4);
            ///////****** */
          this.router.navigate(['/home/studentProfile/courseDetails', this.studentId]);
        },
        error: (error) => {
          console.error('Error adding new experience:', error);
        }
      });
    } else {
      this.experienceForm.markAllAsTouched();
    }
  }
}
