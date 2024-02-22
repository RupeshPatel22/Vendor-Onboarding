import * as moment from 'moment';
export interface IApiEndPoint {
  service: string;
  prefix?: string;
}
export enum Services {
  Food = 'Food',
  Grocery = 'Grocery',
  Rider = 'Rider',
  Pharmacy = 'Pharmacy',
  Paan = 'Paan',
  Flower = 'Flower',
  Pet = 'Pet',
}
export enum Roles {
  Partner = 'partner',
  Admin = 'admin'
}
export enum FormsList {
  OutletDetails = 'Outlet Details',
  FssaiDetails = 'FSSAI Details',
  SubcriptionDetails = 'Subcription & Onboarding',
  OwnerLocationDetails = 'Owner & Location Details',
  GstPanDetails = 'GST & PAN Details',
  BankDetails = 'Bank Details',
  ESignDetails = 'E-Sign',
  OnboardingDetails = 'Onboarding Form',
  RiderDetails = 'Rider Details'
}
export const FormsToShowForService: { [key in FormsList]: string[] } = {
  [FormsList.OutletDetails]: [Services.Food, Services.Grocery, Services.Pharmacy,Services.Paan, Services.Flower, Services.Pet],
  [FormsList.FssaiDetails]: [Services.Food, Services.Grocery, Services.Pharmacy,Services.Paan, Services.Flower, Services.Pet],
  [FormsList.SubcriptionDetails]: [Services.Food, Services.Grocery, Services.Pharmacy,Services.Paan, Services.Flower, Services.Pet],
  [FormsList.OwnerLocationDetails]: [Services.Food, Services.Grocery, Services.Pharmacy,Services.Paan, Services.Flower, Services.Pet],
  [FormsList.GstPanDetails]: [Services.Food, Services.Grocery, Services.Pharmacy,Services.Paan, Services.Flower, Services.Pet],
  [FormsList.BankDetails]: [Services.Food, Services.Grocery, Services.Pharmacy,Services.Paan, Services.Flower, Services.Pet],
  [FormsList.ESignDetails]: [Services.Food, Services.Grocery, Services.Pharmacy,Services.Paan, Services.Flower, Services.Pet],
  [FormsList.OnboardingDetails]: [Services.Food, Services.Grocery, Services.Pharmacy,Services.Paan, Services.Flower, Services.Pet],
  [FormsList.RiderDetails]: [Services.Rider]
}
export const apiEndPoints: { [key in Services]: IApiEndPoint } = {
  [Services.Food]: { service: 'food', prefix: 'restaurant' },
  [Services.Grocery]: { service: 'grocery', prefix: 'store' },
  [Services.Rider]: { service: 'rider' },
  [Services.Pharmacy]: { service: 'pharmacy', prefix: 'outlet' },
  [Services.Paan]: { service: 'paan', prefix: 'outlet' },
  [Services.Flower]: { service: 'flower', prefix: 'outlet' },
  [Services.Pet]: { service: 'pet', prefix: 'outlet' },
}
export const gstCategoryList: { [key in Services]?: any } = {
  [Services.Food]: [{ id: 'restaurant', name: 'Restaurant' },
  { id: 'non-restaurant', name: 'Non-Restaurant' },
  { id: 'hybrid', name: 'Hybrid' }],
  [Services.Grocery]: [{ id: 'store', name: 'Store' },
  { id: 'non-store', name: 'Non-Store' },{ id: 'hybrid', name: 'Hybrid' }],
  [Services.Pharmacy]: [{ id: 'store', name: 'Store' },
  { id: 'non-store', name: 'Non-Store' },{ id: 'hybrid', name: 'Hybrid' }],
  [Services.Paan]: [{ id: 'store', name: 'Store' },
  { id: 'non-store', name: 'Non-Store' },{ id: 'hybrid', name: 'Hybrid' }],
  [Services.Flower]: [{ id: 'store', name: 'Store'},
   { id: 'non-store', name: 'Non-Store'}, { id: 'hybrid', name: 'Hybrid'}],
   [Services.Pet]: [{ id: 'store', name: 'Store'},
  { id: 'non-store', name: 'Non-Store'}, { id: 'hybrid', name: 'Hybrid'}],
}
export const tabList: { [key: number]: string } = {
  0: FormsList.OutletDetails,
  1: FormsList.FssaiDetails,
  2: FormsList.SubcriptionDetails,
  3: FormsList.OwnerLocationDetails,
  4: FormsList.GstPanDetails,
  5: FormsList.BankDetails,
  6: FormsList.ESignDetails,
  7: FormsList.OnboardingDetails,
};
export const RiderTabList: { [key: number]: string } = {
  0: FormsList.RiderDetails
};
export type OutletStatus = 'draft' | 'approvalPending' | 'catalogPending' | 'approvalRejected' | 'active' | 'disable';
export const OutletStatusList: {[key in OutletStatus]: string} = {
  draft: 'Draft',
  approvalPending: 'Approval Pending',
  catalogPending: 'Catalog Pending',
  approvalRejected: 'Approval Rejected',
  active: 'Active',
  disable: 'Disabled'
}

