import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QualificationService } from 'src/app/qualification/Services/qualification.service';

@Component({
  selector: 'app-remove-qualification',
  templateUrl: './remove-qualification.component.html',
  styleUrls: ['./remove-qualification.component.css']
})
export class RemoveQualificationComponent{

 qualificationId!: any
constructor(private router: Router, private service:QualificationService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.qualificationId = this.route.snapshot.paramMap.get('qualificationId');
    console.log(this.qualificationId);
  }


  onCancel() {

    this.router.navigate(['/home/qualification/viewQualification'])
  }

  onConfirm() {

    this.service.deleteQualification(this.qualificationId).subscribe(response => {


      console.log(" removed successfully");
      this.router.navigate(['/home/qualification/viewQualification'])
    },
      error => {
        console.error("Error removing Qualification")
      });
  }


}
