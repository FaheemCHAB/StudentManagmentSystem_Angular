import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchService } from '../../Services/batch.service';

@Component({
  selector: 'app-delete-batch',
  templateUrl: './delete-batch.component.html',
  styleUrls: ['./delete-batch.component.css']
})
export class DeleteBatchComponent implements OnInit{

  batchId!:any;
  
  constructor(private router: Router, private service: BatchService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('batchId');
    console.log(this.batchId);
  }

  onConfirm(){
    this.service.deleteBatch(this.batchId).subscribe(response => {


      console.log("Course removed successfully");
      this.router.navigate(['/home/batch/viewBatch'])
    },
      error => {
        console.error("Error removing product")
      })
  }

  onCancel() {

    this.router.navigate(['/home/batch/viewBatch'])
  }
  }

  
