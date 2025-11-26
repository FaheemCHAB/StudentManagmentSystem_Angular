import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { courseDetails, mode ,status} from '../../Models/ProfileModels';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BatchService } from 'src/app/batch/Services/batch.service';
import { CourseService } from 'src/app/course/Services/course.service';
import { ChangeDetectorRef } from '@angular/core';
import { batch } from 'src/app/batch/Models/batch';
import { Course } from 'src/app/course/Models/Course';

@Component({
  selector: 'app-editcoursedetailsdialog',
  templateUrl: './editcoursedetailsdialog.component.html',
  styleUrls: ['./editcoursedetailsdialog.component.css']
})
export class EditcoursedetailsdialogComponent implements OnInit {
compareEnum = (a: any, b: any) => Number(a) === Number(b);
  courseDetailsForm: FormGroup;
 courses: any[] = [];
  batches: any[] = [];
  statusOptions: status[] = [status.ongoing, status.dropped, status.completed, status.placed];
  modeOptions: mode[] = [mode.online, mode.hybrid, mode.offline];
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
    public dialogRef: MatDialogRef<EditcoursedetailsdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: courseDetails,
    private courseService: CourseService,
    private batchService: BatchService,
    private cdr: ChangeDetectorRef
  ) {
this.courseDetailsForm = this.fb.group({
      courseDetailId: [{ value: data.courseDetailId, disabled: true }, Validators.required],
      studentProfileId: [data.studentProfileId || '', Validators.required],
      courseId: [data.courseId || '', Validators.required],
      batchId: [data.batchId || '', Validators.required],
      timeSlot: [data.timeSlot || '', Validators.required],
    status: [Number(data.status) ?? status.ongoing, Validators.required],
mode: [Number(data.mode) ?? mode.online, Validators.required]

    });
  }
  ngOnInit(): void {
    this.loadCourses();
    this.loadBatches();
    this.courseDetailsForm.get('batchId')?.valueChanges.subscribe(batchId => {
      this.onBatchChange(batchId);
    });
   this.courseDetailsForm.patchValue({
  status: Number(this.data.status),
  mode: Number(this.data.mode)
  
});
console.log('Initial status value:', this.courseDetailsForm.get('status')?.value);
console.log('Initial mode value:', this.courseDetailsForm.get('mode')?.value);

    this.cdr.detectChanges();
  }
  

 loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data: Course[]) => {
        this.courses = data ?? [];
        if (this.data.courseId && this.courses.length > 0) {
          const course = this.courses.find(c => c.courseId === this.data.courseId);
          if (course) {
            this.courseDetailsForm.patchValue({ courseId: course.courseId });
            this.cdr.detectChanges();
          }
        }
      },
      error: (err) => {
        console.error('Failed to load courses:', err);
      }
    });
  }

  loadBatches(): void {
    this.batchService.getBatches().subscribe({
      next: (data: batch[]) => {
        this.batches = data ?? [];
        if (this.data.batchId && this.batches.length > 0) {
          const batch = this.batches.find(b => b.batchId === this.data.batchId);
          if (batch) {
            this.courseDetailsForm.patchValue({
              batchId: batch.batchId,
              timeSlot: batch.batchTime ?? ''
            });
            this.cdr.detectChanges();
          }
        }
      },
      error: (err) => {
        console.error('Failed to load batches:', err);
      }
    });
  }

  onBatchChange(batchId: string): void {
    const batch = this.batches.find(b => b.batchId === batchId);
    this.courseDetailsForm.patchValue({
      timeSlot: batch ? batch.batchTime ?? '' : ''
    });
    this.cdr.detectChanges();
  }

  onSave(): void {
    if (this.courseDetailsForm.valid) {
      const updatedCourseDetails: courseDetails = {
        ...this.data,
        ...this.courseDetailsForm.getRawValue()
      };
      console.log('Saving course details:', updatedCourseDetails);
      this.dialogRef.close(updatedCourseDetails);
    } else {
      console.error('Form is invalid:', this.courseDetailsForm.errors);
      this.courseDetailsForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}