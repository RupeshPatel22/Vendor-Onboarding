import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { tabList, Services, RiderTabList, FormsList, FormsToShowForService, Roles, VendorDetails, RiderDetails, OutletStatus, RiderStatus, OutletStatusList, RiderStatusList } from '../../../shared/models/constants/vendor-registration-types'
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { CommisionOnboardingComponent } from './components/commision-onboarding/commision-onboarding.component';
import { ESignComponent } from './components/e-sign/e-sign.component';
import { FssaiDetailsComponent } from './components/fssai-details/fssai-details.component';
import { GstPanDetailsComponent } from './components/gst-pan-details/gst-pan-details.component';
import { OnboardingFormComponent } from './components/onboarding-form/onboarding-form.component';
import { OwnerLocationDetailsComponent } from './components/owner-location-details/owner-location-details.component';
import { OutletDetailsComponent } from './components/outlet-details/outlet-details.component';
import { Router } from '@angular/router';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import * as moment from 'moment';
import { RiderDetailsComponent } from './components/rider-details/rider-details.component';

@Component({
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: ['./create-vendor.component.scss']
})
export class CreateVendorComponent implements OnInit, AfterViewInit {

  currentTab = tabList;
  step = 0;
  draftSection: number = null;
  currentForm = '';
  navBarList = Object.values(tabList)
  vendorDetails: VendorDetails;
  outletId;
  userName;
  disableAll: boolean = false;
  role: Roles;
  currentOutletStatus: OutletStatus;
  outletStatusWithEditAccess: OutletStatus[] = ['draft', 'approvalRejected'];

  currentRiderStatus: RiderStatus;
  riderStatusWithEditAccess: RiderStatus[] = ['draft', 'rejected'];
  currentPreviousForm: { [key: number]: any };
  service: string;
  readonly FormsList = FormsList;
  readonly FormsToShowForService = FormsToShowForService;
  readonly services = Services;
  readonly roles = Roles;
  riderDetails: RiderDetails;

  @ViewChild('outletDet') outletDet: OutletDetailsComponent;
  @ViewChild('fssaiDet') fssaiDet: FssaiDetailsComponent;
  @ViewChild('commisionOnboarding') commisionOnboarding: CommisionOnboardingComponent;
  @ViewChild('ownerLocationDet') ownerLocationDet: OwnerLocationDetailsComponent;
  @ViewChild('gstPanDet') gstPanDet: GstPanDetailsComponent;
  @ViewChild('bankDet') bankDet: BankDetailsComponent;
  @ViewChild('eSign') eSign: ESignComponent;
  @ViewChild('onboardingForm') onboardingForm: OnboardingFormComponent;
  @ViewChild('riderDet') riderDet: RiderDetailsComponent;
  @ViewChild('checkbox') checkbox: ElementRef;

  remarks = new FormControl();
  constructor(private vendorService: VendorRegistrationService, private router: Router, private dialog: MatDialog,
    private toastMsgService: ToastService, private activeRoute: ActivatedRoute, private authenticationService: AuthenticationService) {
    this.activeRoute.data.subscribe(data => {
      if (data.kind === 'view') {
        this.disableAll = true;
      }
    });
    this.outletId = this.activeRoute.snapshot.paramMap.get('outletId');
    this.vendorService.service = this.activeRoute.snapshot.queryParams['service'];
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
    this.role = this.authenticationService.role;
    if (this.role === Roles.Partner) {
      this.remarks.disable()
    }
    this.remarks.valueChanges.subscribe(val => this.vendorService.remarks = val);
    this.service = this.vendorService.service;

    if (this.service === Services.Rider) {
      this.currentTab = RiderTabList;
      this.navBarList = Object.values(RiderTabList)
    }

  }

  ngAfterViewInit(): void {
    if (this.service === Services.Rider) {
      this.currentPreviousForm = {
        0: [this.riderDet.riderDetailsForm, this.riderDet.riderDetailsForm]
      }
      this.setRiderDetails();
    } else {
      this.currentPreviousForm = {
        0: [this.outletDet.outletDetailsForm, this.outletDet.outletDetailsForm],
        1: [this.fssaiDet.fssaiDetailsForm, this.outletDet.outletDetailsForm],
        2: [this.commisionOnboarding, this.fssaiDet.fssaiDetailsForm],
        3: [this.ownerLocationDet.ownerDetailsForm, this.commisionOnboarding],
        4: [this.gstPanDet.gstPanDetailsForm, this.ownerLocationDet.ownerDetailsForm],
        5: [this.bankDet.bankDetailsForm, this.gstPanDet.gstPanDetailsForm],
        6: [this.eSign.eSignForm, this.bankDet.bankDetailsForm],
        7: [this.onboardingForm.onboardingForm, this.eSign.eSignForm],
      }
      this.setVendorDetails();
    }
  }

