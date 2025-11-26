import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { StudentProfileService } from '../../Service/student-profile.service';
import { BatchService } from 'src/app/batch/Services/batch.service';
import { CourseService } from 'src/app/course/Services/course.service';
import { status, mode } from '../../Models/ProfileModels';
import { TrialStudentService } from 'src/app/trial-student/Services/trial-student.service';
import { ProgressTrackerService } from '../../Service/progress-tracker.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  courseDetailsForm!: FormGroup;
  studentId!: string;
  courses: any[] = [];
  batches: any[] = [];

  // steps = [
  //   { label: 'Basic Info' },
  //   { label: 'Qualification' },
  //   { label: 'Experience' },
  //   { label: 'Course' },
  //   { label: 'Fees' },
  //   { label: 'Feestructure' }
  // ];

  // currentStep = 3;

  // get progressValue(): number {
  //   return (this.currentStep / (this.steps.length - 1)) * 100;
  // }

  ////********* */
   steps: { label: string }[] = [];
  currentStep = 0;
  progressValue = 0;
  private subs = new Subscription();
    ////********* */


  // ✅ Enum options for template
  statusOptions: status[] = [status.ongoing, status.dropped, status.completed, status.placed];
  modeOptions: mode[] = [mode.online, mode.hybrid, mode.offline];

  // ✅ Labels to display in dropdowns
  statusLabels: { [key in status]: string } = {
    [status.ongoing]: 'Ongoing',
    [status.dropped]: 'Dropped',
    [status.completed]: 'Completed',
    [status.placed]: 'Placed'
  };

  modeLabels: { [key in mode]: string } = {
    [mode.online]: 'Online',
    [mode.hybrid]: 'Hybrid',
    [mode.offline]: 'Offline'
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private studentProfileService: StudentProfileService,
    private batchService: BatchService,
    private courseService: CourseService,
    private trialService: TrialStudentService,
    private router: Router,
    private progressService: ProgressTrackerService

  ) {}

  ngOnInit(): void {
    ////***** */
   
this.steps = this.progressService.steps;


const stepSub = this.progressService.currentStep$.subscribe(step => {
  this.currentStep = step;
  this.progressValue = this.progressService.getProgressValue(step);
});
this.subs.add(stepSub);


this.progressService.setStep(4);

    /////*** */


    this.studentId = this.route.snapshot.paramMap.get('studentId') || '';

    this.courseDetailsForm = this.fb.group({
      studentProfileId: [this.studentId],
      courseId: ['', Validators.required],
      batchId: ['', Validators.required],
      timeSlot: ['', Validators.required],
      status: [status.ongoing, Validators.required],
      mode: [mode.online, Validators.required]
    });

    this.loadCourses();
    this.loadBatches();

    // Auto-fill course for trial enrollment
    if (this.studentProfileService.enrollmentType === 'trial' && this.trialService.courseId) {
      this.courseDetailsForm.patchValue({
        courseId: this.trialService.courseId
      });
    }

    this.courseDetailsForm.get('batchId')?.valueChanges.subscribe(batchId => {
      this.onBatchChange(batchId);
    });
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: data => (this.courses = data),
      error: err => console.error('Failed to load courses:', err)
    });
  }

  loadBatches(): void {
    this.batchService.getBatches().subscribe({
      next: data => (this.batches = data),
      error: err => console.error('Failed to load batches:', err)
    });
  }

  onBatchChange(batchId: string): void {
    const batch = this.batches.find(b => b.batchId === batchId);
    this.courseDetailsForm.patchValue({
      timeSlot: batch ? batch.batchTime : ''
    });
  }

  onSubmit(): void {
    if (this.courseDetailsForm.valid) {
      const formData = this.courseDetailsForm.getRawValue();

      this.studentProfileService.addCourseDetails(formData).subscribe({
        next: response => {
          console.log('Saved course detail ID:', response.courseDetailId);
          this.studentProfileService.courseDetailId = response.courseDetailId;
          ///////**** */
                this.progressService.setStep(5);
          /////*** */
          this.router.navigate(['/home/studentProfile/feeStructure', this.studentId], {
            queryParams: { courseDetailId: response.courseDetailId }
          });
        },
        error: err => {
          console.error('Error saving course details:', err);
          alert('Error saving course details.');
        }
      });
    }
  }
}