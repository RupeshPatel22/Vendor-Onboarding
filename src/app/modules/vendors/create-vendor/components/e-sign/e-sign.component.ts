import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
import { CongratulationsDialogComponent } from '../congratulations-dialog/congratulations-dialog.component';
import { ReadMouDialogComponent } from '../read-mou-dialog/read-mou-dialog.component';
import { ViewGstDeclarationComponent } from '../view-gst-declaration/view-gst-declaration.component';

@Component({
  selector: 'app-e-sign',
  templateUrl: './e-sign.component.html',
  styleUrls: ['./e-sign.component.scss']
})
export class ESignComponent implements OnInit {

  @Input() disableAll: boolean;
  @Output() changeTab = new EventEmitter<string>();
  outletId: string;
  document
  generateOtpText = 'Send Otp';
  verifyOtpText = 'Verify Otp';
  buttonText = 'save & next';
  contactNumberVerified: boolean = false;
  canGenerateOtp: boolean = true;
  timeLeft: number = 30;
  interval: any;
  displayPartialContactNumber: string;
  hideGstDeclarationBtn: boolean;
  eSignForm = new FormGroup({
    readMou: new FormControl(false, Validators.required),
    contactNumber: new FormControl('', [Validators.required, Validators.pattern("[6-9][0-9]{9}")]),
    otp: new FormControl({disabled:true,value:''}, [Validators.required, Validators.pattern("[0-9]{5}")]),
  });

  constructor(private activeRoute: ActivatedRoute, private vendorService: VendorRegistrationService,
    private toastMsgService: ToastService, private dialog: MatDialog, private router: Router) {
    this.outletId = this.activeRoute.snapshot.paramMap.get('outletId');
  }

  ngOnInit(): void {

    if (this.disableAll) {
      this.eSignForm.disable();
      this.buttonText = 'next';
    }
    // this.getDocuments();

    /**
     *   passing e-sign form data to vendor service when whole form is valid
     *   by subscribing to valueChanges property
    */
    this.eSignForm.valueChanges.pipe(filter(() => this.eSignForm.status !== 'INVALID'))
      .subscribe(() => {
        const val = this.eSignForm.getRawValue();
        for (const v in val) {
          this.vendorService.eSignDetails[v] = val[v]
        }
      })

      this.vendorService.ownerContactNumber.subscribe(data => {
        if (data) {
          this.eSignForm.get('contactNumber').setValue(data);
          this.displayPartialMobile(data);
        }
      })
      this.vendorService.hasGST.subscribe(data => {
          this.hideGstDeclarationBtn = data;
      })
  }

  /**
   * here showing last 2 digits of phone number
   * @returns 
   */
   displayPartialMobile(phone: string) {
    this.displayPartialContactNumber = `${new Array(phone.length - 2 + 1).join('*')}${phone.slice(-2)}`;
  }

  /**
   * Method that calls documents API from vendor registration service
   */
  getDocuments(category: string) {
    this.vendorService.getDocuments(category).subscribe(res => {
        window.open(res['result']['doc_file']['url']);
      }
    )
  }

  /**
   * Method that calls send otp api for document signature 
   * contact number from vendor registration service
   */
  generateOtp() {
    if (this.contactNumberVerified) return;
    if (!this.eSignForm['controls']['contactNumber']['value'] || !this.eSignForm['controls']['contactNumber'].valid) {
      this.toastMsgService.showWarning('Kindly enter valid contact number');
      return;
    }
    const data = {
      phone: `+91${this.eSignForm['controls']['contactNumber']['value']}`
    }
    this.vendorService.docSignatureSendOtp(this.outletId, data).subscribe(
      res => {
        this.toastMsgService.showSuccess('OTP Sent Successfully');
        this.startTimer();
        this.eSignForm['controls']['otp'].enable();
      }
    );
  }

  /**
   * Method that calls verify otp api for document signature 
   * contact number from vendor registration service
   */
  verifyOtp() {
    const data = {
      phone: `+91${this.eSignForm['controls']['contactNumber']['value']}`,
      otp: this.eSignForm['controls']['otp']['value']
    }
    this.vendorService.docSignatureVerifyOtp(this.outletId, data).subscribe(
      res => {
        this.eSignForm['controls']['otp'].setValue('');
        this.eSignForm['controls']['otp'].disable();
        this.toastMsgService.showSuccess('Contact Number Verified');
        this.contactNumberVerified = true;
        this.stopTimer();
        this.generateOtpText = 'verified';
      }
    );
  }

  /**
 * Method that start timer of 30 secs to resend otp
 */
  startTimer() {
    this.canGenerateOtp = false;
    this.interval = setInterval(() => {
      this.timeLeft--;
      this.generateOtpText = `${this.timeLeft} secs left`
      if (this.timeLeft === 0) {
        this.generateOtpText = 'Resend OTP'
        this.stopTimer();
      }
    }, 1000)
  }

  /**
   * Method that stop timer for resend otp
   */
  stopTimer() {
    clearInterval(this.interval);
    this.timeLeft = 30;
    this.canGenerateOtp = true;
  }

  /**
 * Method that detects value changes in contact number field after it is verified
 */
  contactNumberValueChanges() {
    if (this.contactNumberVerified) {
      this.generateOtpText = 'Send Otp';
      this.contactNumberVerified = false;
      this.eSignForm['controls']['otp'].enable();
    }
  }

  /**
  * Method that checks validity of form and emits event
  * to go to next page
  */
  next() {
    if (this.disableAll) {
      this.changeTab.emit();
    }
    else if (this.eSignForm.status === 'INVALID') {
      this.eSignForm.markAllAsTouched();
      this.toastMsgService.showError(`Kindly fill up all the fields`);
    } 
    else if (!this.eSignForm.get('readMou').value) {
      this.toastMsgService.showInfo('Kindly read the LOU');
    } 
    else if (!this.contactNumberVerified) {
      this.toastMsgService.showInfo('Kindly verify OTP');
    } 
    else {
      const formData = this.vendorService.eSignDetails.toJson();
      this.vendorService.saveOutletDetails(this.outletId, formData).subscribe(res => {
        this.changeTab.emit();
      });
    }
  }

  /**
  * Method that emits event to go to previous page
  */
  previous() {
    this.changeTab.emit('back')
  }

  readMou() {
  const dialogRef = this.dialog.open(ReadMouDialogComponent, { data: 'MOU' });
    // const link = this.router.serializeUrl(this.router.createUrlTree(['/vendors/read-mou-dialog']));
  // this.router.navigate ([link]);
    // window.open(link);
    // // this.router.navigate([""])
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/vendors/read-mou-dialog']));
 
    //    window.open(url, '_blank');
    // // this.router.navigate(['/vendors/read-mou-dialog'], { skipLocationChange: true }).then(() => {
      // window.open('/vendors/read-mou-dialog', '_blank');
    // // });
    
    // const dialogRef = this.dialog.open(ReadMouDialogComponent, { data: 'LOU'});
  }

  viewGstDeclaration() {
    const dialogRef = this.dialog.open(ViewGstDeclarationComponent, { data: 'GST Declaration'});
  }

  /**
 * Method that Generates and opens a PDF file representing a Letter of Undertaking (LOU) for the given ID.
 * @param id - The unique identifier of the LOU for which to generate the PDF.
 */
  generateLouPdf(id: string) {
    this.vendorService.downloadLouPdf(id).subscribe(res => {
      const pdfUrl = res.result.file.url;  
      window.open(pdfUrl, '_blank');
    });
  }
  

}
