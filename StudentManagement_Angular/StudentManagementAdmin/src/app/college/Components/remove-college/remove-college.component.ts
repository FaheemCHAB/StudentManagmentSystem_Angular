import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CollegeService } from '../../Services/college.service';


@Component({
  selector: 'app-remove-college',
  templateUrl: './remove-college.component.html',
  styleUrls: ['./remove-college.component.css']
})
export class RemoveCollegeComponent implements OnInit {

  
  collegeId!:any

  constructor(private service:CollegeService,private router:Router,private route:ActivatedRoute){}

ngOnInit(): void {
  
  this.collegeId = this.route.snapshot.paramMap.get('collegeId');  
}

onCancel(){
  this.router.navigate(['/home/college/viewCollege'])
}

onConfirm(){
  this.service.deleteCollege(this.collegeId).subscribe(response=>{   
  console.log("Product removed successfully");
   this.router.navigate(['/home/college/viewCollege'])
  },
error=>{
  console.error("Error removing product")
})
}

}
