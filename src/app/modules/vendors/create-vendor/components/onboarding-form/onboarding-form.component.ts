import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { Cuisine, maxFileSizeAllowed, OutletStatus, PackagingChargesTypes, packagingChargesTypesList, Roles, Services, SlotNames, TimeSlotTypes, TimeSlotTypesList } from 'src/app/shared/models/constants/vendor-registration-types';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
import { CongratulationsDialogComponent } from '../congratulations-dialog/congratulations-dialog.component';


@Component({
  selector: 'app-onboarding-form',
  templateUrl: './onboarding-form.component.html',
  styleUrls: ['./onboarding-form.component.scss']
})
export class OnboardingFormComponent implements OnInit {

  readonly packagingChargesTypesList = packagingChargesTypesList;
  packagingChargesFields: PackagingChargesTypes;
  selectedTime: string;
  isOpen = false;

  readonly timeSlotTypesList = TimeSlotTypesList;

  // docType = [
  //   { id: 'image', name: 'Image' },
  //   { id: 'document', name: 'Document' }
  // ];

  itemPackagingChargesSlab = [
    { minPrice: 0, maxPrice: 50, maxCharges: 5 },
    { minPrice: 51, maxPrice: 150, maxCharges: 7 },
    { minPrice: 151, maxPrice: 300, maxCharges: 10 },
    { minPrice: 301, maxPrice: 500, maxCharges: 15 },
    { minPrice: 501, maxPrice: 10000, maxCharges: 20 },
  ]
  days: Map<SlotNames, string> = new Map<SlotNames, string>();
  cuisines: Cuisine[];
  speedyyAccountManagersList: {id: string, name: string}[] = [];
  showDayTypeHeading = true;
  outletId: string;
  outletName: string;
  allowedFileExtn = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'odt', 'pdf'];
  showCompleteBtn: boolean = true;
  currentOutletStatus: OutletStatus;
  allowedUploadFormat: string;
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }
  intermediateFileName: string;
  docUploadFormArrayName: string;
  docUploadFormControlName: string;
  docUploadFormControlIndex: number;
  service: string;
  readonly Services = Services;
  @Input() disableAll: boolean;
  @Output() changeTab = new EventEmitter<string>();

  onboardingForm = new FormGroup({
    speedyyAccountManager: new FormControl(null,[Validators.required]),
    packagingChargesType: new FormControl(null, [Validators.required]),
    orderLevelPackagingCharges: new FormControl('', [Validators.required]),
    customItemLevalPackagingCharges: new FormControl({ disabled: true, value: false }, [Validators.required]),
    itemRows: this.formBuilder.array([]),
    cuisineType: new FormControl(null, [Validators.required]),
    cost: new FormControl('', [Validators.required, Validators.pattern("[0-9]*")]),
    prepTime: new FormControl('', [Validators.required, Validators.pattern("[0-9]*"), Validators.min(10), Validators.max(120)]),
    isPureVeg: new FormControl(true, [Validators.required]),
    // menuDocType: new FormControl(null, [Validators.required]),
    menuRows: this.formBuilder.array([this.initMenuRows()]),
    slotType: new FormControl(null, [Validators.required]),
    slotDays: new FormGroup({}), // will add form arrays dynamically based on slotType selection
    agreedSpeedyyChargePercentage: new FormControl(null,[Validators.required])
  });

  constructor(private formBuilder: FormBuilder, private activeRoute: ActivatedRoute, private dialog: MatDialog,
    private snackBar: MatSnackBar, private vendorService: VendorRegistrationService, private toastMsgService: ToastService,
    private router: Router, private authenticationService: AuthenticationService) {
    this.outletId = this.activeRoute.snapshot.paramMap.get('outletId');

  }

  ngOnInit(): void {

    this.service = this.vendorService.service;
    if (this.disableAll) {
      this.onboardingForm.disable();
    }
    if(this.service !== Services.Grocery)
    this.setCuisineList();
  
    this.vendorService.role === 'partner' 
      ? this.setSpeedyyAccountManagerList() : this.setSpeedyyAccountManagerListForAdmin();

    /**
     *   passing onboarding form data to vendor service when whole form is valid
     *   by subscribing to valueChanges property
    */
    this.onboardingForm.valueChanges.pipe(filter(() => this.onboardingForm.status !== 'INVALID'))
      .subscribe(() => {
        const val = this.onboardingForm.getRawValue();
        for (const v in val) {
          this.vendorService.onboardingDetails[v] = val[v];
        }
      })

    if (this.authenticationService.role !== Roles.Partner) {
      this.showCompleteBtn = false;
    }
    this.onboardingForm.get('agreedSpeedyyChargePercentage').disable();
    if(this.service !== Services.Food){
      this.onboardingForm.get('cost').disable();
    }
    if (this.service === Services.Grocery) {
      this.onboardingForm.get('cuisineType').disable();
      // this.onboardingForm.get('prepTime').disable();
      this.onboardingForm.get('isPureVeg').disable();
      this.onboardingForm.get('agreedSpeedyyChargePercentage').enable();
    }
  }


  /**
   * Method that calls cuisine list API from vendor registration service
   */
  setCuisineList() {
      this.vendorService.getCuisineList().subscribe(
        res => {
          this.cuisines = [];
          for (const c of res['result']) {
            this.cuisines.push(Cuisine.fromJson(c));
          }
        }
        )
  }

  /**
   * Method that sets acc managers list for partner role
   */
  setSpeedyyAccountManagerList() {
    this.vendorService.getSpeedyyAccountManagers().subscribe(res => {
      this.speedyyAccountManagersList = res['result']['speedyy_account_managers']
        .map(record => ({id: record.id, name: record.full_name}));
    })
  }

  /**
   * Method that sets acc managers list for admin role
   */
  setSpeedyyAccountManagerListForAdmin() {
    const data = {
      pagination: {
        page_index: 0,
        page_size: 50
      }
    }
    this.vendorService.getSpeedyyAccountManagersForAdmin(data).subscribe(res => {
      this.speedyyAccountManagersList = res['result']['records']
        .map(record => ({id: record.id, name: record.full_name}));
    })
  }

  /**
   * Method that sets allowed file extns to upload file based on parameter passed
   * @param docType 
  */
  // uploadFileTypeChange(docType: string) {
  //   if (docType === 'image') {
  //     this.allowedFileExtn = ['jpg','jpeg','png','doc','docx','odt','pdf'];
  //     this.allowedUploadFormat = '(.jpg, .jpeg, .png .doc, .docx, .odt, .pdf upto 2 MB only)';
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
  getFileUploadUrl(file: FileList, formArrayName: string, controlName: string, i: number) {
    const index = (file.item(0).name.lastIndexOf('.'))
    const fileExtn = file.item(0).name.substring(index + 1).toLowerCase();
    // if (formArrayName === 'menuRows' && !this.onboardingForm.get(`${controlName}Type`).valid) {
    //   this.toastMsgService.showWarning('Kindly select file type');
    //   return;
    // }
    if (formArrayName === 'menuRows' && !this.allowedFileExtn.includes(fileExtn)) return this.toastMsgService.showError('Kindly choose correct file');

    if (formArrayName === 'itemRows' && !['jpg', 'jpeg', 'png'].includes(fileExtn)) return this.toastMsgService.showError('Kindly choose correct file');

    if (file.item(0).size > maxFileSizeAllowed) return this.toastMsgService.showError('Kindly check the size of the file');

    this.vendorService.getFileUploadUrl(fileExtn).subscribe(
      res => {
        this.docUploadFormArrayName = formArrayName;
        this.docUploadFormControlName = controlName;
        this.docUploadFormControlIndex = i;
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
        this.onboardingForm['controls'][this.docUploadFormArrayName]['controls'][this.docUploadFormControlIndex]
        ['controls'][this.docUploadFormControlName].setValue(this.intermediateFileName);
      }
    );
  }

  /**
   * Method that open uploaded file in new tab
   * @param controlName 
   * @param i 
   */
  viewFile(formArrayName: string, controlName: string, i: number) {
    window.open(this.onboardingForm['controls'][formArrayName]['controls'][i]['controls'][controlName].value);
  }

  get itemArr() {
    return this.onboardingForm.get('itemRows') as FormArray;
  }

  /**
   * Method that creates new formGroup for item array
   * @returns formGroup
   */
  initItemRows() {
    return this.formBuilder.group({
      itemName: new FormControl('', [Validators.required]),
      itemPrice: new FormControl('', [Validators.required, Validators.pattern("[0-9]*")]),
      itemPackagingCharges: new FormControl('', [Validators.required, Validators.pattern("[0-9]*")]),
      itemDoc: new FormControl('', [Validators.required]),
      itemDocUrl: new FormControl()
    }, { validators: [this.customItemPackagingChargesValidator()] });
  }

  customItemPackagingChargesValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const itemPrice = group['controls']['itemPrice']['value'];
      const itemPackagingCharges = group['controls']['itemPackagingCharges']['value'];

      if (itemPrice && itemPackagingCharges) {
        for (const i of this.itemPackagingChargesSlab) {
          if (itemPrice >= i['minPrice'] && itemPrice <= i['maxPrice']) {
            if (itemPackagingCharges > i['maxCharges']) {
              group['controls']['itemPackagingCharges'].setErrors({ ...{ 'itemPackagingCharges': true } })
            } else {
              group['controls']['itemPackagingCharges'].setErrors(null)
            }
          }
        }
      }
      return
    }

  }

  /**
   * Method that adds newly created formGroup to the formArray 
   */
  addItem() {
    this.itemArr.push(this.initItemRows());
  }

  /**
    * Method that deletes control from item array
    * @param index 
    */
  deleteItem(index: number) {
    if (this.itemArr.controls.length > 1) {
      this.itemArr.removeAt(index);
    }
  }

  get menuArr() {
    return this.onboardingForm.get('menuRows') as FormArray;
  }

  /**
   * Method that creates new formGroup for menu array
   * @returns formGroup
   */
  initMenuRows() {
    return this.formBuilder.group({
      menuDoc: new FormControl('', [Validators.required]),
      menuDocUrl: new FormControl()
    });
  }

  /**
  * Method that adds newly created formGroup to the formArray 
  */
  addMenu() {
    this.menuArr.push(this.initMenuRows());
  }

  /**
   * Method that deletes control from menu array
   * @param index 
   */
  deleteMenu(index: number) {
    if (this.menuArr.controls.length > 1) {
      this.menuArr.removeAt(index);
    }
  }

  /**
   * Method that shows diff fields based on selection
   * @param event 
   */
  packagingChargesTypeChange(event: PackagingChargesTypes) {
    this.packagingChargesFields = event;
    if (event === 'item') {
      // this.addItem();
      this.onboardingForm['controls']['customItemLevalPackagingCharges'].enable();
      this.onboardingForm['controls']['orderLevelPackagingCharges'].disable();
    } else if (event === 'order') {
      this.onboardingForm['controls']['orderLevelPackagingCharges'].enable();
      this.onboardingForm['controls']['customItemLevalPackagingCharges'].disable();
      this.onboardingForm['controls']['customItemLevalPackagingCharges'].setValue(false);
      this.itemArr.clear();
    } else {
      this.onboardingForm['controls']['orderLevelPackagingCharges'].disable();
      this.onboardingForm['controls']['customItemLevalPackagingCharges'].disable();
      this.onboardingForm['controls']['customItemLevalPackagingCharges'].setValue(false);
      this.itemArr.clear();
    }
  }

  customItemPackagingChargesSelectionChange() {
    if (this.onboardingForm['controls']['customItemLevalPackagingCharges']['value']) {
      this.addItem();
    } else {
      this.itemArr.clear();
    }
  }

  /**
   * Method that create diff formArray for opening and closing time based
   * on selection
   * @param dayType 
   */
  slotTypeSelectionChange(dayType: TimeSlotTypes) {

    const fg = this.onboardingForm.get('slotDays') as FormGroup;
    for (const slotName of this.days.keys()) {
      fg.removeControl(slotName);
    }

    if (dayType === 'all') {
      this.days = new Map<SlotNames, string>([
        ['all', 'alldays'],
      ]);
      this.showDayTypeHeading = false;
    } else if (dayType === 'weekdays_and_weekends') {
      this.days = new Map<SlotNames, string>([
        ['weekdays', 'weekdays'],
        ['weekends', 'weekend']
      ]);
      this.showDayTypeHeading = true;
    } else if (dayType === 'custom') {
      this.days = new Map([
        ['mon', 'monday'],
        ['tue', 'tuesday'],
        ['wed', 'wednesday'],
        ['thu', 'thursday'],
        ['fri', 'friday'],
        ['sat', 'saturday'],
        ['sun', 'sunday']
      ]);
      this.showDayTypeHeading = true;
    }
    this.createSlotControls();
  }

  /**
   * Method that returns formgroup with 2 formControls
   * @returns 
   */
  initSlot() {
    return this.formBuilder.group({
      openingHours: new FormControl(),
      closingHours: new FormControl(),
    }, { validators: [this.customTimeValidator] })
  }

  /**
   * Method that creates form arrays based on slotType selection
   */
  createSlotControls() {
    const fg = this.onboardingForm.get('slotDays') as FormGroup;
    for (const slotName of this.days.keys()) {
      fg.addControl(slotName, this.formBuilder.array([this.initSlot()]))
    }
  }

  /**
   * Method that adds formGroup of slot in a particular formArray
   * @param event 
   */
  addSlot(event: SlotNames) {
    const arr = this.getFormArray(event);
    if (arr.controls.length < 3) {
      arr.push(this.initSlot())
    }
  }

  /**
   * Method that delete time slot based on parameter
   * @param event 
   * @param index 
   */
  deleteSlot(event: SlotNames, index: number) {
    const arr = this.getFormArray(event);
    if (arr.controls.length > 1) {
      arr.removeAt(index);
    }
  }

  /**
   * Method that checks if slot is available in formarray
   * @param event 
   * @returns 
   */
  checkSlotControlExistInArray(event: SlotNames) {
    const arr = this.getFormArray(event);
    return arr.length;
  }

  /**
 * Method that returns formArray based on parameter passed
 * @param event 
 * @returns 
 */
  getFormArray(event: SlotNames) {
    return this.onboardingForm['controls']['slotDays']['controls'][event] as FormArray
  }

  /**
   * Method that checks validity of form and emits event
   * to go to next page
   */
  next() {
    if (this.onboardingForm.status === 'INVALID') {
      this.onboardingForm.markAllAsTouched();
      this.toastMsgService.showError(`Kindly fill up all the fields`);
    }
    else if (this.customValidatorForAllSlots()){
      const formData = this.vendorService.onboardingDetails.toJson(this.vendorService.service);
      this.vendorService.saveOutletDetails(this.outletId, formData).subscribe(res => {
        this.vendorService.submitOutletDetails(this.outletId).subscribe(res => {
            const dialogRef = this.dialog.open(CongratulationsDialogComponent, { data: 'under review' });
            this.changeTab.emit();
          });
      });
    }
  }

  /**
   * Method that sends comments and approve or reject service
   * @param flag 
   * @returns 
   */
  sendComments(flag: boolean) {
    this.outletName = this.vendorService.outletDetails.outletName;

    if (!this.vendorService.remarks) {
      this.toastMsgService.showWarning('Kindly add remarks');
      return;
    }

    let message = '';
    flag ? message = `Do you want to approve the outlet: ${this.outletName}?` : message = `You are about to reject the outlet.  ${this.outletName}?`;

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data:
      {
        title: 'Are you sure?',
        message: message
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {

        this.vendorService.approveOutlet(this.outletId, flag).subscribe(
          res => {
            window.history.back();
          }
        )
      }
    })
  }

  /**
   * 
   * @param fg Method that validates opening and closing time
   */
  customTimeValidator(fg: AbstractControl) {
    if (fg['controls']['openingHours']['value'] && fg['controls']['closingHours']['value']) {
      let openingTime = moment(fg['controls']['openingHours']['value'], 'h:mm a').format('HH:mm');
      let closingTime = moment(fg['controls']['closingHours']['value'], 'h:mm a').format('HH:mm');

      if (openingTime >= closingTime) {
        fg['controls']['openingHours'].setErrors({ ...{ 'openingTimeMore': true } })
      } else {
        fg['controls']['openingHours'].setErrors(null)
      }
    }
  }

  /**
   * Method that validates all slots of opening and closing hours
   * @returns boolean
   */
  customValidatorForAllSlots() {
    for (const slotName of this.days.keys()) {
      const arr = this.getFormArray(slotName);
      for (let i = 0; i < arr['controls'].length - 1; i++) {
        const nextSlotOpeningHours = moment(arr['controls'][i + 1]['controls']['openingHours']['value'], 'h:mm a').format('HH:mm');
        const CurrentSlotclosingHours = moment(arr['controls'][i]['controls']['closingHours']['value'], 'h:mm a').format('HH:mm');
        if (nextSlotOpeningHours && CurrentSlotclosingHours && (nextSlotOpeningHours <= CurrentSlotclosingHours)) {
          this.toastMsgService.showError('Opening hours in each slot should be greater than closing hour in previous slot')
          return false;
        }
      }
    }
    return true;
  }

  /**
  * Method that emits event to go to previous page
  */
  previous() {
    this.changeTab.emit('back')
  }

  /**
   * Method that navigates to home page
   */
  goToHome() {
    window.history.back();
  }

}