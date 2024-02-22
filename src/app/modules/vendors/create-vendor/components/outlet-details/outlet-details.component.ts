import { FocusMonitor } from '@angular/cdk/a11y';
import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, FormArrayName } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { Area, City, Language, Services, maxFileSizeAllowed, outletTypesList } from 'src/app/shared/models/constants/vendor-registration-types';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';

@Component({
  selector: 'app-outlet-details',
  templateUrl: './outlet-details.component.html',
  styleUrls: ['./outlet-details.component.scss']
})
export class OutletDetailsComponent implements OnInit {

  city: City[] = [];
  area: Area[] = [];
  language: Language[] = []
  showWhatsAppNumberField: boolean = false;
  showBrandIdField: boolean = false;
  // contactNumberVerified: boolean = false;
  outletId: string;
  sendOtpText = 'Send Otp';
  verifyOtpText = 'Verify Otp';
  buttonText = 'save & next';
  intermediateFileName: string;
  canSendOtp: boolean = true;
  timeLeft: number = 30;
  interval: any;
  allowedFileExtn = ['jpg', 'jpeg', 'png'];
  uploadMoreImages: boolean = true;
  haveBranchName: boolean = true;
  readonly outletTypesList = outletTypesList;
  readonly Services = Services;
  service: string;
  originalOrder = (a: KeyValue<string, string>, b: KeyValue<string, string>): number => {
    return 0;
  }
  @Input() disableAll: boolean;
  @Output() changeTab = new EventEmitter<any>();
  docUploadFormControlName: string;
  allowedUploadFormat = '(.jpg, .jpeg, .png, .doc, .docx, .odt, .pdf upto 20 MB only)'


  outletDetailsForm = new FormGroup({
    outletName: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    city: new FormControl(null, [Validators.required]),
    area: new FormControl(null, [Validators.required]),
    hasBranchName: new FormControl(true, [Validators.required]),
    branchName: new FormControl('', [Validators.required]),
    // contactNumber: new FormControl('', [Validators.required, Validators.pattern("[6-9][0-9]{9}")]),
    // otp: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.pattern("[0-9]{5}")]),
    preferredLang: new FormControl({ disabled: true, value: null }, [Validators.required]),
    alreadyRegisteredWithUs: new FormControl(false, [Validators.required]),
    brandId: new FormControl({ disabled: true, value: '' }, [Validators.required]),
    // receiveWhatsAppNotification: new FormControl(false, [Validators.required]),
    // whatsAppNumber: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.pattern("[6-9][0-9]{9}")]),
    // sameAsContactNumber: new FormControl(),
    outletDoc: new FormControl('', [Validators.required]),
    outletDocUrl: new FormControl(),
    outletImageRows: this.formBuilder.array([]),
    outletType: new FormControl('', [Validators.required]),
    drugLicenseNumber: new FormControl('',[Validators.required]),
    drugRetailDoc: new FormControl('', [Validators.required]),
    drugRetailDocUrl: new FormControl(),
    drugWholesaleDoc: new FormControl('', [Validators.required]),
    drugWholesaleDocUrl: new FormControl(),
  })

  constructor(private activeRoute: ActivatedRoute, private vendorService: VendorRegistrationService,
    private toastMsgService: ToastService, private formBuilder: FormBuilder) {
    this.outletId = this.activeRoute.snapshot.paramMap.get('outletId');
  }

  ngOnInit(): void {
    if (this.disableAll) {
      this.outletDetailsForm.disable();
      this.buttonText = 'next';
    }
    this.setCityList();
    // this.setLanguageList();

    /**
   *   passing restaurat form data to vendor service when whole form is valid
   *   by subscribing to valueChanges property
  */
    this.outletDetailsForm.valueChanges.pipe(filter(() => this.outletDetailsForm.status !== 'INVALID'))
      .subscribe(() => {
        const val = this.outletDetailsForm.getRawValue();
        for (const v in val) {
          this.vendorService.outletDetails[v] = val[v]
        }
      })
      this.service = this.vendorService.service;
      if(this.service !== Services.Pharmacy){
        this.outletDetailsForm.get('drugLicenseNumber').disable();
        this.outletDetailsForm.get('drugRetailDoc').disable();
        this.outletDetailsForm.get('drugRetailDocUrl').disable();
        this.outletDetailsForm.get('drugWholesaleDoc').disable();
        this.outletDetailsForm.get('drugWholesaleDocUrl').disable();
      }

  }

