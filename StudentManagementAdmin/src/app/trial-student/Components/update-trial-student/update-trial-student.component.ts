import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrialStudentService } from '../../Services/trial-student.service';
import { trialStudent } from '../../Models/trialStudent';

@Component({
  selector: 'app-update-trial-student',
  templateUrl: './update-trial-student.component.html',
  styleUrls: ['./update-trial-student.component.css']
})
export class UpdateTrialStudentComponent implements OnInit {
  studentForm!: FormGroup;
  studentId!: any;
    trialStudent!: trialStudent; 

  constructor(
    private fb: FormBuilder,
    private trialStudentService: TrialStudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

 

ngOnInit(): void {
  this.studentId = this.route.snapshot.paramMap.get('trialStudentId');
  this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  this.loadStudentData();
}
  

  loadStudentData(): void {
    this.trialStudentService.getTrialStudentById(this.studentId).subscribe(data => {
          this.studentForm.patchValue({
            firstName: data.firstName,
           lastName: data.lastName,
           address:data.address,
           email:data.email,
           phone:data.phone
            
          });
        });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
          const formValue = this.studentForm.value;
          const updatedStudent = {
            trialStudentId: this.studentId,
          firstName: formValue.firstName,
           lastName: formValue.lastName,
           address:formValue.address,
           email:formValue.email,
           phone:formValue.phone,
          status: this.trialStudent.status
          
          };
            this.trialStudentService.updateTrialStudent(this.studentId, updatedStudent).subscribe(() => {
            //alert('Student updated successfully!');
            this.router.navigate(['/home/trialStudent/ViewTrialStudent']); 
          });
        }
  }
}
