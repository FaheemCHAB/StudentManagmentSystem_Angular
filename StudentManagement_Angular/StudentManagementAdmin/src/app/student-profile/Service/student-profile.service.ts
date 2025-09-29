import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { studentProfile } from '../Models/ProfileModels';
import { environment } from 'src/app/environment/environment';
import { qualifications } from '../Models/ProfileModels';
import { experience } from '../Models/ProfileModels';
import { feeStructure } from '../Models/ProfileModels';
import { courseDetails } from '../Models/ProfileModels';
import { fee } from '../Models/ProfileModels';



@Injectable({
  providedIn: 'root'
})
export class StudentProfileService {
  enrollmentType: string = '';
  private studentData = new BehaviorSubject<any>({});
  currentStudentData = this.studentData.asObservable();

  studentId: string = '';
  courseDetailId: string = '';
  trialStudentId: string = '';
  constructor(private http: HttpClient) { }

  private studentProfileUrl = `${environment.baseurl}/studentprofile`;
  private qualificationUrl = `${environment.baseurl}/qualifications`;
  private experienceUrl = `${environment.baseurl}/experiences`;
  private feeStructureUrl = `${environment.baseurl}/feeStructure`;
  private courseDetailUrl = `${environment.baseurl}/courseDetails`;
  private feeUrl = `${environment.baseurl}/fee`;
  private feesUrl = `${environment.baseurl}/fees`;
  private feeByUrl = `${environment.baseurl}`;
  private updateFeesUrl=`${environment.baseurl}/feeList`;

  updateStudentData(data: any) {
    const currentData = this.studentData.getValue();
    this.studentData.next({ ...currentData, ...data });
  }

  getStudentData() {
    return this.studentData.getValue();
  }

  getStudentProfile(): Observable<studentProfile[]> {
    return this.http.get<studentProfile[]>(this.studentProfileUrl);
  }

  addStudentProfile(data: any): Observable<{ studentId: string }> {
    return this.http.post<{ studentId: string }>(this.studentProfileUrl, data);
  }

  updateStudentProfile(id: any, data: studentProfile): Observable<any> {
    return this.http.put(`${this.studentProfileUrl}/${id}`, data);

  }

  deleteStudentProfile(id: any): Observable<any> {
    return this.http.delete(`${this.studentProfileUrl}/${id}`);
  }

  getStudentProfileById(id: any): Observable<any> {
    return this.http.get(`${this.studentProfileUrl}/${id}`)
  }

  getQualification(): Observable<qualifications[]> {
    return this.http.get<qualifications[]>(this.qualificationUrl);
  }

  addQualification(data: qualifications): Observable<any> {
    return this.http.post(this.qualificationUrl, data);
  }

  updateQualification(id: any, data: qualifications): Observable<any> {
    return this.http.put(`${this.qualificationUrl}/${id}`, data);

  }

  deleteQualification(id: any): Observable<any> {
    return this.http.delete(`${this.qualificationUrl}/${id}`);
  }

  getQualificationById(id: any): Observable<any> {
    return this.http.get(`${this.qualificationUrl}/${id}`)
  }
  getQualificationsByStudentId(studentId: string): Observable<qualifications[]> {
    return this.http.get<qualifications[]>(`${this.qualificationUrl}/byStudentId?studentId=${studentId}`,
        {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }
    );
  }



  getExperience(): Observable<experience[]> {
    return this.http.get<experience[]>(this.experienceUrl);
  }

  addExperience(data: experience): Observable<any> {
    return this.http.post(this.experienceUrl, data);
  }

  updateExperience(id: any, data: experience): Observable<any> {
    return this.http.put(`${this.experienceUrl}/${id}`, data);

  }

  deleteExperience(id: any): Observable<any> {
    return this.http.delete(`${this.experienceUrl}/${id}`);
  }

  getExperienceById(id: any): Observable<any> {
    return this.http.get(`${this.experienceUrl}/${id}`)
  }
  getExperiencesByStudentId(studentId: string): Observable<experience[]> {
    return this.http.get<experience[]>(`${this.experienceUrl}/byStudentId?studentId=${studentId}`);
  }




  getFeeStructure(): Observable<feeStructure[]> {
    return this.http.get<feeStructure[]>(this.feeStructureUrl);
  }

  addFeeStructure(data: feeStructure): Observable<any> {
    return this.http.post(this.feeStructureUrl, data);
  }

  updateFeeStructure(id: any, data: feeStructure): Observable<any> {
    return this.http.put(`${this.feeStructureUrl}/${id}`, data);

  }

  deleteFeeStructure(id: any): Observable<any> {
    return this.http.delete(`${this.feeStructureUrl}/${id}`);
  }

  getFeeStructureById(id: any): Observable<any> {
    return this.http.get(`${this.feeStructureUrl}/${id}`)
  }
  getFeeStructuresByStudentId(studentId: string): Observable<feeStructure[]> {
    return this.http.get<feeStructure[]>(`${environment.baseurl}/byStudentId?studentId=${studentId}`);
  }

  getFeesByStudentId(studentId: string): Observable<any[]> {
  return this.http.get<any[]>(`${environment.baseurl}/GetFeesByStudentId/${studentId}`);
}

  getCourseDetails(): Observable<courseDetails[]> {
    return this.http.get<courseDetails[]>(this.courseDetailUrl);
  }

  addCourseDetails(data: courseDetails): Observable<any> {
    return this.http.post(this.courseDetailUrl, data);
  }

  updateCourseDetails(id: any, data: courseDetails): Observable<any> {
    return this.http.put(`${this.courseDetailUrl}/${id}`, data);

  }

  
  deleteCourseDetails(id: any): Observable<any> {
    return this.http.delete(`${this.courseDetailUrl}/${id}`);
  }

  getCourseDetailsById(id: any): Observable<any> {
    return this.http.get(`${this.courseDetailUrl}/${id}`)
  }
  getCourseDetailsByStudentId(studentId: string): Observable<courseDetails[]> {
    return this.http.get<courseDetails[]>(`${this.courseDetailUrl}/byStudentProfileId?studentProfileId=${studentId}`);
  }



  getFee(): Observable<any[]> {
    return this.http.get<fee[]>(this.feeUrl);
  }

  addFees(data: fee[]): Observable<any> {
    return this.http.post(this.feeUrl, data);
  }

  updateFee(id: any, data: fee): Observable<any> {
    return this.http.put(`${this.feeUrl}/${id}`, data);

  }

  deleteFee(id: any): Observable<any> {
    return this.http.delete(`${this.feeUrl}/${id}`);
  }

  getFeeById(id: any): Observable<any> {
    return this.http.get(`${this.feeUrl}/${id}`)
  }
  getFeesByFeeStructureId(feeStructureId: any): Observable<fee[]> {
    return this.http.get<fee[]>(`${this.feeByUrl}/feeStructure/${feeStructureId}/Fees`);
  }


  getAllFees(): Observable<any> {
    return this.http.get(this.feesUrl);
  }

  getTodayPendingFees(): Observable<any> {
    return this.http.get<any>(`${this.feeUrl}/date`);
  }

  updateFeeByFeeStructureId(id:any,data:any[]):Observable<any>{
    return this.http.put(`${this.updateFeesUrl}/${id}`,data);
  }

  updateFeeByFeeStructureIdAllocation(id:any,data:any[]):Observable<any>{
    return this.http.put(`${this.updateFeesUrl}/${id}/allocation`,data)
  }

submitInstallments(feeStructureId: string, data: any[]) {
  return this.http.post(`/api/fees/submit/${feeStructureId}`, data);
}

}


