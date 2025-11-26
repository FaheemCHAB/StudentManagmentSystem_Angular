import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BatchService } from '../../Services/batch.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-batch',
  templateUrl: './add-batch.component.html',
  styleUrls: ['./add-batch.component.css']
})
export class AddBatchComponent implements OnInit {
  batchForm!: FormGroup
  errorMessage!: string
  constructor(
    private formBuilder: FormBuilder,
    private batchService: BatchService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.batchForm = this.formBuilder.group({
      batchName: ['', Validators.required],
      batchTimeFrom: ['', Validators.required],
      batchTimeFromPeriod: ['AM', Validators.required],
      batchTimeTo: ['', Validators.required],
      batchTimeToPeriod: ['PM', Validators.required],
      batchDescription: ['', Validators.required],
    });

  }

  onSubmit() {
    if (this.batchForm.valid) {
      const formValue = this.batchForm.value;
      const batchTime = `${formValue.batchTimeFrom} ${formValue.batchTimeFromPeriod} - ${formValue.batchTimeTo} ${formValue.batchTimeToPeriod}`;
      const batchData = {
        batchName: formValue.batchName,
        batchTime: batchTime,
        batchDescription: formValue.batchDescription,
      };
      this.batchService.addBatch(batchData).subscribe({
        next: (response) => {
          console.log("Batch added successfully,", response);
          this.batchForm.reset({
            batchTimeFromPeriod: 'AM',
            batchTimeToPeriod: 'PM',
          });

          this.router.navigate(['/home/batch/viewBatch'])
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400 && typeof err.error === 'string') {
            this.errorMessage = err.error; // "Batch already available"
          } else {
            this.errorMessage = 'Something went wrong. Please try again.';
          }
        }
      }

      );


    }
  }

}
