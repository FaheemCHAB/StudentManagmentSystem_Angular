import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../Models/feePayment';
import { FeemanagementService } from '../../Services/feemanagement.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { transactionMode } from '../../Models/feePayment';
@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.css']
})
export class TransactionTableComponent implements OnInit{

  transactions = new MatTableDataSource<any>();   // ✅ Use MatTableDataSource
  displayedColumns: string[] = ['studentName', 'date', 'amount', 'status', 'remark'];
  transactionMode=transactionMode

  constructor(private transactionService: FeemanagementService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (data: any[]) => {
        this.transactions.data = data;   // ✅ assign array to datasource
      },
      error: err => console.error(err)
    });
  }
}
