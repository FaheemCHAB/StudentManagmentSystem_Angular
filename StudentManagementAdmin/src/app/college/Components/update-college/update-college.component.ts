import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollegeService } from '../../Services/college.service';

@Component({
  selector: 'app-update-college',
  templateUrl: './update-college.component.html',
  styleUrls: ['./update-college.component.css']
})
export class UpdateCollegeComponent implements OnInit {

  collegeForm!: FormGroup;
  collegeId!: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private collegeService: CollegeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.collegeId = this.route.snapshot.paramMap.get('collegeId');

    this.collegeForm = this.fb.group({
      collegeName: ['', Validators.required],
      location: ['', Validators.required],
      district: ['', Validators.required],
      state: ['', Validators.required],  // ✅ fixed from statet to state
      phone: ['', [Validators.pattern('^[0-9]{10,15}$')]],  // Optional, but must be digits
      description: ['']
    });

    this.loadCollegeData();
  }

  loadCollegeData(): void {
    this.collegeService.getCollegeById(this.collegeId).subscribe(data => {
      this.collegeForm.patchValue({
        collegeName: data.collegeName,
        location: data.location,
        district: data.district,
        state: data.state,
        phone: data.phone?.toString(),  // ✅ convert number to string if needed
        description: data.description
      });
    });
  }

  onSubmit(): void {
    if (this.collegeForm.valid) {
      const updatedCollege = {
        collegeId: this.collegeId,
        ...this.collegeForm.value
      };

      this.collegeService.updateCollege(this.collegeId, updatedCollege).subscribe(() => {
        //alert('College updated successfully!');
        this.router.navigate(['/home/college/viewCollege']);
      });
    }
  }
}
