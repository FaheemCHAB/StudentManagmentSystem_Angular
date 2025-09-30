import { Component, OnInit } from '@angular/core';
import { courseDetails, experience, fee, feeStructure, mode, status, qualifications, reference, studentProfile, FeeSummary, InstallmentStatus } from '../../Models/ProfileModels';
import { FormGroup } from '@angular/forms';
import { StudentProfileService } from '../../Service/student-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EditProfileDialogStudentprofileComponent } from '../edit-profile-dialog-studentprofile/edit-profile-dialog-studentprofile.component';
import { DeleteconfirmdialogComponent } from '../deleteconfirmdialog/deleteconfirmdialog.component';
import { EditqualificationdialogComponent } from '../editqualificationdialog/editqualificationdialog.component';
import { EditexperiencendialogComponent } from '../editexperiencendialog/editexperiencendialog.component';
import { EditcoursedetailsdialogComponent } from '../editcoursedetailsdialog/editcoursedetailsdialog.component';
import { EditfeestructuredialogComponent } from '../editfeestructuredialog/editfeestructuredialog.component';
import { EditfeedialogComponent } from '../editfeedialog/editfeedialog.component';
import { TrialStudentService } from 'src/app/trial-student/Services/trial-student.service';
import { CourseService } from 'src/app/course/Services/course.service';
import { BatchService } from 'src/app/batch/Services/batch.service';
import { Pipe, PipeTransform } from '@angular/core';
import { CollegeService } from 'src/app/college/Services/college.service';
import { college } from 'src/app/college/Models/college';
import { Course } from 'src/app/course/Models/Course';

import { of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-viewstudentprofile',
  templateUrl: './viewstudentprofile.component.html',
  styleUrls: ['./viewstudentprofile.component.css']
})
export class ViewstudentprofileComponent implements OnInit {

  transform(value: any): string[] {
    return value ? Object.keys(value) : [];
  }

  selectedStudentProfile: studentProfile | null = null;

  collegesMap: { [id: string]: string } = {};
  courseDataLoaded: boolean = false;
  studentReferenceId!: string;
  studentProfiles: studentProfile[] = [];
  trialStudents: { [key: string]: any } = {};
  qualifications: { [key: string]: qualifications[] } = {};

  qualificationDisplayedColumns = ['qualificationName', 'collegeName', 'passOutYear', 'actions'];
  experiences: { [key: string]: experience[] } = {};
  courseDetails: { [key: string]: courseDetails[] } = {};
  feeDetails: { [key: string]: fee[] } = {};
  feeSummary: { [key: string]: FeeSummary } = {}; // Stores overall fee summary
  coursesList: Course[] = [];
  feeStructures: { [key: string]: feeStructure[] } = {};
  fees: { [key: string]: fee[] } = {};
  // errorMessages: { [key: string]: string } = {};
  errorMessages: Record<string, string[]> = {};
  referredByList: string[] = ['Friend', 'Social Media', 'Advertisement', 'Other']; // Dropdown values
  loadingFeeStructures: { [key: string]: boolean } = {};
  loadingFees: { [key: string]: boolean } = {};
  courses: { [key: string]: string } = {};
  batches: { [key: string]: string } = {};
  feeList: fee[] = [];
  feesList: fee[] = []
  colleges: { collegeId: string, collegeName: string }[] = [];
  defaultImage: string = 'assets/images/photo.jpg';
  feeStatus = InstallmentStatus;
  mode = mode;
  status = status;
  reference = reference;
  referenceKeys: (keyof typeof reference)[] = Object.keys(this.reference).filter(key => isNaN(Number(key))) as (keyof typeof reference)[];

  feeStructureId!: string;
  displayedColumns: string[] = ['installmentNumber', 'dueDate', 'amount', 'amountReceived', 'dueAmount', 'status'];
  registrationDate: string = new Date().toISOString().substring(0, 10);
  displayedColumnss: string[] = ['courseName', 'batch', 'timeSlot', 'status', 'mode', 'actions'];

