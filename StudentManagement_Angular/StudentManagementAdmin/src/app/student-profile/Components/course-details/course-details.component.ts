import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { StudentProfileService } from '../../Service/student-profile.service';
import { BatchService } from 'src/app/batch/Services/batch.service';
import { CourseService } from 'src/app/course/Services/course.service';
import { status, mode } from '../../Models/ProfileModels';
import { TrialStudentService } from 'src/app/trial-student/Services/trial-student.service';


@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  courseDetailsForm!: FormGroup;
  studentId!: any;

  courses: any[] = [];
  batches: any[] = [];
 steps = [
 { label: 'Basic Info' },
  { label: 'Qualification' },
  { label: 'Experience' },
  { label: 'Course' },
  { label: 'Fees' },
  {label:'Feestructure'}
];

currentStep = 3; // zero-based index (0 means step 1)

get progressValue(): number {
  return (this.currentStep / (this.steps.length - 1)) * 100;
}
  // Explicitly typed enum arrays for template
  statusOptions: status[] = [status.ongoing, status.dropped, status.completed, status.placed];
  modeOptions: mode[] = [mode.online, mode.hybrid, mode.offline];

  // Human-readable labels
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
    private trialService:TrialStudentService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('studentId') || '';
    
    this.route.queryParams.subscribe(params => {
    const from = params['from'];
    if (from === 'view') {
      // do something special if needed
    }
  });
    this.courseDetailsForm = this.fb.group({
      studentProfileId: [this.studentId], // Hidden but submitted
      courseId: ['', Validators.required],
      batchId: ['', Validators.required],
      timeSlot: ['', Validators.required],
      status: [status.ongoing, Validators.required],
      mode: [mode.online, Validators.required]
    });

    this.loadCourses();
    this.loadBatches();

    this.courseDetailsForm.get('batchId')?.valueChanges.subscribe(batchId => {
      this.onBatchChange(batchId);
    });

    // 👉 Check enrollment type
  if (this.studentProfileService.enrollmentType === 'trial' && this.trialService.courseId) {
    // Prefill trial student's course
    this.courseDetailsForm.patchValue({
      courseId: this.trialService.courseId
    });
  }
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(data => {
      this.courses = data;
    });
  }

  loadBatches(): void {
    this.batchService.getBatches().subscribe({
      next: (data) => {
        this.batches = data;
      },
      error: (err) => {
        console.error('Failed to load batches', err);
      }
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
        next: (response) => {
          // alert('Course details saved successfully!');
          this.studentProfileService.courseDetailId=response.courseDetailId
          console.log(this.studentProfileService.courseDetailId)
          this.courseDetailsForm.reset({
            studentProfileId: this.studentId
          });

          this.router.navigate(['/home/studentProfile/feeStructure', this.studentId],
            {
    queryParams: { courseDetailId: response.courseDetailId }
  }
          )
        },
        error: err => {
          console.error(err);
          alert('Error saving course details');

        }
      
      })
}
  }
}
