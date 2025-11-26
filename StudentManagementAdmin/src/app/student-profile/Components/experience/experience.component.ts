import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentProfileService } from '../../Service/student-profile.service';
import { experience } from '../../Models/ProfileModels';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {

experienceForm!: FormGroup;
  showMessage: boolean = false;
  studentId!:any;
    fromViewPage: boolean = false;
  steps = [
 { label: 'Basic Info' },
  { label: 'Qualification' },
  { label: 'Experience' },
  { label: 'Course' },
  { label: 'Fees' },
  {label:'Feestructure'}
];

currentStep = 2; // zero-based index (0 means step 1)

get progressValue(): number {
  return (this.currentStep / (this.steps.length - 1)) * 100;
}
  constructor(
    private fb: FormBuilder,
    private studentService: StudentProfileService,
    private router:Router,
    private route:ActivatedRoute,
    
  ) {
    
  }
  ngOnInit(): void {
   this.studentId = this.route.snapshot.paramMap.get('studentId') ?? '';
    this.experienceForm = this.fb.group({
     
      position: ['', Validators.required],
      companyName: ['', Validators.required],
      totalExperience: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$|^0$/)]]
    });
  }
  onSubmit() {
    if (this.experienceForm.valid && this.studentId) {

      const newExperience: experience = {
        ...this.experienceForm.value,
        studentId:this.studentId}
        console.log('StudentID',this.studentId)
      
    this.studentService.addExperience(newExperience).subscribe({
        next: (response) => {
          this.studentService.updateStudentData({ experience: newExperience });
        
          this.experienceForm.reset({  });
          this.showMessage = true;
           if (this.fromViewPage) {
         this.router.navigate(['/home/studentProfile/viewstudentprofile', this.studentId]);
           }else{
            
          this.router.navigate(['/home/studentProfile/courseDetails',this.studentId]);
           }
        },
        error: (error) => {
          console.error('Error adding new experience:', error);
        }
      });
    }
  }
}