  /**
   * Method that sets all forms data by making get API call
   */
  setVendorDetails() {
    this.vendorService.getOutletDetails(this.outletId).subscribe(data => {
      this.vendorDetails = VendorDetails.fromJson(data['result']);

      const path = this.activeRoute.snapshot.url[0].path

      if (path === 'create-vendor' && !this.outletStatusWithEditAccess.includes(this.vendorDetails.status)) {
        const dialogRef = this.dialog.open(ConfirmationModalComponent, {
          data:
          {
            title: 'Alert!!!',
            message: 'Invalid URL. Getting redirected to home page.',
            alert: true
          }
        });
        dialogRef.afterClosed().subscribe(response => {
          if (response) {
            this.router.navigate(['home/food']);
          }
        })
        return;
      }
      if (path === 'view-vendor' && this.outletStatusWithEditAccess.includes(this.vendorDetails.status) && this.role === Roles.Partner) {
        const dialogRef = this.dialog.open(ConfirmationModalComponent, {
          data:
          {
            title: 'Alert!!!',
            message: 'Invalid URL. Getting redirected to home page.',
            alert: true
          }
        });
        dialogRef.afterClosed().subscribe(response => {
          if (response) {
            this.router.navigate(['home/food']);
          }
        })
        return;
      }

      if (this.vendorDetails.draftSection) {
        this.draftSection = Number(this.vendorDetails.draftSection);
      }
      if (!this.disableAll && this.vendorDetails.draftSection && this.vendorDetails.status === 'draft') {
        this.step = this.draftSection + 1;
      }
      this.currentOutletStatus = this.vendorDetails.status;
      //Outlet Details
      if (this.vendorDetails.outletDetails.city) this.outletDet.setAreaList(this.vendorDetails.outletDetails.city);
      this.outletDet.outletDetailsForm.patchValue({ ...this.vendorDetails.outletDetails })
      if(!this.vendorDetails.outletDetails.branchName){
        this.outletDet.outletDetailsForm['controls']['hasBranchName'].setValue(false);
        this.outletDet.outletDetailsForm['controls']['branchName'].disable(); 
        this.outletDet.haveBranchName = false;
      }
      // if (this.vendorDetails.outletDetails.isContactNumberVerified) {
      //   this.outletDet.contactNumberVerified = true;
      //   this.outletDet.outletDetailsForm['controls']['otp'].disable();
      //   this.outletDet.sendOtpText = 'verified';
      // }
      // if (this.vendorDetails.outletDetails.receiveWhatsAppNotification) {
      //   this.outletDet.showWhatsAppNumberField = true;
      //   if (!this.vendorDetails.outletDetails.sameAsContactNumber && !this.disableAll) this.outletDet.outletDetailsForm['controls']['whatsAppNumber'].enable();
      // }

      if (this.vendorDetails.outletDetails.outletImageRows) {
        this.outletDet.imageArr.clear();
        this.vendorDetails.outletDetails.outletImageRows.forEach((image, i) => {
          this.outletDet.addOutletImage();
          this.outletDet.imageArr.at(i).patchValue({ ...image });
        });
        if (this.disableAll)
          this.outletDet.imageArr.disable();
      }

      //FSSAI Details
      this.fssaiDet.fssaiDetailsForm.patchValue({ ...this.vendorDetails.fssaiDetails });
      // this.fssaiDet.uploadFileTypeChange(this.vendorDetails.fssaiDetails.fssaiLicenseType);
      if (!this.vendorDetails.fssaiDetails.hasFssaiCertificate) {
        this.fssaiDet.fssaiDetailsForm['controls']['fssaiRegisterNumber'].disable();
        if (!this.disableAll) this.fssaiDet.fssaiDetailsForm['controls']['fssaiAcknowledgementNumber'].enable();
        this.fssaiDet.maxDate = moment(new Date()).format('YYYY-MM-DD');
      }
      else {
        this.fssaiDet.maxDate = '';
        this.fssaiDet.minDate = moment().format('YYYY-MM-DD');
      }
      if (this.vendorDetails.fssaiDetails.isFssaiCertVerified) {
        this.fssaiDet.fssaiCertVerified = true;
        // this.fssaiDet.validateFSSAIText = 'verified';
        this.fssaiDet.fssaiDetailsForm['controls']['hasFssaiCertificate'].disable();
      }
      if (this.service === Services.Flower || this.service === Services.Paan || this.service === Services.Pet) {
        this.fssaiDet.showHasFssaiDetailsField = true
        const hasFssaiDetails = this.vendorDetails.fssaiDetails.hasFssaiCertificate !== null;
        this.fssaiDet.haveFssaiDetails(hasFssaiDetails);
      }

      //Subscription and Onboarding
      this.commisionOnboarding.valid = this.vendorDetails.tncAccepted;

      // Owner/Location Details
      this.ownerLocationDet.ownerDetailsForm.patchValue({ ...this.vendorDetails.ownerLocationDetails });
      // if (this.vendorDetails.ownerLocationDetails.sameAsContactNumber) this.ownerLocationDet.ownerDetailsForm['controls']['ownerContactNumber'].disable();
      if (this.vendorDetails.ownerLocationDetails.sameAsOwnerEmailId) this.ownerLocationDet.ownerDetailsForm['controls']['invoiceEmailId'].disable();
      if (!this.vendorDetails.ownerLocationDetails.ownerManager) {
        this.ownerLocationDet.showManagerFields = true;
        if (!this.disableAll) {
          this.ownerLocationDet.ownerDetailsForm['controls']['managerName'].enable();
          this.ownerLocationDet.ownerDetailsForm['controls']['managerContactNumber'].enable();
          this.ownerLocationDet.ownerDetailsForm['controls']['managerEmailId'].enable();
        }
      }
      if (!this.vendorDetails.ownerLocationDetails.ownerManager) {
        this.ownerLocationDet.showManagerFields = true;
        if (!this.disableAll) {
          this.ownerLocationDet.ownerDetailsForm['controls']['managerName'].enable();
          this.ownerLocationDet.ownerDetailsForm['controls']['managerContactNumber'].enable();
          this.ownerLocationDet.ownerDetailsForm['controls']['managerEmailId'].enable();
        }
      }
      if (this.vendorDetails.ownerLocationDetails.isOwnerContactNumberVerified) {
        this.ownerLocationDet.fieldsForVerification['ownerContact'].isVerified = true;
        this.ownerLocationDet.fieldsForVerification['ownerContact'].sendOtpText = 'verified';
        this.ownerLocationDet.ownerDetailsForm['controls']['ownerContactOtp'].disable();
      }
      if (this.vendorDetails.ownerLocationDetails.isOwnerEmailIdVerified) {
        this.ownerLocationDet.fieldsForVerification['ownerEmail'].isVerified = true;
        this.ownerLocationDet.fieldsForVerification['ownerEmail'].sendOtpText = 'verified';
        this.ownerLocationDet.ownerDetailsForm['controls']['ownerEmailOtp'].disable();
      }
      if (this.vendorDetails.ownerLocationDetails.pocList.length) {
        this.ownerLocationDet.pocListArray.clear();
       }
      this.vendorDetails.ownerLocationDetails.pocList.forEach((pocItem, index) => {
        this.ownerLocationDet.pocListArray.push(this.ownerLocationDet.initPocList());
        this.ownerLocationDet.pocListArray['controls'][index].patchValue(pocItem)
      })
      if (this.disableAll) this.ownerLocationDet.pocListArray.disable();


      // if (this.vendorDetails.ownerLocationDetails.isManagerContactNumberVerified) {
      //   this.ownerLocationDet.fieldsForVerification['managerContact'].isVerified = true;
      //   this.ownerLocationDet.fieldsForVerification['managerContact'].sendOtpText = 'verified';
      //   this.ownerLocationDet.ownerDetailsForm['controls']['managerContactOtp'].disable();
      // }
      // if (this.vendorDetails.ownerLocationDetails.isManagerEmailIdVerified) {
      //   this.ownerLocationDet.fieldsForVerification['managerEmail'].isVerified = true;
      //   this.ownerLocationDet.fieldsForVerification['managerEmail'].sendOtpText = 'verified';
      //   this.ownerLocationDet.ownerDetailsForm['controls']['managerEmailOtp'].disable();
      // }
      // if (this.vendorDetails.ownerLocationDetails.isInvoiceEmailIdVerified) {
      //   this.ownerLocationDet.fieldsForVerification['invoiceEmail'].isVerified = true;
      //   this.ownerLocationDet.fieldsForVerification['invoiceEmail'].sendOtpText = 'verified';
      //   this.ownerLocationDet.ownerDetailsForm['controls']['invoiceEmailOtp'].disable();
      // }
      // this.ownerLocationDet.isPostalCodeVerified = this.vendorDetails.ownerLocationDetails.isPostalCodeVerified = true;
      setTimeout(() => {
        if (this.vendorDetails.ownerLocationDetails.latitude && this.vendorDetails.ownerLocationDetails.longitude) {
          this.ownerLocationDet.lat = this.vendorDetails.ownerLocationDetails.latitude;
          this.ownerLocationDet.long = this.vendorDetails.ownerLocationDetails.longitude;
          // this.ownerLocationDet.getAddress(this.vendorDetails.ownerLocationDetails.latitude, this.vendorDetails.ownerLocationDetails.longitude);
        } else {
          this.ownerLocationDet.setCurrentLocation();
        }
      }, 1000)

      // GST/PAN Details
      this.gstPanDet.gstPanDetailsForm.patchValue({ ...this.vendorDetails.gstPanDetails });
      // this.gstPanDet.uploadFileTypeChange('panDoc',this.vendorDetails.gstPanDetails.panDocType);
      // this.gstPanDet.uploadFileTypeChange('gstDoc',this.vendorDetails.gstPanDetails.gstDocType);
      if (!this.vendorDetails.gstPanDetails.hasGST) {
        this.gstPanDet.showGSTFields = false;
        this.gstPanDet.gstPanDetailsForm['controls']['gstNumber'].disable();
        // this.gstPanDet.gstPanDetailsForm['controls']['gstDocType'].disable();
        this.gstPanDet.gstPanDetailsForm['controls']['gstDoc'].disable();
        if (!this.disableAll) {
          this.gstPanDet.gstPanDetailsForm['controls']['businessEntityName'].enable();
          this.gstPanDet.gstPanDetailsForm['controls']['businessEntityAddress'].enable();
        }
      }
      this.gstPanDet.haveReg();
      if (this.service === Services.Paan || this.service === Services.Flower) {
        this.gstPanDet.showGstCategoryField = false;
        this.gstPanDet.gstPanDetailsForm.get('gstCategory').disable();
      }
      if (this.disableAll) this.gstPanDet.gstPanDetailsForm.disable();
      // if (this.vendorDetails.gstPanDetails.isPanVerified) {
      //   this.gstPanDet.panVerified = true;
      //   this.gstPanDet.verifyPanText = 'verified';
      // }
      // if (this.vendorDetails.gstPanDetails.isGstVerified) {
      //   this.gstPanDet.gstVerified = true;
      //   this.gstPanDet.verifyGstText = 'verified';
      //   this.gstPanDet.gstPanDetailsForm['controls']['hasGST'].disable();
      // }

      // Bank Details
      this.bankDet.bankDetailsForm.patchValue({ ...this.vendorDetails.bankDetails });
      // this.bankDet.uploadFileTypeChange('bankDoc',this.vendorDetails.bankDetails.bankDocType);
      // this.bankDet.uploadFileTypeChange('kycDoc',this.vendorDetails.bankDetails.kycDocType);
      if (this.vendorDetails.bankDetails.isIfscVerified) {
        // this.bankDet.bankDetailsForm['controls']['ifscCode'].disable();
        this.bankDet.verifyIfscText = 'verified';
        this.bankDet.ifscVerified = true;
      }

      //E-Sign Form
      this.eSign.eSignForm.get('readMou').setValue(this.vendorDetails.eSignDetails.readMou);
      if (this.vendorDetails.eSignDetails.isContactNumberVerified) {
        this.eSign.contactNumberVerified = true;
        this.eSign.generateOtpText = 'verified';
        this.eSign.eSignForm['controls']['otp'].disable();
      }

      // Onboarding Form
      this.onboardingForm.currentOutletStatus = this.currentOutletStatus;
      this.onboardingForm.onboardingForm.patchValue({
        speedyyAccountManager: this.vendorDetails.onboardingDetails.speedyyAccountManager,
        packagingChargesType: this.vendorDetails.onboardingDetails.packagingChargesType,
        orderLevelPackagingCharges: this.vendorDetails.onboardingDetails.orderLevelPackagingCharges,
        customItemLevalPackagingCharges: this.vendorDetails.onboardingDetails.customItemLevalPackagingCharges,
        cuisineType: this.vendorDetails.onboardingDetails.cuisineType,
        cost: this.vendorDetails.onboardingDetails.cost,
        isPureVeg: this.vendorDetails.onboardingDetails.isPureVeg,
        prepTime: this.vendorDetails.onboardingDetails.prepTime,
        // menuDocType: this.vendorDetails.onboardingDetails.menuDocType,
        slotType: this.vendorDetails.onboardingDetails.slotType,
        agreedSpeedyyChargePercentage: this.vendorDetails.onboardingDetails.agreedSpeedyyChargePercentage
      })
      this.onboardingForm.packagingChargesFields = this.vendorDetails.onboardingDetails.packagingChargesType;
      if (this.vendorDetails.onboardingDetails.packagingChargesType === 'item') {
        if (!this.disableAll) this.onboardingForm.onboardingForm['controls']['customItemLevalPackagingCharges'].enable();

        if (this.vendorDetails.onboardingDetails.customItemLevalPackagingCharges) {
          this.vendorDetails.onboardingDetails.itemRows.forEach((item, i) => {
            this.onboardingForm.addItem();
            this.onboardingForm.itemArr.at(i).patchValue({ ...item })
          })
        }
      }
      if (this.vendorDetails.onboardingDetails.packagingChargesType !== 'order') {
        this.onboardingForm.onboardingForm['controls']['orderLevelPackagingCharges'].disable();
      }
      // this.onboardingForm.uploadFileTypeChange(this.vendorDetails.onboardingDetails.menuDocType);

      if (this.vendorDetails.onboardingDetails.menuRows) {
        this.onboardingForm.menuArr.clear();
        this.vendorDetails.onboardingDetails.menuRows.forEach((menu, i) => {
          this.onboardingForm.addMenu();
          this.onboardingForm.menuArr.at(i).patchValue({ ...menu })
        })
      }

      this.onboardingForm.slotTypeSelectionChange(this.vendorDetails.onboardingDetails.slotType);
      for (const slotName of this.onboardingForm.days.keys()) {
        const formArray = this.onboardingForm.getFormArray(slotName);
        formArray.clear();
      }
      this.vendorDetails.onboardingDetails.timeSlots.forEach((slot, j) => {
        const formArray = this.onboardingForm.getFormArray(slot['slotName']);
        this.onboardingForm.addSlot(slot['slotName'])
        formArray.at(formArray.length - 1).patchValue({ ...slot });
      })
      if (this.disableAll) this.onboardingForm.onboardingForm.disable();
    })
  }