  constructor(

    private studentService: StudentProfileService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private trialStudentService: TrialStudentService,
    private courseservice: CourseService,
    private batchservice: BatchService,
    private collegeservice: CollegeService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('studentId');
    if (studentId) {
      this.loadStudentProfile(studentId);

    } else {
      console.error("Student ID is missing from route parameters.");
    }

  }

  private loadStudentProfile(studentId: string): void {
    this.studentService.getStudentProfileById(studentId).subscribe({
      next: (profile) => {
        if (!profile?.studentId) {
          console.error('Student ID is missing:', profile);
          this.errorMessages[studentId] ??= [];
          this.errorMessages[studentId].push('Student ID is missing.');
          return;
        }
        this.studentProfiles = [profile];
        this.selectedStudentProfile = profile;
        console.log('Profile :', profile)
        this.studentReferenceId = profile.studentReferenceId;

        this.loadRelatedData(profile);
      },
      error: (err) => {
        console.error(`Error loading student profile for ID ${studentId}:`, err);
        this.errorMessages[studentId] ??= [];
        this.errorMessages[studentId].push(`Student ID ${studentId}: Failed to load student profile`);
      }
    });
  }


  private loadRelatedData(profile: studentProfile): void {
    // Fetch trial student details
    if (profile.trialStudentId) {
      this.trialStudentService.getTrialStudentById(profile.trialStudentId).subscribe({
        next: (trialStudent) => {
          this.trialStudents[profile.trialStudentId!] = trialStudent;

        },
        error: (err) => {
          console.error(`Error loading trial student for ID ${profile.trialStudentId}:`, err);
          this.errorMessages[profile.studentId!] ??= [];
          this.errorMessages[profile.studentId!].push(`Student ID ${profile.studentId}: Failed to load trial student ${profile.trialStudentId}`)
          this.trialStudents[profile.trialStudentId!] = null;
        }
      });
    }
    this.loadQualifications(profile.studentId!);
    this.loadExperiences(profile.studentId!);
    this.loadCourseDetails(profile.studentId!);
    //this.loadFees(profile.studentId!);
   // this.getFeeStructureId(profile.studentId!);
   this.loadFeesByStudentId(profile.studentId!);
  }

