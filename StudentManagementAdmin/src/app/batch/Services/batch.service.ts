import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environment/environment';
import { Observable } from 'rxjs';
import { batch } from '../Models/batch';
@Injectable({
  providedIn: 'root'
})
export class BatchService {

  constructor(private http:HttpClient) { }
 private getapiUrl=environment.baseurl+'/batches';
private addapiUrl = environment.baseurl+'/batches';
private updateapiUrl= environment.baseurl+'/batches';
private deleteapiUrl=environment.baseurl+'/batches';
private getByIdapiUrl = environment.baseurl + '/batch';

getBatches():Observable<batch[]>{
    return this.http.get<batch[]>(this.getapiUrl);
  }

  addBatch(data:batch):Observable<any>{
    return this.http.post(this.addapiUrl,data);
  }

  updateBatch(id:any,data:batch):Observable<any>{
    return this.http.put(`${this.updateapiUrl}/${id}`,data);

  }

  deleteBatch(id:any):Observable<any>{
    return this.http.delete(`${this.deleteapiUrl}/${id}`);
  }

  getBatchById(id:any):Observable<any>{
    return this.http.get(`${this.getByIdapiUrl}/${id}`)
  }

}
