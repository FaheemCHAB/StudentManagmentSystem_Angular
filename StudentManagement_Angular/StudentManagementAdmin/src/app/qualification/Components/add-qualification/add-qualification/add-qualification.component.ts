import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { QualificationService } from 'src/app/qualification/Services/qualification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-qualification',
  templateUrl: './add-qualification.component.html',
  styleUrls: ['./add-qualification.component.css']
})
export class AddQualificationComponent implements OnInit {

  QualificationForm!: FormGroup;
  showMessage = false;
  errorMessage!: string;

  constructor(
    private formBuilder: FormBuilder,
    private qualificationService: QualificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Form with both fields required
    this.QualificationForm = this.formBuilder.group({
      qualificationName: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.QualificationForm.valid) {
      const formValue = this.QualificationForm.value;

      // Match backend property names exactly (PascalCase)
      const newQualification = {
        qualificationName: formValue.qualificationName,
        qualificationDiscription: formValue.description
      };

      console.log('Submitting qualification:', newQualification);

      this.qualificationService.addQualification(newQualification).subscribe({
        next: (response) => {
          this.QualificationForm.reset();
          console.log("Qualification added successfully.", response);
          this.router.navigate(['/home/qualification/viewQualification']);
          this.showMessage = true;
        },
        error: (err: HttpErrorResponse) => {
          console.error('API error:', err);
          if (err.status === 400) {
            // Display validation message from server if available
            this.errorMessage = err.error?.message || 'Something went wrong. Please check your input.';
          } else {
            this.errorMessage = 'Something went wrong. Please try again.';
          }
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
}