  private loadQualifications(studentId: string): void {
    this.studentService.getQualificationsByStudentId(studentId).subscribe({
      next: (data: qualifications[]) => {
        console.log(`Qualifications for student ${studentId}:`, data);
        // Directly assign the qualifications, which already include collegeName
        this.qualifications[studentId] = data ?? [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(`Error loading qualifications for student ${studentId}:`, err);
        this.errorMessages[studentId] ??= [];
        this.errorMessages[studentId].push('Failed to load qualifications.');
        this.qualifications[studentId] = [];
      }
    });
  }

  private loadExperiences(studentId: string): void {
    this.studentService.getExperiencesByStudentId(studentId).subscribe({
      next: (data: experience[]) => {
        console.log(`Loaded experiences for student ${studentId}:`, data);
        this.experiences[studentId] = data ?? [];
      },
      error: (err) => {
        console.error(`Error loading experiences for student ${studentId}:`, err);
        this.experiences[studentId] = []; // Ensure array initialization
      }
    });
  }

  private loadCourseDetails(studentId: string): void {
    this.studentService.getCourseDetailsByStudentId(studentId).subscribe({
      next: (data: courseDetails[]) => {
        console.log(`Raw course details for student ${studentId}:`, data);
        this.courseDetails[studentId] = data ?? [];

        const loadObservables = data.map(detail => {
          const courseObs = detail.courseId ? this.courseservice.getCourseById(detail.courseId) : null;
          const batchObs = detail.batchId ? this.batchservice.getBatchById(detail.batchId) : null;

          return {
            courseId: detail.courseId,
            batchId: detail.batchId,
            courseObs,
            batchObs
          };
        });

        const courseCalls = loadObservables.map(obj =>
          obj.courseObs?.toPromise().then(course => {
            this.courses[obj.courseId] = course?.courseName ?? 'Unknown Course';
            console.log('Resolved Course:', course);
          }) ?? Promise.resolve()
        );

        const batchCalls = loadObservables.map(obj =>
          obj.batchObs?.toPromise().then(batch => {
            this.batches[obj.batchId] = batch?.batchName ?? 'Unknown Batch';
            console.log('Resolved Batch:', batch);
          }) ?? Promise.resolve()
        );

        Promise.all([...courseCalls, ...batchCalls]).then(() => {
          this.courseDataLoaded = true; // ✅ Everything loaded
        });
      },
      error: (err) => {
        console.error(`Error loading course details for student ${studentId}:`, err);
        this.errorMessages[studentId] ??= [];
        this.errorMessages[studentId].push('Failed to load course details.');
      }
    });
  }

  getReferenceText(value: reference | number | undefined): string {
    return value !== undefined ? reference[value] || 'N/A' : 'N/A';
  }

  getStatusText(value: status | number | undefined): string {
    return value !== undefined ? status[value] || 'N/A' : 'N/A';
  }

  getModeText(value: mode | number | undefined): string {
    return value !== undefined ? mode[value] || 'N/A' : 'N/A';
  }

  getInstallmentStatusText(status: number): string {
    switch (status) {
      case InstallmentStatus.Paid:
        return 'Paid';
      case InstallmentStatus.Pending:
        return 'Pending';
      case InstallmentStatus.PartiallyPaid:
        return 'Partially Paid';
      default:
        return 'Unknown';
    }
  }

  getFirstCourseDetail(studentId: string): courseDetails | null {
    const details = this.courseDetails[studentId];
    return details && details.length > 0 ? details[0] : null;
  }

  openEditProfileDialog(profile: studentProfile): void {
    if (!profile) {
      console.error('Invalid profile data');
      this.showSnackBar('Invalid profile data.');
      return;
    }

    const dialogRef = this.dialog.open(EditProfileDialogStudentprofileComponent, {
      width: '500px',
      data: { ...profile }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.updatedProfile) {
        // Update studentProfile only (trialStudent is updated in dialog)
        this.studentService.updateStudentProfile(result.updatedProfile.studentId, result.updatedProfile).subscribe({
          next: () => {
            this.showSnackBar('Student profile updated successfully.');
            this.loadStudentProfile(result.updatedProfile);
           

            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error updating student profile:', err);
            this.showSnackBar('Failed to update student profile.');
          }
        });
      }
    });
  }