  /**
   * Method that calls city list API from vendor registration service
   */
  setCityList() {
    this.vendorService.getCityList().subscribe(
      res => {
        this.city = [];
        for (const c of res['result']) {
          this.city.push(City.fromJson(c));
        }
      }
    )
  }

  /**
   * Method that calls language list API from vendor registration service
   */
  setLanguageList() {
    this.vendorService.getLanguageList().subscribe(
      res => {
        this.language = [];
        for (const l of res['result']) {
          this.language.push(Language.fromJson(l));
        }
        this.outletDetailsForm.patchValue({ preferredLang: [this.language[0]['id']] });
      }
    )
  }

  /**
   * Method that calls area list api based on city id passed in parameter
   * @param event 
   */
  setAreaList(cityId) {
    this.outletDetailsForm['controls']['area'].reset();
    this.vendorService.getAreaList(cityId).subscribe(
      res => {
        this.area = [];
        for (const a of res['result']) {
          this.area.push(Area.fromJson(a));
        }
      }
    )
  }

  /**
   * Method that calls send otp API from vendor registration service
   */
  // sendOtp() {
  //   if (this.contactNumberVerified) return;
  //   if (!this.outletDetailsForm['controls']['contactNumber']['value'] || !this.outletDetailsForm['controls']['contactNumber'].valid) {
  //     this.toastMsgService.showWarning('Kindly enter valid contact number');
  //     return;
  //   }
  //   const data = {
  //     phone: `+91${this.outletDetailsForm['controls']['contactNumber']['value']}`
  //   };
  //   this.vendorService.businessContactSendOtp(this.outletId, data).subscribe(
  //     res => {
  //         // this.sendOtpText = 'OTP Sent';
  //         this.startTimer()
  //         this.toastMsgService.showSuccess('OTP sent successfully');
  //         this.outletDetailsForm['controls']['otp'].enable();
  //     }
  //   )
  // }

  /**
   * Method that calls verify otp API from vendor registration service
   */
  // async verifyOtp() {
  //   const data = {
  //     phone: `+91${this.outletDetailsForm['controls']['contactNumber']['value']}`,
  //     otp: this.outletDetailsForm['controls']['otp']['value']
  //   }
  //   this.vendorService.businessContactVerifyOtp(this.outletId, data).subscribe(
  //     res => {
  //       // this.outletDetailsForm['controls']['contactNumber'].disable();
  //       this.outletDetailsForm['controls']['otp'].setValue('');
  //       this.outletDetailsForm['controls']['otp'].disable();
  //       this.toastMsgService.showSuccess('Contact Number Verified');
  //       this.contactNumberVerified = true;
  //       this.stopTimer();
  //       this.sendOtpText = 'Verified';
  //     }
  //   )
  // }

