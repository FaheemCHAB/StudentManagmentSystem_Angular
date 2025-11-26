import { Component,OnInit } from '@angular/core';
import { QualificationService } from 'src/app/qualification/Services/qualification.service';
import { qualification } from 'src/app/qualification/Models/qualification';
import { Route,Router } from '@angular/router';


@Component({
  selector: 'app-view-qualification',
  templateUrl: './view-qualification.component.html',
  styleUrls: ['./view-qualification.component.css']
})
export class ViewQualificationComponent implements OnInit {

  qualificationList: qualification[] = [];
  filteredList: qualification[] = [];
  searchTerm: string = '';
  showQualificationList: boolean = false;

  constructor(
    private service: QualificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getQualifications();
  }

  getQualifications() {
    this.service.getAllQualifications().subscribe({
      next: (response) => {
        this.qualificationList = response;
        this.filteredList = []; // Initially hidden
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
      this.filteredList = this.qualificationList.filter(qualification =>
        qualification.qualificationName?.toLowerCase().includes(term)
      );
      this.showQualificationList = true; // show filtered when searching
    } else {
      this.filteredList = this.showQualificationList ? [...this.qualificationList] : [];
    }
  }

  onListQualification() {
    this.showQualificationList = true;
    this.searchTerm = '';
    this.filteredList = [...this.qualificationList];
  }

  addNewQualification() {
    this.router.navigate(['/home/qualification/add']);
  }

  editQualification(qualification: qualification) {
    this.router.navigate(['/home/qualification/edit', qualification.qualificationListId]);
  }

  deleteQualification(qualificationId: any) {
    this.router.navigate(['/home/qualification/remove', qualificationId]);
  }
}