  openDeleteProfileDialog(studentId: string): void {
    const dialogRef = this.dialog.open(DeleteconfirmdialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this student profile?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudentProfile(studentId).subscribe({
          next: () => {
            this.showSnackBar('Student profile deleted successfully.');
            this.router.navigate(['/home/trialStudent/EnrolledStudents']);
          },
          error: (err) => {
            console.error('Error deleting student profile:', err);
            this.showSnackBar('Failed to delete student profile.');
          }
        });
      }
    });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  openEditQualificationDialog(qual: qualifications) {
    const studentId = this.getStudentIdByQualification(qual.qualificationId); // Corrected
    if (!studentId) {
      console.error('Student ID not found for qualification:', qual.qualificationId);
      this.showSnackBar('Student ID not found.');
      return;
    }
    const dialogRef = this.dialog.open(EditqualificationdialogComponent, {
      width: '500px',
      data: { ...qual }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Received updated qualification:', result);
        this.studentService.updateQualification(result.qualificationId, result).subscribe({
          next: (response) => {
            console.log('Update response:', response);
            this.showSnackBar('Qualification updated successfully.');
            this.loadQualifications(studentId);
            this.qualifications = { ...this.qualifications }; // Force UI refresh
          },
          error: (err) => {
            console.error('Error updating qualification:', err);
            this.showSnackBar(`Failed to update qualification: ${err.error?.message || err.message || 'Unknown error'}`);
          }
        });
      } else {
        console.log('Dialog closed without changes');
      }
    });
  }

  openDeleteQualificationDialog(qualificationId: string) {
    const studentId = this.getStudentIdByQualification(qualificationId);
    if (!studentId) return;
    const dialogRef = this.dialog.open(DeleteconfirmdialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this qualification?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteQualification(qualificationId).subscribe({
          next: () => {
            this.showSnackBar('Qualification deleted successfully.');
            this.loadQualifications(studentId); // Reload qualifications
          },
          error: (err) => {
            console.error('Error deleting qualification:', err);
            this.showSnackBar('Failed to delete qualification.');
          }
        });
      }
    });
  }

  getStudentIdByQualification(qualificationId: string): string | null {
    for (const studentId in this.qualifications) {
      const list = this.qualifications[studentId];
      if (list.some(q => q.qualificationId === qualificationId)) {
        return studentId;
      }
    }
    return null;
  }

  removeQualificationFromList(id: string): void {
    const studentId = this.getStudentIdByQualification(id);
    if (!studentId) return;
    const list = this.qualifications[studentId];
    this.qualifications[studentId] = list.filter(q => q.qualificationId !== id);
  }

  refreshQualifications(studentId: string): void {
    // Use same service method as loadQualifications for consistency
    this.studentService.getQualificationsByStudentId(studentId).subscribe(qList => {
      this.qualifications[studentId] = qList;
    }, err => {
      console.error('Error refreshing qualifications:', err);
      this.showSnackBar('Failed to refresh qualifications.');
    });
  }

  openAddCourseDialog(studentId: string) {
    this.router.navigate(['/home/studentProfile/course', studentId], {
      queryParams: { from: 'view' }
    });
  }
  openAddQualificationDialog(studentId: string) {
    this.router.navigate(['/home/studentProfile/qualification', studentId], {
      queryParams: { from: 'view' }
    });
  }

  openAddExperienceDialog(studentId: string) {
    this.router.navigate(['/home/studentProfile/experience', studentId]);
  }

  openEditExperienceDialog(experience: experience) {
    const dialogRef = this.dialog.open(EditexperiencendialogComponent, {
      width: '500px',
      data: { ...experience }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.updateExperience(result.experienceId, result).subscribe({
          next: () => {
            this.showSnackBar('Experience updated successfully.');
            this.loadExperiences(experience.studentId);
          },
          error: (err) => {
            console.error('Error updating experience:', err);
            this.showSnackBar('Failed to update experience.');
          }
        });
      }
    });
  }

  openDeleteExperienceDialog(experienceId: string, studentId: string) {
    const dialogRef = this.dialog.open(DeleteconfirmdialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this experience record?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteExperience(experienceId).subscribe({
          next: () => {
            this.showSnackBar('Experience deleted successfully.');
            this.loadExperiences(studentId); // Refresh data after delete
          },
          error: (err) => {
            console.error('Error deleting experience:', err);
            this.showSnackBar('Failed to delete experience.');
          }
        });
      }
    });
  }

  openEditCourseDetailsDialog(courseDetail: courseDetails) {
    const studentId = courseDetail.studentProfileId;
    if (!studentId) {
      console.error('Student ID not found for course details:', courseDetail.courseDetailId);
      this.showSnackBar('Student ID not found.');
      return;
    }
    const dialogRef = this.dialog.open(EditcoursedetailsdialogComponent, {
      width: '500px',

      data: {
        ...courseDetail,
        courses: Object.entries(this.courses).map(([courseId, courseName]) => ({ courseId, courseName })),
        batches: Object.entries(this.batches).map(([batchId, batchName]) => ({ batchId, batchName }))
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Received updated course details:', result);
        this.studentService.updateCourseDetails(result.courseDetailId, result).subscribe({
          next: (response) => {
            console.log('Update response:', response);
            this.showSnackBar('Course details updated successfully.');
            this.loadCourseDetails(studentId); // Reload course details
            this.courseDetails = { ...this.courseDetails }; // Force UI refresh
          },
          error: (err) => {
            console.error('Error updating course details:', err);
            this.showSnackBar(`Failed to update course details: ${err.error?.message || err.message || 'Unknown error'}`);
          }
        });
      } else {
        console.log('Dialog closed without changes');
      }
    });
  }
  openDeleteCourseDetailsDialog(courseDetailId: string): void {
    const dialogRef = this.dialog.open(DeleteconfirmdialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this course detail?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteCourseDetails(courseDetailId).subscribe({
          next: () => {
            this.showSnackBar('Course detail deleted successfully.');
            Object.keys(this.courseDetails).forEach(studentId => {
              this.courseDetails[studentId] = this.courseDetails[studentId].filter(d => d.courseDetailId !== courseDetailId);
            });
            // Force UI refresh
            this.courseDetails = { ...this.courseDetails };
          },
          error: (err) => {
            console.error('Error deleting course detail:', err);
            this.errorMessages['general'] ??= [];
            this.errorMessages['general'].push('Failed to delete course detail.');
            this.showSnackBar('Failed to delete course detail.');
          }
        });
      }
    });
  }


  feesByCourse: { courseName: string, fees: any[] }[] = [];
  selectedCourse: string | null = null;  // keeps track of which course is active
  loadFeesByStudentId(studentId: string) {
  this.studentService.getFeesByStudentId(studentId).subscribe({
    next: (res) => {
      this.feesByCourse = this.groupFeesByCourse(res);
      console.log("Fees grouped:", this.feesByCourse);
    },
    error: (err) => console.error(err)
  });
}

