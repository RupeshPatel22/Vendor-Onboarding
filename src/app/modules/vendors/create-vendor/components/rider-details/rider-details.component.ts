import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { RiderStatus } from 'src/app/shared/models/constants/vendor-registration-types';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';

@Component({
  selector: 'app-rider-details',
  templateUrl: './rider-details.component.html',
  styleUrls: ['./rider-details.component.scss']
})
export class RiderDetailsComponent implements OnInit {

  @Input() disableAll: boolean;
  buttonText: string = 'save & next';
  riderId: string;
  currentRiderStatus: RiderStatus;

  riderDetailsForm = new FormGroup({
    riderName: new FormControl('', [Validators.required]),
    riderType: new FormControl('', [Validators.required]),
    riderContact: new FormControl('', [Validators.required]),
    riderDob: new FormControl('', [Validators.required]),
    riderPhotoDoc: new FormControl('', [Validators.required]),
    riderPhotoUrl: new FormControl('', [Validators.required]),
    panDoc: new FormControl('', [Validators.required]),
    panDocUrl: new FormControl('', [Validators.required]),
    aadharFrontDoc: new FormControl('', [Validators.required]),
    aadharFrontUrl: new FormControl('', [Validators.required]),
    aadharBackDoc: new FormControl('', [Validators.required]),
    aadharBackUrl: new FormControl('', [Validators.required]),
    drivingLicenseDoc: new FormControl('', [Validators.required]),
    drivingLicenseUrl: new FormControl('', [Validators.required]),
    cancelledChequeDoc: new FormControl('', [Validators.required]),
    cancelledChequeUrl: new FormControl('', [Validators.required]),
    accountNumber: new FormControl('', [Validators.required]),
    ifscCode: new FormControl('', [Validators.required]),
  })
  constructor(private activeRoute: ActivatedRoute, private vendorService: VendorRegistrationService,
    private toastMsgService: ToastService, private dialog: MatDialog) {
    this.riderId = this.activeRoute.snapshot.paramMap.get('outletId');
  }

  ngOnInit(): void {
    if (this.disableAll) {
      this.riderDetailsForm.disable();
      this.buttonText = 'next';
    }
  }


  getFileUploadUrl(file: FileList, controlName: string) { }

  /**
   * Method that opens file in new tab
   * @param controlName 
   */
  viewFile(controlName: string) {
    window.open(this.riderDetailsForm.get(controlName).value)
  }

  /**
 * Method that navigates to home page
 */
  goToHome() {
    window.history.back();
  }

  approveRiderDetails() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data:
      {
        title: 'Are you sure?',
        message: 'You have approved the request. Do you still want to continue?'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.vendorService.approveRider(this.riderId).subscribe(res => {
          window.history.back();
        })
      }
    })
  }

  rejectRiderDetails() {
    if (!this.vendorService.remarks) {
      this.toastMsgService.showWarning('Kindly add remarks');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data:
      {
        title: 'Are you sure?',
        message: 'You have rejected the request. Do you still want to continue?'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.vendorService.rejectRider(this.riderId).subscribe(res => {
          window.history.back();
        })
      }
    })
  }
}
