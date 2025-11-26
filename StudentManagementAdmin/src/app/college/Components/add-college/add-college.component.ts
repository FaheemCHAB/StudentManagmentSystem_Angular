import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollegeService } from '../../Services/college.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-college',
  templateUrl: './add-college.component.html',
  styleUrls: ['./add-college.component.css']
})
export class AddCollegeComponent implements OnInit {

  collegeForm!: FormGroup;
  showMessage: boolean = false;
  errorMessage!:string;
  constructor(
    private formBuilder: FormBuilder,
    private collegeService: CollegeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.collegeForm = this.formBuilder.group({
      collegeName: ['', Validators.required],
      location: ['', Validators.required],
      district: ['', Validators.required],
      state: ['', Validators.required],
      phone: ['', [Validators.pattern('^[0-9]{10,15}$')]], // optional field
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.collegeForm.valid) {
      const newCollege = {
        ...this.collegeForm.value,
        phone: this.collegeForm.value.phone || null // convert empty phone to null
      };
       console.log('🚀 Payload to be sent:', newCollege);
      this.collegeService.addCollege(newCollege).subscribe({
        next: (response) => {
          console.log('✅ College added:', response);
          this.collegeForm.reset();
          this.showMessage = true;

          setTimeout(() => {
            this.showMessage = false;
            this.router.navigate(['/home/college/viewCollege']);
          });
        },
        error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error?.error) {
          this.errorMessage = err.error.error; // "Email already exists"
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
        //alert('Error adding student: ' + this.errorMessage);
      }
      });
    } else {
      this.collegeForm.markAllAsTouched(); // show validation errors
    }
  }

  onlyNumber(event: KeyboardEvent): void {
  const pattern = /[0-9]/;
  const inputChar = String.fromCharCode(event.keyCode);
  if (!pattern.test(inputChar)) {
    event.preventDefault();
  }
}
}