export const ApprovalPendingOutletStatuses: OutletStatus[] = ['approvalPending'];

export const HistoryOutletStatuses: OutletStatus[] = ['catalogPending', 'approvalRejected', 'active', 'disable'];

export type RiderStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export const RiderStatusList: {[key in RiderStatus]: string} = {
  draft: 'Draft',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const OutletCardStatusList: {[key in OutletStatus | RiderStatus]: string} = {
 ...OutletStatusList,
 ...RiderStatusList
}

export type PackagingChargesTypes = 'item' | 'order' | 'none';

export const packagingChargesTypesList: {[key in PackagingChargesTypes]: string} = {
  item: 'Item Level',
  order: 'Cart/Order Level',
  none: 'None'
} 

export type TimeSlotTypes = 'all' | 'weekdays_and_weekends' | 'custom';

export const TimeSlotTypesList: {[key in TimeSlotTypes]: string} = {
  all: 'All Days',
  weekdays_and_weekends: 'Weekdays and Weekends',
  custom: 'Custom'
}

export type SlotNames = 'all' | 'weekdays' | 'weekends' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type OutletTypes = 'restaurant' | 'tea_and_coffee' | 'bakery';
export const outletTypesList: {[key in OutletTypes]: string} = {
  restaurant: 'Restaurant',
  tea_and_coffee: 'Tea & Coffee',
  bakery: 'Bakery'
}

export const maxFileSizeAllowed = 20971520 // 20 MB in bytes
export const allowRouteAccessTo: { [key: string]: Roles[] } = {
  '/': [],
  '/home/food': [Roles.Partner, Roles.Admin],
  '/home/food-history': [Roles.Admin],
  '/home/grocery': [Roles.Partner, Roles.Admin],
  '/home/grocery-history': [Roles.Admin],
  '/home/rider': [Roles.Admin],
  '/home/rider-history': [Roles.Admin],
  '/vendors/create-vendor': [Roles.Partner, Roles.Admin],
  '/vendors/view-vendor': [Roles.Partner, Roles.Admin],
  '/home/pharmacy': [Roles.Partner, Roles.Admin],
  '/home/pharmacy-history': [Roles.Admin],
  '/home/paan': [Roles.Partner, Roles.Admin],
  '/home/paan-history': [Roles.Admin],
  '/home/flower': [Roles.Partner, Roles.Admin],
  '/home/flower-history': [Roles.Admin],
  '/home/pet': [Roles.Partner, Roles.Admin],
  '/home/pet-history': [Roles.Partner, Roles.Admin],
}

export type VendorVerificationFields = 'ownerContact' | 'ownerEmail';

export class VendorVerificationProps {
  canSendOtp: boolean = true;
  sendOtpText: string = 'Send Otp';
  isVerified: boolean;
  timeLeft: number = 30;
  interval: any;
}
export class City {
  id: string;
  name: string;
  static fromJson(data): City {
    const c: City = new City();
    c.id = data['id'];
    c.name = data['name'];
    return c
  }
}
export class Area {
  id: string;
  name: string;
  coordinates: any;
  status: string;
  static fromJson(data): Area {
    const c: Area = new Area();
    c.id = data['id'];
    c.name = data['name'];
    c.coordinates = data['coordinates'];
    c.status = data['status'];
    return c
  }
}
export class Cuisine {
  id: string;
  name: string;
  static fromJson(data): Cuisine {
    const c: Cuisine = new Cuisine();
    c.id = data['id'];
    c.name = data['name'];
    return c
  }
}
export class Language {
  id: string;
  name: string;
  static fromJson(data): Language {
    const c: Language = new Language();
    c.id = data['id'];
    c.name = data['name'];
    return c
  }
}
export class OutletDetails {
  outletName: string;
  city: string;
  area: string;
  branchName: string;
  // contactNumber: string;
  outletImageRows: IOutletImage[]; 
  // preferredLang: string[] = ['a4a3cd49-1bdd-40ba-bd03-fa5bbbb15ab9'];
  // receiveWhatsAppNotification: boolean = false;
  // sameAsContactNumber: boolean;
  // whatsAppNumber: string;
  outletDoc: string;
  outletDocUrl: string;
  // isContactNumberVerified: boolean;
  outletType: string;
  drugLicenseNumber: string;
  drugRetailDoc: string;
  drugRetailDocUrl: string;
  drugWholesaleDoc: string;
  drugWholesaleDocUrl: string;
  /**
   * Method that creates JSON object for outlet form data
   * @returns data
   */
  toJson(service: string) {
    const data = {};
    data['name'] = this.outletName;
    data['city_id'] = this.city;
    data['area_id'] = this.area;
    data['branch_name'] = this.branchName;
    // data['contact_number'] = `+91${this.contactNumber}`;
    // data['preferred_language_ids'] = (this.preferredLang);
    // data['recieve_whatsapp_message'] = this.receiveWhatsAppNotification;
    // if (this.receiveWhatsAppNotification) data['whatsapp_number'] = `+91${this.whatsAppNumber}`;
    data['image'] = { name: this.outletDoc }
    data['images'] = [];
    if(this.outletImageRows.length){
      const outletImages = [];
      for (const i of this.outletImageRows){
        const row = {};
        row['name'] = i['outletImage'];
        outletImages.push(row);
      }
      data['images'] = outletImages;
    }

    data['draft_section'] = "0";
    data['type'] = this.outletType;
    if(service === Services.Pharmacy) {
      data['drug_license_number'] = this.drugLicenseNumber;
      data['drug_retail_document'] = { name: this.drugRetailDoc };
      data['drug_wholesale_document'] = { name: this.drugWholesaleDoc };
    }
    return data;
  }
}
export class FssaiDetails {
  hasFssaiCertificate: boolean;
  fssaiExpirationDate: string;
  fssaiRegisterNumber: string;
  fssaiAcknowledgementNumber: string;
  fssaiLicenseType: string
  fssaiDoc: string;
  fssaiDocUrl: string;
  fssaiFirmName: string;
  fssaiAddress: string;
  isFssaiCertVerified: boolean;
  /**
 * Method that creates JSON object for FSSAI form data
 * @returns data
 */
  toJson() {
    const data = {};
    data['fssai_has_certificate'] = this.hasFssaiCertificate;
    if (this.hasFssaiCertificate) {
      data['fssai_expiry_date'] = this.convertDate(this.fssaiExpirationDate);
      data['fssai_cert_number'] = this.fssaiRegisterNumber;
      // data['fssai_cert_document_type'] = this.fssaiLicenseType;
      const doc = {
        name: this.fssaiDoc
      }
      data['fssai_cert_document'] = doc;
    } else {
      data['fssai_application_date'] = this.fssaiExpirationDate;
      data['fssai_ack_number'] = this.fssaiAcknowledgementNumber;
      // data['fssai_ack_document_type'] = this.fssaiLicenseType;
      const doc = {
        name: this.fssaiDoc
      }
      data['fssai_ack_document'] = doc;
    }
    data['fssai_firm_name'] = this.fssaiFirmName;
    data['fssai_firm_address'] = this.fssaiAddress;
    data['draft_section'] = "1";
    return data;
  }
  /**
   * Method that converts date format
   * @param date 
   * @returns 
   */
  convertDate(date) {
    return moment(date).format('YYYY-MM-DD')
  }
}
export class OwnerLocationDetails {
  position: string;
  ownerName: string;
  ownerContactNumber: string;
  ownerEmailId: string;
  isOwnerContactNumberVerified:boolean;
  isOwnerEmailIdVerified:boolean;
  managerName: string;
  managerContactNumber: string;
  managerEmailId: string;
  // isManagerContactNumberVerified: boolean;
  // isManagerEmailIdVerified: boolean;
  invoiceEmailId: string;
  // isInvoiceEmailIdVerified: boolean;
  location: string;
  latitude: number;
  longitude: number;
  postalCode: string;
  state: string;
  ownerManager: boolean;
  // sameAsContactNumber: boolean;
  sameAsOwnerEmailId: boolean;
  // isPostalCodeVerified: boolean = true;
  searchLocation: string;
  pocList: IPocList[] = [];
  /**
   * Method that creates JSON object for owner/location form data
   * @returns data
   */
  toJson() {
    const data = {};
    data['user_profile'] = 'owner';
    data['owner_name'] = this.ownerName;
    data['owner_contact_number'] = `+91${this.ownerContactNumber}`;
    data['owner_email'] = this.ownerEmailId;
    if (!this.ownerManager) {
      data['manager_name'] = this.managerName;
      data['manager_contact_number'] = `+91${this.managerContactNumber}`;
      data['manager_email'] = this.managerEmailId;
    }
    data['owner_is_manager'] = this.ownerManager
    data['poc_list'] = this.pocList.map((pocItem) => {
      return {
        name: pocItem.name,
        number: pocItem.pocNumber,
        is_primary: pocItem.isPrimary,
        designation: pocItem.designation
      };
    });
    data['invoice_email'] = this.invoiceEmailId;
    data['location'] = this.location;
    data['postal_code'] = this.postalCode;
    data['state'] = this.state;
    data['lat'] = this.latitude;
    data['long'] = this.longitude;
    data['draft_section'] = "3";
    return data;
  }
}
export class GstPanDetails {
  gstCategory: string;
  pan: string;
  // panVerified: boolean = true;
  panOwnerName: string;
  // panDocType: string;
  panDoc: string;
  panDocUrl: string;
  hasGST: boolean;
  gstNumber: string;
  // gstDocType: string;
  gstDoc: string;
  gstDocUrl: string;
  businessEntityName: string;
  businessEntityAddress: string;
  isPanVerified: boolean;
  isGstVerified: boolean;
  hasRegistration: boolean;
  registrationNumber: string;
  registrationDocument: string;
  /**
   * Method that creates JSON object for gst/pan details form data
   * @returns data
   */
  toJson() {
    const data = {};
    data['gst_category'] = this.gstCategory;
    data['pan_number'] = this.pan;
    // data['pan_number_verified'] = this.panVerified
    data['pan_owner_name'] = this.panOwnerName;
    // data['pan_document_type'] = this.panDocType;
    const doc = {
      name: this.panDoc
    }
    data['pan_document'] = doc;
    if (this.hasGST) {
      data['has_gstin'] = this.hasGST;
      data['gstin_number'] = this.gstNumber;
      // data['gstin_document_type'] = this.gstDocType;
      const doc = {
        name: this.gstDoc
      }
      data['gstin_document'] = doc;
    } else {
      data['has_gstin'] = this.hasGST;
      data['business_name'] = this.businessEntityName;
      data['business_address'] = this.businessEntityAddress;
    }
    data['has_registration'] = this.hasRegistration;
    if(this.hasRegistration){
      data['registration_number'] = this.registrationNumber;
      const regdoc = {
        name: this.registrationDocument
      }
      data['registration_document'] = regdoc;
    }
    data['draft_section'] = "4";
    return data;
  }
}
export class BankDetails {
  beneficiaryName: string;
  accountNumber: string;
  ifscCode: string;
  // bankDocType: string;
  // kycDocType: string;
  bankDoc: string;
  bankDocUrl: string;
  kycDoc: string;
  kycDocUrl: string;
  isIfscVerified: boolean;
  /**
   * Method that creates JSON object for bank details form data
   * @returns data
   */
  toJson() {
    const data = {};
    data['beneficiary_name'] = this.beneficiaryName;
    data['bank_account_number'] = this.accountNumber;
    data['ifsc_code'] = this.ifscCode;
    // data['bank_document_type'] = this.bankDocType;
    const doc = {
      name: this.bankDoc
    }
    data['bank_document'] = doc;
    // data['kyc_document_type'] = this.kycDocType;
    const kycdoc = {
      name: this.kycDoc
    }
    data['kyc_document'] = kycdoc;
    data['draft_section'] = "5";
    return data
  }
}
export class ESignDetails {
  contactNumber: string;
  readMou: boolean;
  isContactNumberVerified: boolean;
  /**
   * Method that creates JSON object for e-sign details form data
   * @returns data
   */
  toJson() {
    const data = {};
    data['document_sign_number'] = `+91${this.contactNumber}`;
    data['read_mou'] = this.readMou;
    data['draft_section'] = "6";
    return data
  }
}
export class OnboardingDetails {
  packagingChargesType: PackagingChargesTypes;
  orderLevelPackagingCharges: string;
  itemRows: IPackingChargesItemLevel[];
  customItemLevalPackagingCharges: boolean;
  cuisineType: string[];
  cost: string;
  prepTime: string;
  isPureVeg: boolean;
  // menuDocType: string;
  menuRows: IMenuDocument[];
  slotType: TimeSlotTypes;
  slotDays: any;
  timeSlots: ITimeSlot[] = [];
  speedyyAccountManager: string;
  agreedSpeedyyChargePercentage: number;

  /**
   * Method that creates JSON object for onboarding form data
   * @returns data
   */
  toJson(service: string) {
    const data = {};
    data['speedyy_account_manager_id'] = this.speedyyAccountManager;
    data['packing_charge_type'] = this.packagingChargesType;
    if (this.packagingChargesType === 'item') {
      data['custom_packing_charge_item'] = this.customItemLevalPackagingCharges;
      
      if (this.customItemLevalPackagingCharges) {
        const rows = [];
        for (const i of this.itemRows) {
          const row = {}
          row['item_name'] = i['itemName'];
          row['item_price'] = i['itemPrice'];
          row['packing_charge'] = i['itemPackagingCharges'];
          row['packing_image'] = { name: i['itemDoc'] }
          rows.push(row)
        }
        data['packing_charge_item'] = rows;
      }
    } 
    else if (this.packagingChargesType === 'order') {
      data['packing_charge_order'] = { packing_charge: this.orderLevelPackagingCharges };
    }
    // data['menu_document_type'] = this.menuDocType;
    const menuDocs = [];
    for (const i of this.menuRows) {
      const row = {};
      row['name'] = i['menuDoc'];
      menuDocs.push(row);
    }
    data['menu_documents'] = menuDocs;
    if(service !== 'Food' && service !== 'Grocery') {
      data['cost_of_two'] = this.cost = '0';
    }
    if (service !== 'Grocery') {
      data['is_pure_veg'] = this.isPureVeg;
      data['cost_of_two'] = this.cost;
      data['default_preparation_time'] = this.prepTime;
      data['cuisine_ids'] = this.cuisineType;
    }
    data['scheduling_type'] = this.slotType;
    data['slot_schedule'] = [];
    for (const i in this.slotDays) { // here i will be type of SlotNames
      for (const j of this.slotDays[i]) {
        if (j['openingHours'] && j['closingHours']) {
          const slot = {};
          slot['slot_name'] = i;
          slot['start_time'] = this.convertDateToSendFormat(j['openingHours']);
          slot['end_time'] = this.convertDateToSendFormat(j['closingHours']);
          data['slot_schedule'].push(slot);
        }
      }
    }
    if(service === 'Grocery') {
      data['agreed_speedyy_charge_percentage'] = this.agreedSpeedyyChargePercentage;
    }
    data['draft_section'] = "6";
    return data
  }
  /**
   * Method that convert Time to send format
   * @param time 
   * @returns 
   */
   convertDateToSendFormat(time) {
    return moment(time, 'HH:mm').format('HHmm');
  }
}

export interface IPackingChargesItemLevel {
  itemName: string;
  itemPrice: number;
  itemPackagingCharges: number;
  itemDoc: string;
  itemDocUrl?: string;
}

export interface IOutletImage {
  outletImage: string;
  outletImageUrl?: string;
}

export interface IMenuDocument {
  menuDoc: string;
  menuDocUrl?: string;
}

export interface ITimeSlot {
  slotName?: SlotNames;
  openingHours: string;
  closingHours: string;
}

export class VendorDetails {
  status: OutletStatus;
  draftSection: string;
  outletDetails: OutletDetails = <OutletDetails>{};
  fssaiDetails: FssaiDetails = <FssaiDetails>{};
  tncAccepted: boolean;
  ownerLocationDetails: OwnerLocationDetails = new OwnerLocationDetails();
  gstPanDetails: GstPanDetails = <GstPanDetails>{};
  bankDetails: BankDetails = <BankDetails>{};
  eSignDetails: ESignDetails = <ESignDetails>{};
  onboardingDetails: OnboardingDetails = <OnboardingDetails>{};

  static fromJson(data: any): VendorDetails {
    const v: VendorDetails = new VendorDetails();

    v['status'] = data['status'];
    v['draftSection'] = data['draft_section'];

    // Outlet Details
    v['outletDetails']['outletName'] = data['name'];
    v['outletDetails']['city'] = data['city_id'];
    v['outletDetails']['area'] = data['area_id'];
    v['outletDetails']['branchName'] = data['branch_name'];
    // v['outletDetails']['contactNumber'] = data['contact_number']?.split('+91')[1];
    v['outletDetails']['receiveWhatsAppNotification'] = data['recieve_whatsapp_message'];
    v['outletDetails']['whatsAppNumber'] = data['whatsapp_number']?.split('+91')[1];
    // v['outletDetails']['preferredLang'] = data['preferred_language_ids'];
    // v['outletDetails']['isContactNumberVerified'] = data['contact_number_verified'];
    // if (data['contact_number'] && data['whatsapp_number'] && data['contact_number'] === data['whatsapp_number'])
    //   v['outletDetails']['sameAsContactNumber'] = true;
    if (data['images']){
      v['outletDetails']['outletImageRows'] = [];
      for (const i of data['images']){
        const images = <IOutletImage>{};
        images['outletImage'] = i['name'];
        images['outletImageUrl'] = i['url'];
        v['outletDetails']['outletImageRows'].push(images);
      }
    }
    v['outletDetails']['outletDoc'] = data['image']?.['name'];
    v['outletDetails']['outletDocUrl'] = data['image']?.['url'];
    v['outletDetails']['outletType'] = data['type'];
    v['outletDetails']['drugLicenseNumber'] = data['drug_license_number'];
    v['outletDetails']['drugRetailDoc'] = data['drug_retail_document']?.['name'];
    v['outletDetails']['drugRetailDocUrl'] = data['drug_retail_document']?.['url'];
    v['outletDetails']['drugWholesaleDoc'] = data['drug_wholesale_document']?.['name'];
    v['outletDetails']['drugWholesaleDocUrl'] = data['drug_wholesale_document']?.['url'];


    // FSSAI Details
    v['fssaiDetails']['hasFssaiCertificate'] = data['fssai_has_certificate'];
    if (data['fssai_has_certificate']) {
      v['fssaiDetails']['fssaiExpirationDate'] = data['fssai_expiry_date'];
      v['fssaiDetails']['fssaiRegisterNumber'] = data['fssai_cert_number'];
      // v['fssaiDetails']['fssaiLicenseType'] = data['fssai_cert_document_type'];
      v['fssaiDetails']['fssaiDoc'] = data['fssai_cert_document']?.['name'];
      v['fssaiDetails']['fssaiDocUrl'] = data['fssai_cert_document']?.['url'];
    } else {
      v['fssaiDetails']['fssaiExpirationDate'] = data['fssai_application_date'];
      v['fssaiDetails']['fssaiAcknowledgementNumber'] = data['fssai_ack_number'];
      // v['fssaiDetails']['fssaiLicenseType'] = data['fssai_ack_document_type'];
      v['fssaiDetails']['fssaiDoc'] = data['fssai_ack_document']?.['name'];
      v['fssaiDetails']['fssaiDocUrl'] = data['fssai_ack_document']?.['url'];
    }
    v['fssaiDetails']['fssaiFirmName'] = data['fssai_firm_name'];
    v['fssaiDetails']['fssaiAddress'] = data['fssai_firm_address'];
    v['fssaiDetails']['isFssaiCertVerified'] = data['fssai_cert_verified'];

    // Subscription and Onboarding
    v['tncAccepted'] = data['tnc_accepted'];

    // Owner/Location Details
    v['ownerLocationDetails']['ownerName'] = data['owner_name'];
    v['ownerLocationDetails']['ownerContactNumber'] = data['owner_contact_number']?.split('+91')[1];
    v['ownerLocationDetails']['ownerEmailId'] = data['owner_email'];
    v['ownerLocationDetails']['managerName'] = data['manager_name'];
    v['ownerLocationDetails']['managerContactNumber'] = data['manager_contact_number']?.split('+91')[1];
    v['ownerLocationDetails']['managerEmailId'] = data['manager_email'];
    v['ownerLocationDetails']['ownerManager'] = data['owner_is_manager'];
    v['ownerLocationDetails']['invoiceEmailId'] = data['invoice_email'];
    v['ownerLocationDetails']['searchLocation'] = data['location'];
    v['ownerLocationDetails']['location'] = data['location'];
    v['ownerLocationDetails']['postalCode'] = data['postal_code'];
    v['ownerLocationDetails']['state'] = data['state'];
    v['ownerLocationDetails']['latitude'] = data['lat'];
    v['ownerLocationDetails']['longitude'] = data['long'];
    data['owner_contact_number'] && data['owner_contact_number'] === data['contact_number']
      ? v['ownerLocationDetails']['sameAsContactNumber'] = true : v['ownerLocationDetails']['sameAsContactNumber'] = false;
    data['owner_email'] && data['owner_email'] === data['invoice_email']
      ? v['ownerLocationDetails']['sameAsOwnerEmailId'] = true : v['ownerLocationDetails']['sameAsOwnerEmailId'] = false;
    // v['ownerLocationDetails']['isPostalCodeVerified'] = data['postal_code_verified'];
    v['ownerLocationDetails']['isOwnerContactNumberVerified'] = data['owner_contact_number_verified'];
    v['ownerLocationDetails']['isOwnerEmailIdVerified']= data ['owner_email_verified'];
    // v['ownerLocationDetails']['isManagerContactNumberVerified']= data['manager_contact_number_verified'];
    v['ownerLocationDetails']['isManagerEmailIdVerified']= data['manager_email_verified'];
    v['ownerLocationDetails']['isInvoiceEmailIdVerified']= data['invoice_email_verified'];
    if (data['poc_list']) {
      v['ownerLocationDetails']['pocList'] = [];
      for (const i of data['poc_list']) {
          const poc = <IPocList>{};
          poc['name'] = i['name'];
          poc['pocNumber'] = i['number'];
          poc['isPrimary'] = i['is_primary'];
          poc['designation'] = i['designation'];
          v['ownerLocationDetails']['pocList'].push(poc);
      }
  }

    // GST/PAN Details
    v['gstPanDetails']['gstCategory'] = data['gst_category'];
    v['gstPanDetails']['pan'] = data['pan_number'];
    v['gstPanDetails']['panOwnerName'] = data['pan_owner_name'];
    // v['gstPanDetails']['panDocType'] = data['pan_document_type'];
    v['gstPanDetails']['panDoc'] = data['pan_document']?.['name'];
    v['gstPanDetails']['panDocUrl'] = data['pan_document']?.['url'];
    v['gstPanDetails']['hasGST'] = data['has_gstin'];
    v['gstPanDetails']['gstNumber'] = data['gstin_number'];
    // v['gstPanDetails']['gstDocType'] = data['gstin_document_type'];
    v['gstPanDetails']['gstDoc'] = data['gstin_document']?.['name'];
    v['gstPanDetails']['gstDocUrl'] = data['gstin_document']?.['url'];
    v['gstPanDetails']['hasRegistration'] = data['has_registration'];
    v['gstPanDetails']['registrationNumber'] = data['registration_number'];
    v['gstPanDetails']['registrationDocument'] = data['registration_document']?.['name'];
    v['gstPanDetails']['registrationDocUrl'] = data['registration_document']?.['url'];
    v['gstPanDetails']['businessEntityName'] = data['business_name'];
    v['gstPanDetails']['businessEntityAddress'] = data['business_address'];
    v['gstPanDetails']['isPanVerified'] = data['pan_number_verified'];
    v['gstPanDetails']['isGstVerified'] = data['gstin_number_verified'];

    // Bank Details
    v['bankDetails']['beneficiaryName'] = data['beneficiary_name'];
    v['bankDetails']['accountNumber'] = data['bank_account_number'];
    v['bankDetails']['ifscCode'] = data['ifsc_code'];
    // v['bankDetails']['bankDocType'] = data['bank_document_type'];
    v['bankDetails']['bankDoc'] = data['bank_document']?.['name'];
    v['bankDetails']['bankDocUrl'] = data['bank_document']?.['url'];
    // v['bankDetails']['kycDocType'] = data['kyc_document_type'];
    v['bankDetails']['kycDoc'] = data['kyc_document']?.['name'];
    v['bankDetails']['kycDocUrl'] = data['kyc_document']?.['url'];
    v['bankDetails']['isIfscVerified'] = data['ifsc_verified'];

    // E-Sign Details
    v['eSignDetails']['contactNumber'] = data['document_sign_number']?.split('+91')[1];
    v['eSignDetails']['readMou'] = data['read_mou'];
    v['eSignDetails']['isContactNumberVerified'] = data['document_sign_number_verified'];

    // Onboarding Details
    v['onboardingDetails']['speedyyAccountManager'] = data['speedyy_account_manager_id'];
    v['onboardingDetails']['packagingChargesType'] = data['packing_charge_type'];
    v['onboardingDetails']['customItemLevalPackagingCharges'] = data['custom_packing_charge_item'];
    if (v['onboardingDetails']['packagingChargesType'] === 'item' && v['onboardingDetails']['customItemLevalPackagingCharges']) {
      v['onboardingDetails']['itemRows'] = [];
      for (const i of data['packing_charge_item']) {
        const item = <IPackingChargesItemLevel>{};
        item['itemName'] = i['item_name'];
        item['itemPrice'] = i['item_price'];
        item['itemPackagingCharges'] = i['packing_charge'];
        item['itemDoc'] = i['packing_image']['name'];
        item['itemDocUrl'] = i['packing_image']['url'];
        v['onboardingDetails']['itemRows'].push(item);
      }
    } else if (v['onboardingDetails']['packagingChargesType'] === 'order') {
      v['onboardingDetails']['orderLevelPackagingCharges'] = data['packing_charge_order']['packing_charge'];
    }
    v['onboardingDetails']['cuisineType'] = data['cuisine_ids'];
    v['onboardingDetails']['cost'] = data['cost_of_two'];
    v['onboardingDetails']['isPureVeg'] = data['is_pure_veg'];
    v['onboardingDetails']['prepTime'] = data['default_preparation_time'];
    // v['onboardingDetails']['menuDocType'] = data['menu_document_type'];
    if (data['menu_documents']) {
      v['onboardingDetails']['menuRows'] = [];
      for (const i of data['menu_documents']) {
        const menu = <IMenuDocument>{};
        menu['menuDoc'] = i['name'];
        menu['menuDocUrl'] = i['url'];
        v['onboardingDetails']['menuRows'].push(menu);
      }
    }
    v['onboardingDetails']['slotType'] = data['scheduling_type'];
    v['onboardingDetails']['timeSlots'] = [];
    for (const i of data['time_slot']) {
      const slot = <ITimeSlot>{};
      slot['slotName'] = i['slot_name'];
      slot['openingHours'] = this.covertDate(i['start_time']);
      slot['closingHours'] = this.covertDate(i['end_time']);
      v['onboardingDetails']['timeSlots'].push(slot);
    }
    v['onboardingDetails']['agreedSpeedyyChargePercentage'] = data['agreed_speedyy_charge_percentage'];
    return v;
  }

  static covertDate(date: string) {
    return moment(date ,'HHmm').format('HH:mm');
  }
}

export class RiderDetails {
  approvalStatus: RiderStatus;
  riderName: string;
  riderType: string;
  riderContact: string;
  riderDob: string;
  riderPhotoDoc: string;
  riderPhotoUrl: string;
  panDoc: string;
  panDocUrl: string;
  aadharFrontDoc: string;
  aadharFrontUrl: string;
  aadharBackDoc: string;
  aadharBackUrl: string;
  drivingLicenseDoc: string;
  drivingLicenseUrl: string;
  cancelledChequeDoc: string;
  cancelledChequeUrl: string;
  accountNumber: string;
  ifscCode: string;

  static fromJson(data: any): RiderDetails {
    const r: RiderDetails = new RiderDetails();

    r['approvalStatus'] = data['approval_status'];
    r['riderName'] = data['name'];
    r['riderType'] = data['type'];
    r['riderContact'] = data['phone'];
    r['riderDob'] = moment(data['date_of_birth'], 'DD-MM-YYYY').format('YYYY-MM-DD'),
    r['riderPhotoDoc'] = data['image']?.['name'];
    r['riderPhotoUrl'] = data['image']?.['url'];
    r['panDoc'] = data['pan_card']['name'];
    r['panDocUrl'] = data['pan_card']['url'];
    r['aadharFrontDoc'] = data['adhar_card_front']['name'];
    r['aadharFrontUrl'] = data['adhar_card_front']['url'];
    r['aadharBackDoc'] = data['adhar_card_back']['name'];
    r['aadharBackUrl'] = data['adhar_card_back']['url'];
    r['drivingLicenseDoc'] = data['driver_license']['name'];
    r['drivingLicenseUrl'] = data['driver_license']['url'];
    r['cancelledChequeDoc'] = data['cancelled_cheque']['name'];
    r['cancelledChequeUrl'] = data['cancelled_cheque']['url'];
    r['accountNumber'] = data['bank_account_number'];
    r['ifscCode'] = data['bank_ifsc'];
    return r;
  }
}

export class OutletCard {
  id: string;
  name: string;
  status: OutletStatus | RiderStatus;
  approvedBy: string;
  updatedAt: string;
  imgUrl: string;
  service: Services;
  createdAt: string;
  branchName:string;
  outletType:string;

  static fromJson(data: any, service?: Services): OutletCard {
    const o: OutletCard = new OutletCard();

    o['id'] = data['id'];
    o['name'] = data['name'];
    o['status'] = data['status'] || data['approval_status'];
    o['approvedBy'] = data['approved_by_name'] || data['approved_admin_name'];
    o['updatedAt'] = data['updated_at'];
    o['imgUrl'] = data['image']?.['url'];
    o['service'] = service;
    o['createdAt'] = data['created_at'];
    o['branchName'] = data['branch_name'];
    o['outletType'] = data['type'];
    return o;
  }
}

export interface IPocList {
  name: string;
  pocNumber: number;
  isPrimary: string;
  designation: RestaurantPocDesignationTypes;
}
export type RestaurantPocDesignationTypes = 'owner' | 'customer_care' | 'manager';

export const RestaurantPocDesignation: {[key in RestaurantPocDesignationTypes]: string} = {
 owner: 'Owner',
 customer_care: 'Customer Care',
 manager: 'Manager'
}