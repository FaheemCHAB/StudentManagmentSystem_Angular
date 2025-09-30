import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { fees } from '../Models/fees';
import { environment } from 'src/app/environment/environment';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private feeUrl = `${environment.baseurl}/fee`;
  constructor(private http: HttpClient) { }
  getFeesByCriteria(fromDate: Date, toDate: Date, status: number | null): Observable<any[]> {
    let params = new HttpParams()
      .set('startDate', fromDate.toISOString().split('T')[0])
      .set('endDate', toDate.toISOString().split('T')[0]);
    if (status !== null && status !== undefined) {
      params = params.set('status', status);
    }

    return this.http.get<any[]>(this.feeUrl,{params})
  }

}
