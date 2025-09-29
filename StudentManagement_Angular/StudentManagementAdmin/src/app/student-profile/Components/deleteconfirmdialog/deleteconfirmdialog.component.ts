import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-deleteconfirmdialog',
  templateUrl: './deleteconfirmdialog.component.html',
  styleUrls: ['./deleteconfirmdialog.component.css']
})
export class DeleteconfirmdialogComponent {
 constructor(public dialogRef: MatDialogRef<DeleteconfirmdialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { message: string }
 ) {}

   onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
