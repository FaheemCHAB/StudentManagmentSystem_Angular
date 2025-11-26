import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QualificationService } from 'src/app/qualification/Services/qualification.service';
import { qualification } from 'src/app/qualification/Models/qualification';

@Component({
  selector: 'app-update-qualification',
  templateUrl: './update-qualification.component.html',
  styleUrls: ['./update-qualification.component.css']
})
export class UpdateQualificationComponent implements OnInit {
  qualificationForm!: FormGroup;
  QualificationId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private qualificationService: QualificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.QualificationId = this.route.snapshot.paramMap.get('qualificationId')!;
    
    this.qualificationForm = this.fb.group({
      QualificationName: ['', Validators.required],
      QualificationDiscription: ['']
    });

    this.loadQualificationData();
  }

  loadQualificationData() {
    this.qualificationService.getQualificationById(this.QualificationId).subscribe({
      next: (data: qualification) => {
        this.qualificationForm.patchValue({
          QualificationName: data.qualificationName,
          QualificationDiscription: data.qualificationDiscription
        });
      },
      error: (err) => {
        console.error('Error loading qualification:', err);
      }
    });
  }

  onSubmit() {
    if (this.qualificationForm.invalid) return;

    const updatedQualification: qualification = {
      qualificationListId: this.QualificationId,
      qualificationName: this.qualificationForm.value.QualificationName,
      qualificationDiscription: this.qualificationForm.value.QualificationDiscription
    };

    this.qualificationService.updateQualification(this.QualificationId, updatedQualification)
      .subscribe({
        next: () => {
          this.router.navigate(['/home/qualification/viewQualification']);
        },
        error: (err) => {
          console.error('Update failed:', err);
        }
      });
  }
}
