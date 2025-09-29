import { Component, OnInit } from '@angular/core';
import { batch } from '../../Models/batch';
import { BatchService } from '../../Services/batch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-batch',
  templateUrl: './view-batch.component.html',
  styleUrls: ['./view-batch.component.css']
})
export class ViewBatchComponent implements OnInit {

  batchList: batch[] = [];
  filteredList: batch[] = [];
  searchTerm: string = '';
  showBatchList: boolean = false;

  constructor(private service: BatchService, private router: Router) {}

  ngOnInit(): void {
    this.getBatches();
  }

  getBatches() {
    this.service.getBatches().subscribe({
      next: (response) => {
        this.batchList = response;
        this.filteredList = []; // initially hidden
      },
      error: () => {
        console.error("Error fetching data");
      }
    });
  }

  onSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTerm = term;

    if (term) {
      this.filteredList = this.batchList.filter(batch =>
        batch.batchName.toLowerCase().includes(term) ||
        batch.batchDescription?.toLowerCase().includes(term)
      );
      this.showBatchList = true; // show on search
    } else {
      this.filteredList = this.showBatchList ? [...this.batchList] : [];
    }
  }

  onListBatches() {
    this.showBatchList = true;
    this.searchTerm = '';
    this.filteredList = [...this.batchList];
  }

  addNewBatch() {
    this.router.navigate(['/home/batch/addBatch']);
  }

  editBatch(batch: batch) {
    this.router.navigate(['/home/batch/updateBatch', batch.batchId]); // corrected routing
  }

  deleteBatch(batchId: any) {
    this.router.navigate(['/home/batch/removeBatch', batchId]);
  }
}
