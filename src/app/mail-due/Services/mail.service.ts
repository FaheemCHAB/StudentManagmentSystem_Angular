import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private url=`${environment.baseurl}`
  constructor(private http:HttpClient) { }

  sendRemindersToList(emails: string[]): Observable<any> {
  return this.http.post(`${this.url}/reminders`, emails);
}
}