  /**
   * Method that makes API call to get Rider details 
   * for rider service
   */
  setRiderDetails() {
    this.vendorService.getRiderDetails(this.outletId).subscribe(res => {
      this.riderDetails = RiderDetails.fromJson(res['result']);
      const path = this.activeRoute.snapshot.url[0].path;
      if (path === 'create-vendor' && !this.riderStatusWithEditAccess.includes(this.riderDetails.approvalStatus)) {
        const dialogRef = this.dialog.open(ConfirmationModalComponent, {
          data:
          {
            title: 'Alert!!!',
            message: 'Invalid URL. Getting redirected to home page.',
            alert: true
          }
        });
        dialogRef.afterClosed().subscribe(response => {
          if (response) {
            this.router.navigate(['home/rider']);
          }
        })
        return;
      }
      if (path === 'view-vendor' && this.riderStatusWithEditAccess.includes(this.riderDetails.approvalStatus) && this.role === Roles.Partner) {
        const dialogRef = this.dialog.open(ConfirmationModalComponent, {
          data:
          {
            title: 'Alert!!!',
            message: 'Invalid URL. Getting redirected to home page.',
            alert: true
          }
        });
        dialogRef.afterClosed().subscribe(response => {
          if (response) {
            this.router.navigate(['home/rider']);
          }
        })
        return;
      }
      this.currentRiderStatus = this.riderDet.currentRiderStatus = this.riderDetails.approvalStatus;

      this.riderDet.riderDetailsForm.patchValue({ ...this.riderDetails })
    })
  }
  /**
   * Method that shows confirmation dialog on refresh page or on closing of tab 
   * @param event 
   */
  @HostListener("window:beforeunload")
  reloadHandler(event: Event) {
    if (this.currentOutletStatus === 'draft' || (this.currentOutletStatus === 'approvalPending' && this.role !== Roles.Partner)) {
      event.stopPropagation();
    }
  }

