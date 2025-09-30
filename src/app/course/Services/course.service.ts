import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Course } from '../Models/Course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

 private apiUrl=`${environment.baseurl}/courses`;


  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }
  getCourseById(id: any): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getCourseByName(name: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/GetCourseByName?name=${name}`);
  }
   addCourse(course: Course): Observable<any> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(id: any, course: Course): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, course);
  }
 deleteCourse(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  



}
 
  
   
  
  




