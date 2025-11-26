import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Transaction } from '../Models/feePayment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FeemanagementService {

  constructor(private http:HttpClient) { }

  private feePaymentUrl=`${environment.baseurl}/feePayment`
 private returnfeeUrl=`${environment.baseurl}/returnFee`
 private transactionUrl=`${environment.baseurl}/transactions`
  addFeeRecieved(data:any):Observable<any>{
    return this.http.post(this.feePaymentUrl,data)
  }

  getFeeRecievedById(id:string):Observable<any>{
    return this.http.get(`${this.feePaymentUrl}/$id`)
  }

  addReturnFee(data:any):Observable<any>{
    return this.http.post(this.returnfeeUrl,data)
  }

  addTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
        return this.http.post<Transaction>(this.feePaymentUrl, transaction);
    }

  getTransactions(): Observable<Transaction[]> {
  return this.http.get<{ transaction: Transaction[] }>(this.transactionUrl)
    .pipe(map(response => response.transaction));
  }
}
