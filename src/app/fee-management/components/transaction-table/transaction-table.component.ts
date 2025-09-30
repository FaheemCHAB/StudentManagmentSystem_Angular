import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../Models/feePayment';
import { FeemanagementService } from '../../Services/feemanagement.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { transactionMode } from '../../Models/feePayment';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.css']
})
export class TransactionTableComponent implements OnInit {

  transactions = new MatTableDataSource<any>();   // ✅ Use MatTableDataSource
  displayedColumns: string[] = ['studentName', 'date', 'amount', 'status', 'remark'];
  transactionMode = transactionMode
  searchForm!: FormGroup;
  constructor(private transactionService: FeemanagementService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      mode: [null]  // 👈 Debit / Credit
    });

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

  onSearch() {
    let { fromDate, toDate, mode } = this.searchForm.value;

    let filtered = this.transactions.data;

    // Filter by From/To Date
    if (fromDate) {
      filtered = filtered.filter(tx =>
        new Date(tx.transactionDate) >= new Date(fromDate)
      );
    }
    if (toDate) {
      filtered = filtered.filter(tx =>
        new Date(tx.transactionDate) <= new Date(toDate)
      );
    }

    // Filter by Transaction Mode
    if (mode !== null) {
      filtered = filtered.filter(tx => tx.status === mode);
    }

    this.transactions.data = filtered;
  }

  resetSearch() {
  this.searchForm.reset();
  this.loadTransactions(); // reload all data
}
}
