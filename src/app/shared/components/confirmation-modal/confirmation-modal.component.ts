import { Component, OnInit, ViewChild, Output, EventEmitter, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  title: string
  message: string;
  alert: boolean;
  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.title = data.title;
      this.message = data.message;
      this.alert = data.alert;
      dialogRef.disableClose = true;
    }

  ngOnInit(): void {
  }

  /**
   * Method that gets invokes on 'yes' button click
   */
  onConfirm() {
    this.dialogRef.close(true);
  }

  /**
   * Method that gets invokes on 'no' button click
   */
  onDismiss() {
    this.dialogRef.close(false);
  }

}
