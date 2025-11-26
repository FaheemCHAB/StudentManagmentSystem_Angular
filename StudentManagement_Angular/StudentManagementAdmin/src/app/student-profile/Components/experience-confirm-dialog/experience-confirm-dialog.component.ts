import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-experience-confirm-dialog',
  templateUrl: './experience-confirm-dialog.component.html',
  styleUrls: ['./experience-confirm-dialog.component.css']
})
export class ExperienceConfirmDialogComponent {

  constructor(public dialogRef: MatDialogRef<ExperienceConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onYes(): void {
    this.dialogRef.close(true);
  }

  onNo(): void {
    this.dialogRef.close(false);
  }
}