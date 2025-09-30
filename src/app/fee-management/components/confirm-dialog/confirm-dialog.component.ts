import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirmation</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNo()">No</button>
      <button mat-raised-button color="primary" (click)="onYes()">Yes</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

   constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onYes() {
    this.dialogRef.close(true);
  }
  onNo() {
    this.dialogRef.close(false);
  }

}
