import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-congratulations-dialog',
  templateUrl: './congratulations-dialog.component.html',
  styleUrls: ['./congratulations-dialog.component.scss']
})
export class CongratulationsDialogComponent implements OnInit {

  status: string;
  constructor(public dialogRef: MatDialogRef<CongratulationsDialogComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.status = data;
      dialogRef.disableClose = true;
    }

  ngOnInit(): void {
  }

  /**
   * Method that navigates to vendors page and close the dialog
   */
  dismiss() {
    window.history.back();
    this.dialogRef.close();
  }

}
