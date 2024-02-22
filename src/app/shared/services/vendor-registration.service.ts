import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as apiUrls from '../../core/apiUrls';
import { Area, BankDetails, City, Cuisine, ESignDetails, FssaiDetails, GstPanDetails, Language, OnboardingDetails, OwnerLocationDetails, OutletDetails } from '../models/constants/vendor-registration-types';
import { AuthenticationService } from './authentication.service';
import { apiEndPoints } from '../models/constants/vendor-registration-types';
// import { isAbsolute } from 'path';
import { identifierModuleUrl, ThisReceiver, ThrowStmt } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class VendorRegistrationService {
  city: City[];
  area: Area[];
  cuisines: Cuisine[];
  language: Language[];
  document = [];
  outletDetails: OutletDetails = new OutletDetails();
  fssaiDetails: FssaiDetails = new FssaiDetails();
  ownerLocationDetails: OwnerLocationDetails = new OwnerLocationDetails();
  gstPanDetails: GstPanDetails = new GstPanDetails();
  bankDetails: BankDetails = new BankDetails();
  eSignDetails: ESignDetails = new ESignDetails();
  onboardingDetails: OnboardingDetails = new OnboardingDetails();
  vendorDetails;
  remarks: string;
  role: string;
  service: string;
  ownerContactNumber: BehaviorSubject<string> = new BehaviorSubject(null); //to display this number on e-sign page
  hasGST: BehaviorSubject<boolean> = new BehaviorSubject(null); //to show.hide gst declaration-btn on e-sign page
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.role = this.authenticationService.role;
  }
  /**
   * Method that get city list through API
   * @returns response
   */
  public getCityList(): Observable<any> {
    return this.http.get(apiUrls.getCityListEndPoint(this.role)).pipe(
      map((response) => {
        return response
      })
    )
  }
  /**
   * Method that get city list through API
   * @returns response
   */
  public getAreaList(cityId: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('city_id', `${cityId}`);
    return this.http.get(apiUrls.getAreaListEndPoint(this.role), { params }).pipe(
      map((response) => {
        return response
      })
    )
  }
  /**
   * Method that get cuisine list through API
   * @returns response
   */
  public getCuisineList(): Observable<any> {
    return this.http.get(apiUrls.getCuisineListEndPoint(this.role,apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that get language list through API
   * @returns response 
   */
  public getLanguageList(): Observable<any> {
    return this.http.get(apiUrls.getLanguageListEndPoint(this.role)).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets acc managers list for partner role
   * @returns 
   */
  getSpeedyyAccountManagers(): Observable<any> {
    return this.http.get(apiUrls.getSpeedyyAccountManagersEndPoint).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets acc managers list for admin role
   * @param data 
   * @returns 
   */
  getSpeedyyAccountManagersForAdmin(data): Observable<any> {
    return this.http.post(apiUrls.getSpeedyyAccountManagsForAdminEndPoint, data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that get documents of e-sign page through API
   * @returns response
   */
  public getDocuments(category: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('category', category);
    return this.http.get(apiUrls.getESignDocumentsEndPoint(this.role), { params }).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that gets file upload url to upload file
   * @param file 
   * @returns response
   */
  public getFileUploadUrl(fileExtn): Observable<any> {
    return this.http.get(apiUrls.fileUploadEndPoint(fileExtn)).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that upload file to aws-s3 bucket
   * @param uploadUrl 
   * @param file 
   * @returns 
   */
  public uploadFile(uploadUrl, file): Observable<any> {
    const headers = new HttpHeaders(
      {
        ignore_headers: 'true',
      },
    )
    return this.http.put(uploadUrl, file, { headers }).pipe(
      map(response => {
        return response
      })
    )
  }
  /**
   * Method that calls Send Otp API for business contact
   * @param id 
   * @param phone 
   * @returns boolean
   */
  public businessContactSendOtp(id: string, data): Observable<any> {
    return this.http.post(apiUrls.getBusinessContactSendOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['status'];
      })
    )
  }
  /**
   * Method that verify Otp of business contact
   * @param id 
   * @param phone 
   * @param otp 
   * @returns boolean
   */
  public businessContactVerifyOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.getBusinessContactVerifyOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['status'];
      })
    )
  }
  /**
   * Method that validates fssai registration number
   * @param fssai 
   * @param id
   * @returns boolean
   */
  public verifyFSSAI(id, fssaiCerificateNumber): Observable<any> {
    const formData = {};
    formData['fssai_cert_number'] = fssaiCerificateNumber
    return this.http.post(apiUrls.verifyFssaiCertificateEndPoint(id, apiEndPoints[this.service]), formData).pipe(
      map((response) => {
        return response['status'];
      })
    )
  }
  /**
   * Method that verify postal code
   * @param id 
   * @param postalCode 
   * @returns 
   */
  public verifyPostalCode(id, postalCode): Observable<any> {
    const formData = {};
    formData['postal_code'] = postalCode
    return this.http.post(apiUrls.verifyPostalCodeEndPoint(id, apiEndPoints[this.service]), formData).pipe(
      map((response) => {
        return response['status'];
      })
    )
  }
  /**
   * Method that verifies PAN Number
   * @param pan 
   * @param id
   * @returns boolean
   */
  public verifyPAN(id, pan): Observable<any> {
    const formData = {};
    formData['pan_number'] = pan
    return this.http.post(apiUrls.verifyPanEndPoint(id, apiEndPoints[this.service]), formData).pipe(
      map((response) => {
        return response['status'];
      })
    )
  }
  /**
   * Method that verifies GST Number
   * @param gst 
   * @param id
   * @returns boolean
   */
  public verifyGST(id, gstNumber): Observable<any> {
    const formData = {};
    formData['gstin_number'] = gstNumber
    return this.http.post(apiUrls.verifyGstinNumberEndPoint(id, apiEndPoints[this.service]), formData).pipe(
      map((response) => {
        return response['status'];
      })
    )
  }
  /**
   * Method that verifies IFSC code
   * @param ifsc 
   * @param id
   * @returns boolean
   */
  public verifyIFSC(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.verifyIfscCodeEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['status'];
      })
    )
  }
  /**
   * Method that calls Send OTP API for document signature
   * @param id 
   * @param phone 
   * @returns boolean
   */
  public docSignatureSendOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.getDocSignatureSendOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['status'];
      })
    )
  }
  /**
   * Method that verifies OTP for document signature
   * @param id 
   * @param phone 
   * @param otp 
   * @returns boolean
   */
  public docSignatureVerifyOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.getDocSignatureVerifyOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['status'];
      })
    )
  }
  /**
   * Method that send form data as draft 
   * @param id 
   * @param formData 
   * @returns boolean
   */
  public saveOutletDetails(id: string, formData): Observable<any> {
    formData['status'] = 'draft';
    return this.http.put(apiUrls.putOutletDetailsEndPoint(id, apiEndPoints[this.service]), formData).pipe(
      map((response) => {
        return response['status'];
      })
    )
  }
  /**
   * Method that gets vendor details through API
   * @param id 
   * @returns response
   */
  public getOutletDetails(id: string): Observable<any> {
    return this.http.get(apiUrls.getOutletDetailsByIdEndPoint(id, this.role, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that submit outlet details filled by user
   * @param id 
   * @returns boolean
   */
  public submitOutletDetails(id: string): Observable<any> {
    const data = "";
    return this.http.post(apiUrls.postOutletDetailsEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['status'];
      })
    )
  }
  /**
   * Method that gets outlets List
   * @returns response
   */
  public getOutletsList(service: string): Observable<any> {
    return this.http.get(apiUrls.getOutletsListEndPoint(apiEndPoints[service])).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that creates new outlets
   * @returns response
   */
  public createNewOutlet(data: any): Observable<any> {
    return this.http.post(apiUrls.postNewOutletEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that approve or reject outlet 
   * @param id 
   * @param flag 
   * @returns 
   */
  public approveOutlet(id: string, flag: boolean): Observable<any> {
    const formData = {};
    formData['approved'] = flag;
    formData['status_comments'] = this.remarks;
    return this.http.post(apiUrls.postApproveOutletEndPoint(id, apiEndPoints[this.service]), formData).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that get outlet list for admin
   * @param pageIndex 
   * @param pageSize 
   * @returns 
   */
  public getOutletsListForAdmin(data, service: string): Observable<any> {
    return this.http.post(apiUrls.getOutletsListForAdminEndPoint(apiEndPoints[service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that gets all riders data based on filter params provided
   * @param service 
   * @param data 
   * @returns 
   */
  filterRiderList(service: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterRiderEndPoint(apiEndPoints[service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that gets rider's details by id
   * @param riderId 
   * @returns 
   */
  getRiderDetails(riderId: string): Observable<any> {
    return this.http.get(apiUrls.getRiderDetailsById(apiEndPoints[this.service], riderId)).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that approves rider details
   * @param riderId 
   * @returns 
   */
  approveRider(riderId: string): Observable<any> {
    return this.http.post(apiUrls.postApproveRiderById(apiEndPoints[this.service], riderId), {}).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that rejects rider details
   * @param riderId 
   * @returns 
   */
  rejectRider(riderId: string): Observable<any> {
    const data = {
      reject_reason: this.remarks
    }
    return this.http.post(apiUrls.postRejectRiderById(apiEndPoints[this.service], riderId), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that sends otp to owner contact number
   * @param id 
   * @param data 
   * @returns 
   */
  ownerContactSendOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postOwnerContactSendOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that verifies otp of owner contact number
   * @param id 
   * @param data 
   * @returns 
   */
  ownerContactVerifyOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postOwnerContactVerifyOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that sends otp to owners email
   * @param id 
   * @param data 
   * @returns 
   */
  ownerEmailSendOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postOwnerEmailSendOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that verifies otp of owner email
   * @param id 
   * @param data 
   * @returns 
   */
  ownerEmailVerifyOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postOwnerEmailVerifyOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that sends otp to manager contact
   * @param id 
   * @param data 
   * @returns 
   */
  managerContactSendOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postManagerContactSendOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that verifies otp of manager contact
   * @param id 
   * @param data 
   * @returns 
   */
  managerContactVerifyOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postManagerContactVerifyOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that sends otp to manager email
   * @param id 
   * @param data 
   * @returns 
   */
  managerEmailSendOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postManagerEmailSendOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that verifies otp of manager email
   * @param id 
   * @param data 
   * @returns 
   */
  managerEmailVerifyOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postManagerEmailVerifyOtpEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * 
   * @param id 
   * @param data 
   * @returns 
   */
  public invoiceEmailSendOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postSendInvoiceEmailOtp(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that verifies otp of invoice email
   * @param id 
   * @param data 
   * @returns 
   */
  public verifyInvoiceEmailOtp(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postVerifyInvoiceEmailOtp(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method that Downloads a PDF file representing a Letter of Undertaking (LOU).
 * @param id - The unique identifier of the LOU to download.
 * @returns An Observable that emits the downloaded PDF file as a response.
 */
  downloadLouPdf(id: string): Observable<any> {
    return this.http.get(apiUrls.getDownloadLouPdf(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

}
