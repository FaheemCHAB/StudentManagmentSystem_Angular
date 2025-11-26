import { Injectable } from '@angular/core';
import { qualification } from '../Models/qualification';
import { environment } from 'src/app/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QualificationService {
   private apiUrl=`${environment.baseurl}/qualification`;

  constructor(private http: HttpClient) { }

   getAllQualifications(): Observable<qualification[]> {
      return this.http.get<qualification[]>(this.apiUrl);
    }
    getQualificationById(id: any): Observable<qualification> {
      return this.http.get<qualification>(`${this.apiUrl}/${id}`);
    }
  
    getQualificationName(name: string): Observable<qualification[]> {
      return this.http.get<qualification[]>(`${this.apiUrl}/GetCourseByName?name=${name}`);
    }
     addQualification(qualification: qualification): Observable<any> {
      return this.http.post<qualification>(this.apiUrl, qualification);
    }
  
    updateQualification(id: any, qualification: qualification): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, qualification);
    }
   deleteQualification(id: any): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
  
}