  /**
   * Method that goes to next or previous form 
   * based on flag passed
   * @param flag 
   * @returns void
   */
  switchTab(flag: string) {
    if (this.step !== 2) { // bcoz commission and onboarding page doesn't have formGroup
      this.currentPreviousForm[this.step][0].markAsPristine();
    }
    if (flag === 'back') {
      this.goPrevious();
      return;
    }
    if (this.draftSection <= this.step) {
      this.draftSection = this.step;
    }
    this.goNext();
  }

  /**
   * Method that goes to particular form by clicking on navbar
   * @param tab 
   */
  goToSelectedTab(tab: number) {
    if (this.checkbox.nativeElement.checked) {
      this.checkbox.nativeElement.checked = false;
    }
    if (!this.currentPreviousForm[this.step][0].valid && this.step <= tab && !this.disableAll && this.step !== 2) {
      this.currentPreviousForm[this.step][0].markAllAsTouched();
    }
      else if (!this.currentPreviousForm[this.step][0].valid && this.step <= tab && !this.disableAll && this.step === 2){
        this.toastMsgService.showWarning('Kindly subscribe to contiune');

      }
    else if (this.draftSection < tab && this.step !== this.draftSection && tab - 1 !== this.draftSection) { //this.step !== this.draftSection
      this.toastMsgService.showWarning(`Kindly save ${this.currentTab[this.draftSection + 1]} page data first`);
    }
    else if (this.draftSection < tab && this.step === this.draftSection && tab - 1 !== this.draftSection) {
      this.toastMsgService.showWarning(`Kindly fill up ${this.currentTab[tab - 1]} page`);
    }
    else if (this.currentPreviousForm[this.step][0].dirty) {
      const dialogRef = this.dialog.open(ConfirmationModalComponent, {
        data:
        {
          title: 'Are you sure?',
          message: 'Changes are not saved. Do you still want to continue?'
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.step = tab;
        }
      })
    }
    else if (!this.currentPreviousForm[tab][1].valid && !this.disableAll) {
      this.toastMsgService.showWarning(`Kindly fill up ${this.currentTab[tab - 1]} page`)
    } else {
      this.step = tab;
    }
  }

