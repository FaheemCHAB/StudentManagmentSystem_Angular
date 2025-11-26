import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { trialStudent } from '../Models/trialStudent';

@Injectable({
  providedIn: 'root'
})
export class TrialStudentService {

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
  
  }
  

