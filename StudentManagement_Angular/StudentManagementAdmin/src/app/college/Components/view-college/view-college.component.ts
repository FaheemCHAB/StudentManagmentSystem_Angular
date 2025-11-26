import { Component, OnInit } from '@angular/core';
import { CollegeService } from '../../Services/college.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-college',
  templateUrl: './view-college.component.html',
  styleUrls: ['./view-college.component.css']
})
export class ViewCollegeComponent implements OnInit {

  collegeList: any[] = [];      // Full data from DB
  filteredList: any[] = [];     // Filtered view
  searchTerm: string = '';      // Search term string
  showCollegeList: boolean = false; // Controls list visibility

  constructor(
    private collegeService: CollegeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Load college data once on init
    this.collegeService.getColleges().subscribe({
      next: (response) => {
        this.collegeList = response;
        this.filteredList = [];  // Do not show anything initially
      },
      error: (error) => {
        console.error('Error fetching colleges:', error);
      }
    });
  }

  // Show all colleges when user clicks button
  onListColleges(): void {
    this.showCollegeList = true;
    this.searchTerm = ''; // Clear search
    this.filteredList = [...this.collegeList]; // Show all colleges
  }

  // Filter colleges based on search term
  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTerm = value;

    if (value) {
      this.filteredList = this.collegeList.filter(college =>
        college.collegeName?.toLowerCase().includes(value)
      );
      this.showCollegeList = true; // ✅ Show filtered list immediately
    } else {
      this.filteredList = this.showCollegeList ? [...this.collegeList] : [];
    }
  }

  // Navigate to add college page
  addNewCollege(): void {
    this.router.navigate(['/home/college/addCollege']);
  }
}
