import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
import * as moment from 'moment';
import { maxFileSizeAllowed, Services } from 'src/app/shared/models/constants/vendor-registration-types';

@Component({
  selector: 'app-fssai-details',
  templateUrl: './fssai-details.component.html',
  styleUrls: ['./fssai-details.component.scss']
})
export class FssaiDetailsComponent implements OnInit {
  docType = [
    { id: 'image', name: 'Image' },
    { id: 'document', name: 'Document' }
  ];

  fssaiCertVerified: boolean = false;
  minDate: string = moment().subtract(1, 'week').format('YYYY-MM-DD');
  maxDate: string;

  // validateFSSAIText = 'validate fssai';
  buttonText = 'save & next';
  outletId: string;
  intermediateFileName: string;
  service: string;
  hasFssaiDetails: boolean = true;
  showHasFssaiDetailsField: boolean;
  @Input() disableAll: boolean;
  @Output() changeTab = new EventEmitter<string>();
  allowedFileExtn = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'odt', 'pdf'];
  allowedUploadFormat = '(.jpg, .jpeg, .png, .doc, .docx, .odt, .pdf upto 20 MB only)'
  fssaiDetailsForm = new FormGroup({
    hasFssaiCertificate: new FormControl(true, [Validators.required]),
    fssaiExpirationDate: new FormControl('', [Validators.required]),
    fssaiRegisterNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{14}")]),
    fssaiAcknowledgementNumber: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.pattern("[0-9]{17}")]),
    // fssaiLicenseType: new FormControl(null, [Validators.required]),
    fssaiDoc: new FormControl('', [Validators.required]),
    fssaiFirmName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]),
    fssaiAddress: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]),
    fssaiDocUrl: new FormControl()
  });

  constructor(private activeRoute: ActivatedRoute, private vendorService: VendorRegistrationService,
    private toastMsgService: ToastService) {
    this.outletId = this.activeRoute.snapshot.paramMap.get('outletId');
  }

  ngOnInit(): void {
    this.service = this.vendorService.service;
    if (this.disableAll) {
      this.fssaiDetailsForm.disable();
      this.buttonText = 'next';
    }
    /**
     *   passing fssai form data to vendor service when whole form is valid
     *   by subscribing to valueChanges property
    */
    this.fssaiDetailsForm.valueChanges.pipe(filter(() => this.fssaiDetailsForm.status !== 'INVALID'))
      .subscribe(() => {
        const val = this.fssaiDetailsForm.getRawValue();
        for (const v in val) {
          this.vendorService.fssaiDetails[v] = val[v]
        }
      })
  }

  /**
 * Method that sets allowed file extns to upload file based on parameter passed
 * @param docType 
 */
  // uploadFileTypeChange(docType: string) {
  //   if (docType === 'image') {
  //     this.allowedFileExtn = ['jpg','jpeg','png'];
  //     this.allowedUploadFormat = '(.jpg, .jpeg, .png upto 2 MB only)';
  //   }
  //   if (docType === 'document') {
  //     this.allowedFileExtn = ['doc','docx','odt','pdf'];
  //     this.allowedUploadFormat = '(.doc, .docx, .odt, .pdf upto 2 MB only)';
  //   }
  // }

  /**
   * Method that checks whether user is uploading file with correct extn
   * and then gets url to upload the file with api call
   * @param file 
   */
  getFileUploadUrl(file: FileList) {
    const index = (file.item(0).name.lastIndexOf('.'))
    const fileExtn = file.item(0).name.substring(index + 1).toLowerCase();
    // if (!this.fssaiDetailsForm.get('fssaiLicenseType').valid) {
    //   this.toastMsgService.showWarning('Kindly select file type');
    //   return;
    // }
    if (!this.allowedFileExtn.includes(fileExtn)) {
      this.toastMsgService.showError('Kindly choose correct file')
      return;
    }
    if (file.item(0).size > maxFileSizeAllowed) {
      this.toastMsgService.showError('Kindly check the size of the file');
      return;
    }
    this.vendorService.getFileUploadUrl(fileExtn).subscribe(
      res => {
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
        this.fssaiDetailsForm['controls']['fssaiDoc'].setValue(this.intermediateFileName);
      }
    );
  }

  /**
   * Method that open uploaded file in new tab 
   */
  viewFile() {
    window.open(this.fssaiDetailsForm.get('fssaiDocUrl').value)
  }
  /**
   * Method that calls validate FSSAI API from vendor registration service 
   */
  // validateFSSAI() {
  //   if (this.fssaiCertVerified) return;
  //   if (!this.fssaiDetailsForm['controls']['fssaiRegisterNumber'].valid) {
  //     this.toastMsgService.showWarning('Kindly enter correct details and verify');
  //     return;
  //   }
  //   this.vendorService.verifyFSSAI(this.outletId,this.fssaiDetailsForm['controls']['fssaiRegisterNumber']['value']).subscribe(
  //     data => {
  //       const res = data
  //       if (res) {
  //         // this.fssaiDetailsForm['controls']['fssaiRegisterNumber'].disable();
  //         this.fssaiDetailsForm['controls']['hasFssaiCertificate'].disable();
  //         this.validateFSSAIText = 'verified';
  //         this.toastMsgService.showSuccess('Verified');
  //         this.fssaiCertVerified = true;
  //       }
  //     }
  //   );
  // }

  /**
   * Method that detects value changes in fssai registered number field after it is verified
   */
  // fssaiValueChanges() {
  //   if (this.fssaiCertVerified) {
  //     this.validateFSSAIText = 'validate fssai';
  //     this.fssaiCertVerified = false;
  //   }
  // }

  /**
   * Method that shows fields based on radio btn checked
   */
  haveValidFssaiCertificate() {
    this.fssaiDetailsForm['controls']['fssaiDoc'].reset();
    this.fssaiDetailsForm['controls']['fssaiDocUrl'].reset();
    this.fssaiDetailsForm.controls['fssaiExpirationDate'].reset();

    if (this.fssaiDetailsForm.get('hasFssaiCertificate').value) {
      this.fssaiDetailsForm['controls']['fssaiRegisterNumber'].enable();
      this.fssaiDetailsForm['controls']['fssaiAcknowledgementNumber'].disable();
      this.maxDate = '';
      this.minDate = moment().format('YYYY-MM-DD');
    } else {
      this.fssaiDetailsForm['controls']['fssaiRegisterNumber'].disable();
      this.fssaiDetailsForm['controls']['fssaiAcknowledgementNumber'].enable();
      this.minDate = moment().subtract(1, 'week').format('YYYY-MM-DD');
      this.maxDate = moment().format('YYYY-MM-DD');
    }
  }

  /**
   * Method that invokes on click of radio btn for fssai details1
   * @param event 
   */
  haveFssaiDetails(event: boolean) {
    this.hasFssaiDetails = event;
    this.activeRoute.data.subscribe(data => {      
      if (this.hasFssaiDetails && data.kind !== 'view') {
        this.fssaiDetailsForm.enable();
        if (this.fssaiDetailsForm.get('hasFssaiCertificate').value) {
          this.fssaiDetailsForm['controls']['fssaiRegisterNumber'].enable();
          this.fssaiDetailsForm['controls']['fssaiAcknowledgementNumber'].disable();
          this.maxDate = '';
          this.minDate = moment().format('YYYY-MM-DD');
        } else {
          this.fssaiDetailsForm['controls']['fssaiRegisterNumber'].disable();
          this.fssaiDetailsForm['controls']['fssaiAcknowledgementNumber'].enable();
          this.minDate = moment().subtract(1, 'week').format('YYYY-MM-DD');
          this.maxDate = moment().format('YYYY-MM-DD');
        }
      } else {
        this.fssaiDetailsForm.disable();
      }
    });
  }

  /**
  * Method that checks validity of form and emits event
  * to go to next page
  */
  next() {
    if (this.disableAll) {
      this.changeTab.emit();
    }
    else if (this.fssaiDetailsForm.status === 'INVALID') {
      this.fssaiDetailsForm.markAllAsTouched();
      this.toastMsgService.showError(`Kindly fill up all the fields`);
    }
    else {
      const formData = this.vendorService.fssaiDetails.toJson();
      if (this.service === Services.Flower || this.service === Services.Paan || this.service === Services.Pet) {
        if (!this.hasFssaiDetails) {
          formData['fssai_has_certificate'] = null;
          for(const key in formData) {
            if (key !== 'draft_section' && key !== 'status' && key !== 'fssai_has_certificate')
            formData[key] = undefined;
          }
        }
      }
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

  get hasFssaiCertificate() {
    return this.fssaiDetailsForm.get('hasFssaiCertificate').value
  }
}
