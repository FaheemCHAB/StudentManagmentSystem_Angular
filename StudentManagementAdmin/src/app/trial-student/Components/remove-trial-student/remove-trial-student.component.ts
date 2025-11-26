import { Component, OnInit } from '@angular/core';
import { TrialStudentService } from '../../Services/trial-student.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-remove-trial-student',
  templateUrl: './remove-trial-student.component.html',
  styleUrls: ['./remove-trial-student.component.css']
})
export class RemoveTrialStudentComponent {
 studentId!:any

constructor(private service:TrialStudentService,private router:Router,private route:ActivatedRoute){}

ngOnInit(): void {
  
  this.studentId = this.route.snapshot.paramMap.get('studentId');  
  console.log(this.studentId);
}

onCancel(){
  this.router.navigate(['/home/trialStudent/ViewTrialStudent']);
}

onConfirm(){
  this.service.deleteTrialStudent(this.studentId).subscribe(response=>{   
  console.log("TrialStudent removed successfully");
   this.router.navigate(['/home/trialStudent/ViewTrialStudent']);
  },
error=>{
  console.error("Error removing student")
})
}

}
