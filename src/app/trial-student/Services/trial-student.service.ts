import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { trialStudent } from '../Models/trialStudent';
import { map, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrialStudentService {

  courseId!:string
  trialStudentId!:string
   constructor(private http:HttpClient) { }
  
  private getTrialStudentsUrl=`${environment.baseurl}/TrialStudents`;
  private addTrialStudentUrl = environment.baseurl+'/TrialStudent';
  private updateTrialStudentUrl= environment.baseurl+'/TrialStudent'
  private deleteTrialStudentUrl=environment.baseurl+'/TrialStudent';
  private getTrialStudentByIdUrl = environment.baseurl+'/TrialStudent';

   getTrialStudents():Observable<trialStudent[]>{
      return this.http.get<trialStudent[]>(this.getTrialStudentsUrl);
    }
  
   addTrialStudent(data:trialStudent):Observable<any>{
      return this.http.post(this.addTrialStudentUrl,data);
    }
  
getEnrolledStudents(): Observable<trialStudent[]> {
  return this.http.get<trialStudent[]>(`${environment.baseurl}/enrolled`);
}


    
     updateTrialStudent(id:any,data:trialStudent):Observable<any>{
      return this.http.put(`${this.updateTrialStudentUrl}/${id}`,data);
  
    }
  
   deleteTrialStudent(id:any):Observable<any>{
      return this.http.delete(`${this.deleteTrialStudentUrl}/${id}`);
    }
  
   getTrialStudentById(id:any):Observable<any>{
      return this.http.get(`${this.getTrialStudentByIdUrl}/${id}`)
    }

    payRegistrationFee(trialStudentId: string, amount: number): Observable<any> {
  return this.http.post<any>(
    `${environment.baseurl}/TrialStudent/payFee`,
    {
      trialStudentId: trialStudentId,
      fee: amount
    }
  );}

//   hasPaidRegistrationFee(trialStudentId: string): Observable<boolean> {
//   return this.http.get<boolean>(`${environment.baseurl}/registrationFee/${trialStudentId}`);
// }
hasPaidRegistrationFee(trialStudentId: string): Observable<boolean> {
  return this.http
    .get<any>(`${environment.baseurl}/TrialStudent/fee/${trialStudentId}`)
    .pipe(
      map(feeDto => {
        // If no fee record → not paid
        if (!feeDto) return false;

        // Some serializers capitalize property names
        const status = feeDto.feeStatus ?? feeDto.FeeStatus;

        // Only numeric check (0 = Paid)
        if (typeof status === 'number') {
          return status === 0; // Paid
        }

        return false;
      }),
      catchError(err => {
        if (err.status === 404) return of(false); // no record → not paid
        return throwError(() => err); // other errors
      })
    );
}

getRegFeeByTrialId(trialStudentId:string):Observable<any>{
  return this.http.get(`${environment.baseurl}/RegistrationFee/${trialStudentId}`)
}
  
  }
  