private groupFeesByCourse(fees: any[]): { courseName: string, fees: any[] }[] {
  const grouped: { [key: string]: any[] } = {};

  fees.forEach(fee => {
    if (!grouped[fee.courseName]) {
      grouped[fee.courseName] = [];
    }
    grouped[fee.courseName].push(fee);
  });

  return Object.keys(grouped).map(course => ({
    courseName: course,
    fees: grouped[course]
  }));
}


getStatusTexts(status: number): string {
  switch (status) {
    case InstallmentStatus.Paid: return 'Paid';
    case InstallmentStatus.PartiallyPaid: return 'Partially Paid';
    case InstallmentStatus.Pending: return 'Pending';
    default: return 'Unknown';
  }
}

getStatusClass(status: number): string {
  switch (status) {
    case InstallmentStatus.Paid: return 'text-success';   // green
    case InstallmentStatus.PartiallyPaid: return 'text-warning'; // yellow
    case InstallmentStatus.Pending: return 'text-danger'; // red
    default: return '';
  }
}

  // getFeeStructureId(studentId: string): void {
  //   this.studentService.getFeeStructure().subscribe({
  //     next: (response: feeStructure[]) => {
  //       const feeStructure = response.find(f => f.studentId === studentId);
  //       if (feeStructure?.installmentId) {
  //         const feeStructureId = feeStructure.installmentId;
  //         this.feeStructureId = feeStructureId; // set local property
  //         console.log('Found FeeStructureId:', feeStructureId);
  //         // ✅ Now fetch fees
  //         this.getFees(feeStructureId);
  //       } else {
  //         console.warn(`No fee structure found for student ${studentId}`);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching fee structures:', err);
  //     }
  //   });
  // }

  // getFees(feeStructureId: string): void {

  //   this.studentService.getFeesByFeeStructureId(feeStructureId).subscribe({
  //     next: (fees) => {
  //       this.feesList = fees;
  //       console.log('Fetched fees:', this.feesList);
  //     },
  //     error: (err) => {
  //       console.error('Error fetching fees:', err);
  //       this.feesList = [];
  //     }
  //   });
  // }

  openEditFeePopup(studentId: string): void {

    this.studentService.getFeeStructure().subscribe({
      next: (response: feeStructure[]) => {
        const feeStructure = response.find(f => f.studentId === studentId);
     if (feeStructure?.installmentId) {
          const feeStructureId = feeStructure.installmentId;

          this.studentService.getFeesByFeeStructureId(feeStructureId).subscribe({
            next: (fees) => {
              this.dialog.open(EditfeedialogComponent, {
                width: '800px',
                data: {
                  feeStructure: feeStructure,
                  fees: fees


                }

              }).afterClosed().subscribe(result => {
                if (result) {
                  //this.getFees(feeStructureId); // Refresh fees list
                }
              });
            },
            error: (err) => {
              console.error('Error fetching fees:', err);
            }
          });
        } else {
          console.warn(`No valid fee structure found for student ${studentId}`);
        }
      },
      error: (err) => {
        console.error('Error fetching fee structure:', err);
      }
    });
  }
}
