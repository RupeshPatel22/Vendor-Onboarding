/// <reference types="@types/googlemaps" />
import { FormArray, FormBuilder } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { RestaurantPocDesignation, VendorVerificationFields, VendorVerificationProps } from 'src/app/shared/models/constants/vendor-registration-types';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
declare var google: any;

@Component({
  selector: 'app-owner-location-details',
  templateUrl: './owner-location-details.component.html',
  styleUrls: ['./owner-location-details.component.scss']
})
export class OwnerLocationDetailsComponent implements OnInit {

  lat = 19.070170265541183;
  long = 72.88072022812501;
  geoCoder
  zoom: number = 12;
  showManagerFields: boolean = false;
  outletId: string;
  buttonText = 'save & next';
  verifyOtpText = 'Verify Otp';
  isPostalCodeVerified: boolean = true;
  readonly restaurantPocDesignation = RestaurantPocDesignation;


  fieldsForVerification: { [key in VendorVerificationFields]?: VendorVerificationProps } = {};
  @Input() disableAll: boolean;
  @Output() changeTab = new EventEmitter<string>();

  @ViewChild('search')
  public searchLocation: ElementRef;

  ownerDetailsForm = new FormGroup({
    ownerName: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z ]*"), Validators.minLength(5), Validators.maxLength(70)]),
    ownerContactNumber: new FormControl('', [Validators.required, Validators.pattern("[6-9][0-9]{9}")]),
    ownerContactOtp: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.pattern("[0-9]{5}")]),
    ownerEmailId: new FormControl('', [Validators.required, this.customEmailValidator()]),
    ownerEmailOtp: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.minLength(5), Validators.pattern("[0-9]{5}")]),
    managerName: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.pattern("[A-Za-z ]*"), Validators.minLength(5), Validators.maxLength(70)]),
    managerContactNumber: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.pattern("[6-9][0-9]{9}")]),
    // managerContactOtp: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.pattern("[0-9]{5}")]),
    managerEmailId: new FormControl({ disabled: true, value: '' }, [Validators.required, this.customEmailValidator()]),
    // managerEmailOtp: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.minLength(5), Validators.pattern("[0-9]{5}")]),
    invoiceEmailId: new FormControl('', [Validators.required, this.customEmailValidator()]),
    // invoiceEmailOtp: new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.minLength(5), Validators.pattern("[0-9]{5}")]),
    location: new FormControl(''),
    searchLocation: new FormControl(''),
    latitude: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
    postalCode: new FormControl({value: '' }, [Validators.required, Validators.pattern("[0-9 ]{6}")]),
    state: new FormControl({ disabled: true, value: '' }, [Validators.required]),
    ownerManager: new FormControl(true, [Validators.required]),
    // sameAsContactNumber: new FormControl(),
    sameAsOwnerEmailId: new FormControl(),
    pocList: this.formBuilder.array([this.initPocList()]),
  });

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private activeRoute: ActivatedRoute,
    private vendorService: VendorRegistrationService, private toastMsgService: ToastService, private formBuilder: FormBuilder
    ) {

    this.outletId = this.activeRoute.snapshot.paramMap.get('outletId');
  }

  ngOnInit(): void {
    if (this.disableAll) {
      this.ownerDetailsForm.disable();
      this.buttonText = 'next';
    }
    this.initializeFieldsForVerification();
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchLocation.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.lat = place.geometry.location.lat();
          this.long = place.geometry.location.lng();
          this.zoom = 12;
          this.getAddress(this.lat, this.long);
          this.isPostalCodeVerified = true;
        });
      });
    });

    /**
     *   passing owner/location form data to vendor service when whole form is valid
     *   by subscribing to valueChanges property
    */
    this.ownerDetailsForm.valueChanges.pipe(filter(() => this.ownerDetailsForm.status !== 'INVALID'))
      .subscribe(() => {
        const val = this.ownerDetailsForm.getRawValue();
        for (const v in val) {
          this.vendorService.ownerLocationDetails[v] = val[v]
        }
        this.vendorService.ownerContactNumber.next(val['ownerContactNumber']);
      })
  }

  /**
   * Method to Initializes a form group for managing a Point of Contact (POC).
   * @returns {FormGroup} The initialized form group containing POC information.
   */
  initPocList() {
    return this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      pocNumber: new FormControl('', [Validators.required]),
      isPrimary: new FormControl('', [Validators.required]),
      designation: new FormControl(null, [Validators.required]),
    });
  }


  /**
   * Gets the FormArray containing Point of Contact (POC) entries.
   * @returns {FormArray} The FormArray containing POC entries.
   */
  get pocListArray() {
    return this.ownerDetailsForm.get('pocList') as FormArray;
  }

  /**
   * Method to Adds a new Point of Contact (POC) entry to the FormArray.
   */
  addPocEntry() {
    this.pocListArray.push(this.initPocList());
  }

  /**
   * Method to Removes a Point of Contact (POC) entry from the FormArray.
   * @param {number} index - The index of the POC entry to be removed.
   */
  removePocEntry(index: number) {
    this.pocListArray.removeAt(index);
    this.pocListArray.markAsDirty()
  }

  /**
   * Method that sets current geo location of user
   */
  setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.lat, this.long);
      }, (error) => {
        this.getAddress(this.lat, this.long);
      });
    }
  }

  /**
   * Method that sets lat, lang and address after 
   * user sets pin on one place
   * @param event 
   */
  markerDragged(event) {
    this.lat = event.coords.lat;
    this.long = event.coords.lng;
    this.getAddress(this.lat, this.long);
    this.isPostalCodeVerified = true;
  }

  /**
   * Method that inovokes when user changes lat/long field
   * and then updates pincode, location and marker in map
   * @param changeType 
   */
  latLongChange(changeType: 'lat' | 'long') {
    if (changeType === 'lat') {
      this.lat = Number(this.ownerDetailsForm['controls']['latitude']['value']);
    }
    if (changeType === 'long') {
      this.long = Number(this.ownerDetailsForm['controls']['longitude']['value']);
    }
    this.getAddress(this.lat, this.long)
  }

  /**
   * Method that get address based on parameter passed
   * @param latitude 
   * @param longitude 
   */
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          for (const a in results[0]['address_components']) {
            if (results[0]['address_components'][a]['types'].includes("administrative_area_level_1")) {
              this.ownerDetailsForm['controls']['state'].setValue(results[0]['address_components'][a]['long_name'])
            }
            if (results[0]['address_components'][a]['types'].includes("postal_code")) {
              this.ownerDetailsForm['controls']['postalCode'].setValue(results[0]['address_components'][a]['long_name'])
            }
          }
          this.zoom = 12;
          this.ownerDetailsForm['controls']['location'].setValue(results[0].formatted_address);
          this.ownerDetailsForm['controls']['latitude'].setValue(this.lat)
          this.ownerDetailsForm['controls']['longitude'].setValue(this.long)
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  /**
   * Method that start timer of 30 secs to resend otp
   */
  startTimer(field: VendorVerificationFields) {
    this.fieldsForVerification[field].canSendOtp = false;
    this.fieldsForVerification[field].interval = setInterval(() => {
      this.fieldsForVerification[field].timeLeft -= 1;
      this.fieldsForVerification[field].sendOtpText = `${this.fieldsForVerification[field].timeLeft} secs left`
      if (this.fieldsForVerification[field].timeLeft === 0) {
        this.fieldsForVerification[field].sendOtpText = 'Resend OTP'
        this.stopTimer(field);
      }
    }, 1000)
  }

  /**
   * Method that stop timer for resend otp
   */
  stopTimer(field: VendorVerificationFields) {
    clearInterval(this.fieldsForVerification[field].interval);
    this.fieldsForVerification[field].timeLeft = 30;
    this.fieldsForVerification[field].canSendOtp = true;
  }

  /**
   * Method that checks validity of email
   * @returns 
   */
  customEmailValidator(): ValidatorFn {
    return (control: AbstractControl): {
      [key: string]: any
    } | null => {
      const val = control.value;
      if (val && !val.match("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")) {
        return { email: true }
      }
    };
  }

  /**
   * Method that detects value changes in contact number field after it is verified
   */
  verificationFieldValueChanges(field: VendorVerificationFields) {
    if (this.fieldsForVerification[field].isVerified) {
      this.fieldsForVerification[field].sendOtpText = 'Send Otp';
      this.fieldsForVerification[field].isVerified = false;
    }
  }

  /**
   * Method that sends otp to owner contact number
   * @returns 
   */
  sendOtpToOwnerContactNumber() {
    if (this.fieldsForVerification['ownerContact'].isVerified || !this.fieldsForVerification['ownerContact'].canSendOtp) return;
    if (!this.ownerDetailsForm['controls']['ownerContactNumber'].valid) {
      return this.toastMsgService.showError('Kindly enter valid contact number');
    }
    const data = {
      phone: `+91${this.ownerDetailsForm['controls']['ownerContactNumber']['value']}`
    }
    this.vendorService.ownerContactSendOtp(this.outletId, data).subscribe(res => {
      this.actionsAfterOtpSent('ownerContact', 'ownerContactOtp');
    })
  }

  /**
   * Method that verifies owner contact number
   * @returns 
   */
  verifyOtpForOwnerContactNumber() {
    if (!this.ownerDetailsForm['controls']['ownerContactOtp'].valid) return;
    const data = {
      phone: `+91${this.ownerDetailsForm['controls']['ownerContactNumber']['value']}`,
      otp: this.ownerDetailsForm['controls']['ownerContactOtp']['value']
    }
    this.vendorService.ownerContactVerifyOtp(this.outletId, data).subscribe(res => {
      this.actionsAfterOtpVerified('ownerContact', 'ownerContactOtp');
    })
  }

  /**
   * Method that sends otp to owner email id
   * @returns 
   */
  sendOtpToOwnerEmail() {
    if (this.fieldsForVerification['ownerEmail'].isVerified || !this.fieldsForVerification['ownerEmail'].canSendOtp) return;
    if (!this.ownerDetailsForm['controls']['ownerEmailId'].valid) {
      return this.toastMsgService.showError('Kindly enter valid owner email id');
    }
    const data = {
      email: this.ownerDetailsForm['controls']['ownerEmailId']['value']
    }
    this.vendorService.ownerEmailSendOtp(this.outletId, data).subscribe(res => {
      this.actionsAfterOtpSent('ownerEmail', 'ownerEmailOtp');
    })
  }

  /**
   * Method that verifies owner email id
   * @returns 
   */
  verifyOtpForOwnerEmail() {
    if (!this.ownerDetailsForm['controls']['ownerEmailOtp'].valid) return;
    const data = {
      email: this.ownerDetailsForm['controls']['ownerEmailId']['value'],
      otp: this.ownerDetailsForm['controls']['ownerEmailOtp']['value']
    }
    this.vendorService.ownerEmailVerifyOtp(this.outletId, data).subscribe(res => {
      this.actionsAfterOtpVerified('ownerEmail', 'ownerEmailOtp');
    })
  }

  /**
   * Method that sends otp to mnager contact number
   * @returns 
   */
  // sendOtpToManagerContact() {
  //   if (this.fieldsForVerification['managerContact'].isVerified || !this.fieldsForVerification['managerContact'].canSendOtp) return;
  //   if (!this.ownerDetailsForm['controls']['managerContactNumber'].valid) {
  //     return this.toastMsgService.showError('Kindly enter valid manager contact number');
  //   }
  //   const data = {
  //     phone: `+91${this.ownerDetailsForm['controls']['managerContactNumber']['value']}`
  //   }
  //   this.vendorService.managerContactSendOtp(this.outletId, data).subscribe(res => {
  //     this.actionsAfterOtpSent('managerContact', 'managerContactOtp');
  //   })
  // }

  /**
   * Method that verifies manager contact number
   * @returns 
   */
  // verifyOtpForManagerContact() {
  //   if (!this.ownerDetailsForm['controls']['managerContactOtp'].valid) return;
  //   const data = {
  //     phone: `+91${this.ownerDetailsForm['controls']['managerContactNumber']['value']}`,
  //     otp: this.ownerDetailsForm['controls']['managerContactOtp']['value']
  //   }
  //   this.vendorService.managerContactVerifyOtp(this.outletId, data).subscribe(res => {
  //     this.actionsAfterOtpVerified('managerContact', 'managerContactOtp');
  //   })
  // }

  /**
   * Method that sends otp to manager email
   * @returns 
   */
  // sendOtpToManagerEmail() {
  //   if (this.fieldsForVerification['managerEmail'].isVerified || !this.fieldsForVerification['managerEmail'].canSendOtp) return;
  //   if (!this.ownerDetailsForm['controls']['managerEmailId'].valid) {
  //     return this.toastMsgService.showError('Kindly enter valid manager email id');
  //   }
  //   const data = {
  //     email: this.ownerDetailsForm['controls']['managerEmailId']['value']
  //   }
  //   this.vendorService.managerEmailSendOtp(this.outletId, data).subscribe(res => {
  //     this.actionsAfterOtpSent('managerEmail', 'managerEmailOtp');
  //   })
  // }

  /**
   * Method that verifies manager email
   * @returns 
   */
  // verifyOtpForManagerEmail() {
  //   if (!this.ownerDetailsForm['controls']['managerEmailOtp'].valid) return;
  //   const data = {
  //     email: this.ownerDetailsForm['controls']['managerEmailId']['value'],
  //     otp: this.ownerDetailsForm['controls']['managerEmailOtp']['value']
  //   }
  //   this.vendorService.managerEmailVerifyOtp(this.outletId, data).subscribe(res => {
  //     this.actionsAfterOtpVerified('managerEmail', 'managerEmailOtp');
  //   })
  // }

  /**
   * Method that sends otp to invoice email
   * @returns 
   */
  // sendOtpForInvoiceEmail() {
  //   if (this.fieldsForVerification['invoiceEmail'].isVerified || !this.fieldsForVerification['invoiceEmail'].canSendOtp) return;
  //   if (!this.ownerDetailsForm['controls']['invoiceEmailId']['value'] || !this.ownerDetailsForm['controls']['invoiceEmailId'].valid) {
  //     return this.toastMsgService.showError('Kindly enter valid invoice email id');
  //   }
  //   const data = {
  //     email: this.ownerDetailsForm['controls']['invoiceEmailId']['value']
  //   }
  //   this.vendorService.invoiceEmailSendOtp(this.outletId, data).subscribe(res => {
  //     this.actionsAfterOtpSent('invoiceEmail', 'invoiceEmailOtp');
  //   })
  // }

  /**
   * Method that verifies invoice email id
   * @returns 
   */
  // verifyOtpForInvoiceEmail() {
  //   if (!this.ownerDetailsForm['controls']['invoiceEmailOtp'].valid) return;
  //   const data = {
  //     email: this.ownerDetailsForm['controls']['invoiceEmailId']['value'],
  //     otp: this.ownerDetailsForm['controls']['invoiceEmailOtp']['value']
  //   }
  //   this.vendorService.verifyInvoiceEmailOtp(this.outletId, data).subscribe(res => {
  //     this.actionsAfterOtpVerified('invoiceEmail', 'invoiceEmailOtp');
  //   })
  // }

  /**
   * Method that shows diff fields based on selection
   */
  isOwnerManagerSame() {
    if (!this.ownerDetailsForm['controls']['ownerManager']['value']) {
      this.showManagerFields = true;
      this.ownerDetailsForm['controls']['managerName'].enable();
      this.ownerDetailsForm['controls']['managerContactNumber'].enable();
      this.ownerDetailsForm['controls']['managerEmailId'].enable();
    } else {
      this.showManagerFields = false;
      this.ownerDetailsForm['controls']['managerName'].disable();
      this.ownerDetailsForm['controls']['managerContactNumber'].disable();
      this.ownerDetailsForm['controls']['managerEmailId'].disable();
    }
  }

  /**
   * Method that sets contact number value based on checkbox
   * @param event 
   */
  // contactNumberSameAsOwnerNumber(event: any) {
  //   if (event.target.checked === true) {
  //     this.fieldsForVerification['ownerContact'].isVerified = true;
  //     this.fieldsForVerification['ownerContact'].sendOtpText = 'Verified';
  //     // this.ownerDetailsForm['controls']['ownerContactNumber'].setValue(this.vendorService.outletDetails.contactNumber);
  //     this.ownerDetailsForm['controls']['ownerContactNumber'].disable();
  //     this.ownerDetailsForm['controls']['ownerContactOtp'].disable();
  //     this.stopTimer('ownerContact');
  //   } else {
  //     this.fieldsForVerification['ownerContact'].isVerified = false;
  //     this.fieldsForVerification['ownerContact'].sendOtpText = 'Send Otp';
  //     this.ownerDetailsForm['controls']['ownerContactOtp'].reset();
  //     this.ownerDetailsForm['controls']['ownerContactNumber'].reset();
  //     this.ownerDetailsForm['controls']['ownerContactNumber'].enable();
  //   }
  // }

  /** 
  * Method that sets invoice email id value based on checkbox
  * @param event 
  */
  invoiceEmailSameAsOwnerEmail(event: any) {
    if (event.target.checked === true) {
      // this.fieldsForVerification['invoiceEmail'].isVerified = true;
      // this.fieldsForVerification['invoiceEmail'].sendOtpText = 'Verified';
      this.ownerDetailsForm['controls']['invoiceEmailId'].setValue(this.ownerDetailsForm['controls']['ownerEmailId']['value']);
      this.ownerDetailsForm['controls']['invoiceEmailId'].disable();
      // this.ownerDetailsForm['controls']['invoiceEmailOtp'].disable();
      // this.stopTimer('invoiceEmail');
    } else {
      // this.fieldsForVerification['invoiceEmail'].isVerified = false;
      // this.fieldsForVerification['invoiceEmail'].sendOtpText = 'Send Otp';
      // this.ownerDetailsForm['controls']['invoiceEmailOtp'].reset();
      this.ownerDetailsForm['controls']['invoiceEmailId'].reset();
      this.ownerDetailsForm['controls']['invoiceEmailId'].enable();

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
    else if (this.ownerDetailsForm.status === 'INVALID') {
      this.ownerDetailsForm.markAllAsTouched();
      this.toastMsgService.showError(`Kindly fill up all the fields`);
    }
    else if (!this.fieldsForVerification['ownerContact'].isVerified) {
      this.toastMsgService.showError('Kindly verify owner contact number');
    }
    else if (!this.fieldsForVerification['ownerEmail'].isVerified) {
      this.toastMsgService.showError('Kindly verify owner email Id');
    }
    // else if (!this.fieldsForVerification['invoiceEmail'].isVerified) {
    //   this.toastMsgService.showError('Kindly verify invoice email Id');
    // }
    // else if (!this.fieldsForVerification['managerContact'].isVerified && this.showManagerFields) {
    //   this.toastMsgService.showError('Kindly verify manager contact number');
    // }
    // else if (!this.fieldsForVerification['managerEmail'].isVerified && this.showManagerFields) {
    //   this.toastMsgService.showError('Kindly verify manager email Id');
    // }
    else {
      const formData = this.vendorService.ownerLocationDetails.toJson();
      this.vendorService.saveOutletDetails(this.outletId, formData).subscribe(res => {
        this.changeTab.emit();
      });
    }
  }

  /**
   * Method that initializes fieldsForVerification obj
   * it has field to be verified as a key with some initial values(which is a instance of 'VendorVerificationProps' class)
   */
  initializeFieldsForVerification() {
    const arr: VendorVerificationFields[] = ['ownerContact', 'ownerEmail']
    for (const field of arr) {
      this.fieldsForVerification[field] = new VendorVerificationProps();
    }
  }

  /**
   * Method that invokes after otp is sent for field
   * @param field 
   * @param controlName 
   */
  actionsAfterOtpSent
    (
      field: VendorVerificationFields,
      controlName: 'ownerContactOtp' | 'ownerEmailOtp' 
    ) {
    this.startTimer(field);
    this.ownerDetailsForm['controls'][controlName].markAsUntouched();
    this.ownerDetailsForm['controls'][controlName].enable();
    this.toastMsgService.showSuccess('OTP sent successfully');
  }

  /**
   * Method that invokes after otp is verified for the field
   * @param field 
   * @param controlName 
   */
  actionsAfterOtpVerified
    (
      field: VendorVerificationFields,
      controlName: 'ownerContactOtp' | 'ownerEmailOtp' 
    ) {
    this.stopTimer(field);
    this.ownerDetailsForm['controls'][controlName].reset();
    this.ownerDetailsForm['controls'][controlName].disable();
    this.fieldsForVerification[field].isVerified = true;
    this.fieldsForVerification[field].sendOtpText = 'Verified';
    this.toastMsgService.showSuccess('OTP verified successfully');
  }

  /**
  * Method that emits event to go to previous page
  */
  previous() {
    this.changeTab.emit('back')
  }

}