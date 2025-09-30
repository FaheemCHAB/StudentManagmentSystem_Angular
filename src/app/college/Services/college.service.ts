import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { college } from '../Models/college';

@Injectable({
  providedIn: 'root'
})
export class CollegeService {

  constructor(private http:HttpClient) { }

private getCollegesUrl=`${environment.baseurl}/colleges`;
private addCollegeUrl = environment.baseurl+'/colleges';
private updateCollegeUrl= environment.baseurl+'/college'
private deleteCollegeUrl=environment.baseurl+'/college';
private getCollegeByIdUrl = environment.baseurl +'/college';

 getColleges():Observable<college[]>{
    return this.http.get<college[]>(this.getCollegesUrl);
  }

  addCollege(data:college):Observable<any>{
    return this.http.post(this.addCollegeUrl,data);
  }

  updateCollege(id:any,data:college):Observable<any>{
    return this.http.put(`${this.updateCollegeUrl}/${id}`,data);

  }

  deleteCollege(id:any):Observable<any>{
    return this.http.delete(`${this.deleteCollegeUrl}/${id}`);
  }

  getCollegeById(id:any):Observable<any>{
    return this.http.get(`${this.getCollegeByIdUrl}/${id}`)
  }

}