  /**
   * Method that start timer of 30 secs to resend otp
   */
  startTimer() {
    this.canSendOtp = false;
    this.interval = setInterval(() => {
      this.timeLeft--;
      this.sendOtpText = `${this.timeLeft} secs left`
      if (this.timeLeft === 0) {
        this.sendOtpText = 'Resend OTP'
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
    this.canSendOtp = true;
  }

  /**
   * Method that detects value changes in contact number field after it is verified
   */
  // contactNumberValueChanges() {
  //   if (this.contactNumberVerified) {
  //     this.sendOtpText = 'Send Otp';
  //     this.contactNumberVerified = false;
  //     this.outletDetailsForm['controls']['otp'].enable();
  //   }
  // }

  /**
   * Method that show whatsApp number field based on selection
   */
  receiveNotification() {
    if (this.outletDetailsForm['controls']['receiveWhatsAppNotification']['value'] === true) {
      this.showWhatsAppNumberField = true;
      this.outletDetailsForm['controls']['whatsAppNumber'].enable();
    } else {
      this.showWhatsAppNumberField = false;
      this.outletDetailsForm['controls']['whatsAppNumber'].disable();
    }
  }

  /**
   * Method that show brand id field based on selection
   */
  alreadyRegistered() {
    if (this.outletDetailsForm['controls']['alreadyRegisteredWithUs']['value'] === true) {
      this.showBrandIdField = true;
      this.outletDetailsForm['controls']['brandId'].enable();
    } else {
      this.showBrandIdField = false;
      this.outletDetailsForm['controls']['brandId'].disable();
    }
  }

  /**
   * Method that sets value of whatsApp number field based on parameter passed
   * @param event 
   */
  // sameAsOwnerNumber(event: any) {
  //   if (event.target.checked === true) {
  //     this.outletDetailsForm['controls']['whatsAppNumber'].setValue(this.outletDetailsForm['controls']['contactNumber']['value']);
  //     this.outletDetailsForm['controls']['whatsAppNumber'].disable();
  //   } else {
  //     this.outletDetailsForm['controls']['whatsAppNumber'].setValue('');
  //     this.outletDetailsForm['controls']['whatsAppNumber'].enable();
  //   }
  // }

  /**
  * Method that checks whether user is uploading file with correct extn
  * and then gets url to upload the file with api call
  * @param file 
  */
  getFileUploadUrl(file: FileList, controlName?: string, i?: number) {
    console.log(controlName,'drugs');
    const index = (file.item(0).name.lastIndexOf('.'))
    const fileExtn = file.item(0).name.substring(index + 1).toLowerCase();
    if (!this.allowedFileExtn.includes(fileExtn))
      return this.toastMsgService.showError('Kindly choose correct file');

    // if (!['jpg', 'jpeg', 'png'].includes(fileExtn)) return this.toastMsgService.showError('Kindly choose correct file');

    if (file.item(0).size > maxFileSizeAllowed) return this.toastMsgService.showError('Kindly check the size of the file');

    this.vendorService.getFileUploadUrl(fileExtn).subscribe(
      res => {
        this.docUploadFormControlName = controlName;
        this.intermediateFileName = res['result']['file_name'];
        this.fileUpload(res['result']['uploadUrl'], file, i);
      }
    );
  }

  /**
   * Method that upload file to aws-s3 bucket with api call
   * @param uploadUrl 
   * @param file 
   */
  fileUpload(uploadUrl, file, index?: number) {
    this.vendorService.uploadFile(uploadUrl, file.item(0)).subscribe(
      res => {
        if(this.docUploadFormControlName === 'outletImage') {
        if (index >= 0) {
          this.outletDetailsForm['controls']['outletImageRows']['controls'][index]
          ['controls']['outletImage'].setValue(this.intermediateFileName);
          this.outletDetailsForm['controls']['']
        }
        else {
          this.outletDetailsForm['controls']['outletDoc'].setValue(this.intermediateFileName);
        }
      }else{
        this.outletDetailsForm['controls'][this.docUploadFormControlName].setValue(this.intermediateFileName);
      }
      }
    );
  }

  get imageArr() {
    return this.outletDetailsForm.get('outletImageRows') as FormArray;
  }

  /**
   * Method that init outlet images
   * @returns images
   */
  initOutletImageRows() {
    return this.formBuilder.group({
      outletImage: new FormControl('', Validators.required),
      outletImageUrl: new FormControl()
    });
  }
  showAdditonalImagesUploadButton() {
    this.uploadMoreImages = false;
  }
  addOutletImage() {
    this.imageArr.push(this.initOutletImageRows());
  }

  deleteOutletImage(index: number) {
    this.imageArr.removeAt(index);
    if (this.imageArr.controls.length === 0) {
      this.uploadMoreImages = true;
    }
  }

  /**
   * Method that open uploaded file in new tab 
   */
  viewFile(i?: number) {
    if (i >= 0) {
      window.open(this.outletDetailsForm['controls']['outletImageRows']['controls'][i]['controls']['outletImageUrl'].value);
    }
    else {
      window.open(this.outletDetailsForm.get('outletDocUrl').value);
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
    else if (this.outletDetailsForm.status === 'INVALID') {
      this.outletDetailsForm.markAllAsTouched();
      this.toastMsgService.showError(`Kindly fill up all the fields`);
    } 
    // else if (!this.contactNumberVerified) {
    //   this.toastMsgService.showInfo('Kindly verify contact number')
    // } 
    else {
      const formData = this.vendorService.outletDetails.toJson(this.service);
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
  validateSize(event) {
    const file = event.target.files[0];
    if (file.size > 100000) {
      // Display error message
      
    }
  }

  /**
   * Method that shows fields based on radio btn checked
   */
  haveValidBranchName(){
    if(this.outletDetailsForm.get('hasBranchName').value){
      this.haveBranchName = true;
      this.outletDetailsForm['controls']['branchName'].reset();
      this.outletDetailsForm['controls']['branchName'].enable();
    }else{
      this.haveBranchName = false;
      this.outletDetailsForm['controls']['branchName'].setValue(null);
      this.outletDetailsForm['controls']['branchName'].disable();
    }
  }

}