  /**
   * Method that goes to next form
   */
  goNext() {
    if (this.step < (Object.keys(this.currentTab).length - 1)) {
      this.step++;
    }
  }

  /**
   * Method that goes to previous form
   */
  goPrevious() {
    if (this.step > 0) {
      this.step--
    } else {
      this.goToVendorsPage();
    }
  }

  /**
  * Method that allows to go at vendors page 
  */
  goToVendorsPage() {
    if (this.currentOutletStatus === 'draft' || (this.currentOutletStatus === 'approvalPending' && this.role !== Roles.Partner)) {
      const dialogRef = this.dialog.open(ConfirmationModalComponent, {
        data:
        {
          title: 'Are you sure?',
          message: 'Unsaved data will be lost. Do you still want to continue?'
        }
      });
      dialogRef.afterClosed().subscribe(response => {
        if (response) {
          window.history.back();
        }
      })
    } else {
      window.history.back();
    }
  }

  /**
  * Method that allows to go at login 
  */
  logout() {
    if (this.currentOutletStatus === "draft" || (this.currentOutletStatus === 'approvalPending' && this.role !== Roles.Partner)) {
      const dialogRef = this.dialog.open(ConfirmationModalComponent, {
        data:
        {
          title: 'Are you sure?',
          message: 'Unsaved data will be lost. Do you still want to continue?'
        }
      });
      dialogRef.afterClosed().subscribe(response => {
        if (response) {
          this.role === Roles.Partner ? this.router.navigate(['login']) : this.router.navigate(['admin']);
          localStorage.clear();
        }
      })
    } else {
      this.role === Roles.Partner ? this.router.navigate(['login']) : this.router.navigate(['admin']);
      localStorage.clear();
    }

  }
}