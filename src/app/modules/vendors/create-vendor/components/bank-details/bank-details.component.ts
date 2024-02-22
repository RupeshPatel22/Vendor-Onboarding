import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { maxFileSizeAllowed } from 'src/app/shared/models/constants/vendor-registration-types';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {

  docType = [
    { id: 'image', name: 'Image' },
    { id: 'document', name: 'Document' }
  ];
  allowedFileExtn = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'odt', 'pdf'];
  // {
  //   'bankDoc': ['jpg','jpeg','png','doc','docx','odt','pdf'],
  //   'kycDoc': ['jpg','jpeg','png','doc','docx','odt','pdf']
  // };
  verifyIfscText = 'verify';
  buttonText = 'save & next';
  outletId: string;
  ifscVerified: boolean = false;
  allowedUploadFormat = '(.jpg, .jpeg, .png .doc, .docx, .odt, .pdf upto 20 MB only)';
  //  {
  //   'bankDoc': '(.jpg, .jpeg, .png .doc, .docx, .odt, .pdf upto 2 MB only)',
  //   'kycDoc': '(.jpg, .jpeg, .png .doc, .docx, .odt, .pdf upto 2 MB only)'
  // };
  intermediateFileName: string;
  docUploadFormControlName: string;
  @Input() disableAll: boolean;
  @Output() changeTab = new EventEmitter<string>();
  confirmationCheckbox: boolean;
  bankDetailsForm = new FormGroup({
    beneficiaryName: new FormControl('', [Validators.required]),
    accountNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{9,18}")]),
    ifscCode: new FormControl('', [Validators.required, Validators.pattern("[A-Z]{4}[A-Z0-9]{7}")]),
    // bankDocType: new FormControl(null, [Validators.required]),
    // kycDocType: new FormControl(null, [Validators.required]),
    bankDoc: new FormControl('', [Validators.required]),
    kycDoc: new FormControl('', [Validators.required]),
    bankDocUrl: new FormControl(),
    kycDocUrl: new FormControl()
  });

  constructor(private activeRoute: ActivatedRoute, private vendorService: VendorRegistrationService,
    private toastMsgService: ToastService) {
    this.outletId = this.activeRoute.snapshot.paramMap.get('outletId');
  }

  ngOnInit(): void {

    if (this.disableAll) {
      this.bankDetailsForm.disable();
      this.buttonText = 'next';
      this.confirmationCheckbox = true;
    }

    /**
     *   passing bank details form data to vendor service when whole form is valid
     *   by subscribing to valueChanges property
    */
    this.bankDetailsForm.valueChanges.pipe(filter(() => this.bankDetailsForm.status !== 'INVALID'))
      .subscribe(() => {
        const val = this.bankDetailsForm.getRawValue();
        for (const v in val) {
          this.vendorService.bankDetails[v] = val[v]
        }
      })
  }

  /**
   * Method that sets allowed file extns to upload file based on parameter passed
   * @param controlName
   * @param docType 
   */
  // uploadFileTypeChange(controlName: string, docType: string) {
  //   if (docType === 'image') {
  //     this.allowedFileExtn[controlName] = ['jpg','jpeg','png'];
  //     this.allowedUploadFormat[controlName] = '(.jpg, .jpeg, .png upto 2 MB only)';
  //   }
  //   if (docType === 'document') {
  //     this.allowedFileExtn[controlName] = ['doc','docx','odt','pdf'];
  //     this.allowedUploadFormat[controlName] = '(.doc, .docx, .odt, .pdf upto 2 MB only)';
  //   }
  // }

  /**
   * Method that checks whether user is uploading file with correct extn
   * and then gets url to upload the file with api call
   * @param file 
   */
  getFileUploadUrl(file: FileList, controlName: string) {
    const index = (file.item(0).name.lastIndexOf('.'))
    const fileExtn = file.item(0).name.substring(index + 1).toLowerCase();
    // if (!this.bankDetailsForm.get(`${controlName}Type`).valid) {
    //   this.toastMsgService.showWarning('Kindly select file type');
    //   return;
    // }
    if (!this.allowedFileExtn.includes(fileExtn)) return this.toastMsgService.showError('Kindly choose correct file');

    if (file.item(0).size > maxFileSizeAllowed) return this.toastMsgService.showError('Kindly check the size of the file');

    this.vendorService.getFileUploadUrl(fileExtn).subscribe(
      res => {
        this.docUploadFormControlName = controlName;
        this.intermediateFileName = res['result']['file_name'];
        this.fileUpload(res['result']['uploadUrl'], file);
      }
    );
  }

  /**
   * Method that upload file to aws-s3 bucket with api call
   * @param uploadUrl 
   * @param file 
   */
  fileUpload(uploadUrl, file) {
    this.vendorService.uploadFile(uploadUrl, file.item(0)).subscribe(
      res => {
        this.bankDetailsForm['controls'][this.docUploadFormControlName].setValue(this.intermediateFileName);
      }
    );
  }

  /**
   * Method that open uploaded file in new tab 
   * @param controlName 
   */
  viewFile(controlName) {
    window.open(this.bankDetailsForm.get(controlName).value)
  }

  /**
   * Method that detects value changes in ifsc code field after it is verified
   */
  ifscValueChanges() {
    if (this.ifscVerified) {
      this.verifyIfscText = 'verify';
      this.ifscVerified = false;
    }
  }

  /**
   * Method that calls verify ifsc code api from vendor registration service
   */
  verifyIFSC() {
    if (this.ifscVerified) return;
    if (!this.bankDetailsForm['controls']['ifscCode'].valid) {
      this.toastMsgService.showWarning('Kindly enter correct details and verify');
      return;
    }
    const data = {
      ifsc_code: this.bankDetailsForm['controls']['ifscCode']['value']
    }
    this.vendorService.verifyIFSC(this.outletId, data).subscribe(
      res => {
        // this.bankDetailsForm['controls']['ifscCode'].disable();
        this.verifyIfscText = 'verified';
        this.toastMsgService.showSuccess('IFSC Code Verified');
        this.ifscVerified = true;
      }
    );
  }

  /**
  * Method that checks validity of form and emits event
  * to go to next page
  */
  next() {
    if (this.disableAll) {
      this.changeTab.emit();
    }
    else if (this.bankDetailsForm.status === 'INVALID') {
      this.bankDetailsForm.markAllAsTouched();
      this.toastMsgService.showError(`Kindly fill up all the fields`);
    } 
    else if (!this.ifscVerified) {
      this.toastMsgService.showInfo('Kindly verify IFSC Code');
    } 
    else if (!this.confirmationCheckbox) {
      this.toastMsgService.showInfo('Kindly give confirmation to make your account primary')
    }
    else {
      const formData = this.vendorService.bankDetails.toJson();
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

}
