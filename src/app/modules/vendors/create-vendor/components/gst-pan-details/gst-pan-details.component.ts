import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
import { Services, gstCategoryList, maxFileSizeAllowed } from 'src/app/shared/models/constants/vendor-registration-types';

@Component({
  selector: 'app-gst-pan-details',
  templateUrl: './gst-pan-details.component.html',
  styleUrls: ['./gst-pan-details.component.scss']
})
export class GstPanDetailsComponent implements OnInit {

  docType = [
    { id: 'image', name: 'Image' },
    { id: 'document', name: 'Document' }
  ];
  gstCategoryList: any[];

  showGSTFields: boolean = true;
  panVerified: boolean = false;
  gstVerified: boolean = false;
  // verifyPanText = 'verify';
  // verifyGstText = 'verify';
  buttonText = 'save & next';
  outletId: string;
  allowedFileExtn = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'odt', 'pdf'];
  allowedUploadFormat = '(.jpg, .jpeg, .png .doc, .docx, .odt, .pdf upto 20 MB only)';
  intermediateFileName: string
  docUploadFormControlName: string;
  showGstCategoryField: boolean = true;
  @Input() disableAll: boolean;
  @Output() changeTab = new EventEmitter<string>();
  service: string;
  readonly services = Services;
  showRegFields: boolean;

  gstPanDetailsForm = new FormGroup({
    gstCategory: new FormControl(null, [Validators.required]),
    pan: new FormControl('', [Validators.required, Validators.pattern("([A-Z]){5}([0-9]){4}([A-Z]){1}")]),
    panOwnerName: new FormControl('', [Validators.required]),
    // panDocType: new FormControl(null, [Validators.required]),
    panDoc: new FormControl('', [Validators.required]),
    hasGST: new FormControl(true, [Validators.required]),
    gstNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}")]),
    // gstDocType: new FormControl(null, [Validators.required]),
    gstDoc: new FormControl('', [Validators.required]),
    businessEntityName: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.pattern("[A-Za-z0-9'-. ]*"), Validators.minLength(5), Validators.maxLength(250)]),
    businessEntityAddress: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.pattern("[0-9a-zA-Z,-.'/ ]*"), Validators.minLength(5), Validators.maxLength(250)]),
    panDocUrl: new FormControl(),
    gstDocUrl: new FormControl(),
    hasRegistration: new FormControl(),
    registrationNumber: new FormControl('', [Validators.required]),
    registrationDocument: new FormControl('', [Validators.required]),
    registrationDocUrl: new FormControl()
  });

  constructor(private activeRoute: ActivatedRoute, private vendorService: VendorRegistrationService,
    private toastMsgService: ToastService) {
    this.outletId = this.activeRoute.snapshot.paramMap.get('outletId');
    this.service = this.activeRoute.snapshot.queryParams['service'];

  }

  ngOnInit(): void {

    if (this.disableAll) {
      this.gstPanDetailsForm.disable();
      this.buttonText = 'next';
    }
    /**
     *   passing gst/pan details form data to vendor service when whole form is valid
     *   by subscribing to valueChanges property
    */
    this.gstPanDetailsForm.valueChanges.pipe(filter(() => this.gstPanDetailsForm.status !== 'INVALID'))
      .subscribe(() => {
        const val = this.gstPanDetailsForm.getRawValue();
        for (const v in val) {
          this.vendorService.gstPanDetails[v] = val[v]
        }
        this.vendorService.hasGST.next(val['hasGST']);
      })
    this.gstCategoryList = Object.values(gstCategoryList[this.vendorService.service])
  }

  /**
* Method that sets allowed file extns to upload file based on parameter passed
* @param docType
* @param controlName 
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
    // if (!this.gstPanDetailsForm.get(`${controlName}Type`).valid) {
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
        this.gstPanDetailsForm['controls'][this.docUploadFormControlName].setValue(this.intermediateFileName);
      }
    );
  }

  /**
   * Method that open uploaded file in new tab 
   * @param controlName 
   */
  viewFile(controlName) {
    window.open(this.gstPanDetailsForm.get(controlName).value)
  }

  /**
   * Method that detects value changes in pan field after it is verified
   */
  // panValueChanges() {
  //   if (this.panVerified) {
  //     this.verifyPanText = 'verify';
  //     this.panVerified = false;
  //   }
  // }

  /**
   * Method that detects value changes in gst number field after it is verified
   */
  // gstValueChanges() {
  //   if (this.gstVerified) {
  //     this.verifyGstText = 'verify';
  //     this.gstVerified = false;
  //   }
  // }

  /**
   * Method that calls verify PAN API from vendor registration service
   */
  // verifyPAN() {
  //   if (this.panVerified) return;
  //   if (!this.gstPanDetailsForm['controls']['pan'].valid) {
  //     this.toastMsgService.showWarning('Kindly enter correct details and verify');
  //     return;
  //   }
  //   this.vendorService.verifyPAN(this.outletId,this.gstPanDetailsForm['controls']['pan']['value']).subscribe(
  //     data => {
  //       const res = data;
  //       if (res) {
  //         // this.gstPanDetailsForm['controls']['pan'].disable();
  //         this.verifyPanText = 'verified';
  //         this.toastMsgService.showSuccess('PAN Verified');
  //         this.panVerified = true;
  //       }
  //     }
  //   );
  // }

  /**
  * Method that calls verify GST API from vendor registration service
  */
  // verifyGST() {
  //   if (this.gstVerified) return;
  //   if (!this.gstPanDetailsForm['controls']['gstNumber'].valid) {
  //     this.toastMsgService.showWarning('Kindly enter correct details and verify');
  //     return;
  //   }
  //   this.vendorService.verifyGST(this.outletId,this.gstPanDetailsForm['controls']['gstNumber']['value']).subscribe(
  //     data => {
  //       const res = data;
  //       if (res) {
  //         // this.gstPanDetailsForm['controls']['gstNumber'].disable();
  //         this.verifyGstText = 'verified';
  //         this.toastMsgService.showSuccess('GSTIN Verified');
  //         this.gstVerified = true;
  //         this.gstPanDetailsForm['controls']['hasGST'].disable();
  //       }
  //     }
  //   );
  // }

  /**
   * Method that shows fields based on radio btn checked
   */
  haveGST() {
    if (this.gstPanDetailsForm.get('hasGST').value) {
      this.showGSTFields = true;
      this.gstPanDetailsForm['controls']['gstNumber'].enable();
      // this.gstPanDetailsForm['controls']['gstDocType'].enable();
      this.gstPanDetailsForm['controls']['gstDoc'].enable();
      this.gstPanDetailsForm['controls']['businessEntityName'].disable();
      this.gstPanDetailsForm['controls']['businessEntityAddress'].disable();
    } else {
      this.showGSTFields = false;
      this.gstPanDetailsForm['controls']['gstNumber'].disable();
      // this.gstPanDetailsForm['controls']['gstDocType'].disable();
      this.gstPanDetailsForm['controls']['gstDoc'].disable();
      this.gstPanDetailsForm['controls']['businessEntityName'].enable();
      this.gstPanDetailsForm['controls']['businessEntityAddress'].enable();
    }
  }

  /**
   * Mewthod that gets invovked when user selects yes or no fir registration number
   */
  haveReg(){
    if (this.gstPanDetailsForm.get('hasRegistration').value) {
      this.showRegFields = true;
      this.gstPanDetailsForm['controls']['registrationNumber'].enable();
      this.gstPanDetailsForm['controls']['registrationDocument'].enable();
    } else {
      this.showRegFields = false;
      this.gstPanDetailsForm['controls']['registrationNumber'].disable();
      this.gstPanDetailsForm['controls']['registrationDocument'].disable();
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
    else if (this.gstPanDetailsForm.status === 'INVALID') {
      this.gstPanDetailsForm.markAllAsTouched();
      this.toastMsgService.showError(`Kindly fill up all the fields`);
    }
    else {
      const formData = this.vendorService.gstPanDetails.toJson();
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
