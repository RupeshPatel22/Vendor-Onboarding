import { environment } from '../../../src/environments/environment';
import { IApiEndPoint } from '../shared/models/constants/vendor-registration-types';
//APIs Endpoints for partner login/register
export const postOtpRegistrationEndPoint = `${environment.baseUrl}/user/partner/auth/register/otp`;
export const postVerifyRegistrationEndPoint = `${environment.baseUrl}/user/partner/auth/register/verify`;
export const postResendPhoneOtpRegistrationEndPoint = `${environment.baseUrl}/user/partner/auth/register/phone/otp/resend`;
export const postResendEmailOtpRegistrationEndPoint = `${environment.baseUrl}/user/partner/auth/register/email/otp/resend`;
export const postOtpLoginEndPoint = `${environment.baseUrl}/user/partner/auth/login/otp`;
export const postVerifyLoginEndPoint = `${environment.baseUrl}/user/partner/auth/login/verify`;
//API for admin login
export const postSendAdminLoginOtpEndPoint = `${environment.baseUrl}/user/admin/auth/login/otp`;
export const postVerifyAdminLoginOtpEndPoint = `${environment.baseUrl}/user/admin/auth/login/verify`;
// API for Refresh Token
export const postRefreshTokenEndPoint = `${environment.baseUrl}/user/token/refresh`;
//APIs Endpoints to add New Outlets and get Outlets List
export const getOutletsListEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}`;
};
export const postNewOutletEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}`;
};
export const getOutletsListForAdminEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/filter`;
};
// APIs for Rider Service
export const postFilterRiderEndPoint = (apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/filter`;
};
export const getRiderDetailsById = (apiEndPoint: IApiEndPoint, riderId: string) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/onboarding/${riderId}`;
}
export const postApproveRiderById = (apiEndPoint: IApiEndPoint, riderId: string) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/onboarding/approve/${riderId}`;
}
export const postRejectRiderById = (apiEndPoint: IApiEndPoint, riderId: string) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/onboarding/reject/${riderId}`;
}
//APIs Endpoints for Vendor Registration Form
export const getCityListEndPoint = (role: string) => {
  return `${environment.baseUrl}/core/${role}/city`;
}
export const getAreaListEndPoint = (role: string) => {
  return `${environment.baseUrl}/core/${role}/polygon`;
}
export const getCuisineListEndPoint = (role: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/${role}/cuisine`;
}
export const getLanguageListEndPoint = (role: string) => {
  return `${environment.baseUrl}/core/${role}/language`;
}
export const getESignDocumentsEndPoint = (role: string) => {
  return `${environment.baseUrl}/core/${role}/document`;
}
export const getBusinessContactSendOtpEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/sendOtp/businessContact`;
};
export const getBusinessContactVerifyOtpEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyOtp/businessContact`;
};
export const getDocSignatureSendOtpEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/sendOtp/documentSignature`;
};
export const getDocSignatureVerifyOtpEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyOtp/documentSignature`;
};
export const putOutletDetailsEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}`;
};
export const getOutletDetailsByIdEndPoint = (id: string, role: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/${role}/${apiEndPoint.prefix}/${id}`;
}
export const postOutletDetailsEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/submit`;
};
export const fileUploadEndPoint = (fileExtn: string) => {
  return `${environment.baseUrl}/core/common/getUploadURL/${fileExtn}`;
};
export const verifyFssaiCertificateEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyFssaiCertificate`
}
export const verifyPostalCodeEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyPostalCode`
}
export const verifyPanEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyPanNumber`
}
export const verifyGstinNumberEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyGstinNumber`
}
export const verifyIfscCodeEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyIfscCode`
}
//API for admin apporval
export const postApproveOutletEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/admin/${apiEndPoint.prefix}/${id}/approval/admin`;
};

//API for owner contact
export const postOwnerContactSendOtpEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/sendOtp/ownerContact`;
}

export const postOwnerContactVerifyOtpEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyOtp/ownerContact`;
}

export const postOwnerEmailSendOtpEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/SendOtp/ownerEmail`;
}

export const postOwnerEmailVerifyOtpEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return`${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyOtp/ownerEmail`;
}

export const postManagerContactSendOtpEndPoint = (id: string, apiEndPoint:IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/sendOtp/managerContact`;
}

export const postManagerContactVerifyOtpEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyOtp/managerContact`;
}

export const postManagerEmailSendOtpEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/sendOtp/managerEmail`;
}

export const postManagerEmailVerifyOtpEndPoint = (id: string, apiEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyOtp/managerEmail`;
}

export const postSendInvoiceEmailOtp = (id:string, apiEndPoint:IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/sendOtp/invoiceEmail`
}
export const postVerifyInvoiceEmailOtp = (id:string, apiEndPoint:IApiEndPoint) => {
  return `${environment.baseUrl}/${apiEndPoint.service}/partner/${apiEndPoint.prefix}/${id}/verifyotp/invoiceEmail`
}

// APIs for client logs
export const postClientLog = `${environment.baseUrl}/core/client_log`;

// APIs for speedyy account manager
export const getSpeedyyAccountManagersEndPoint = `${environment.baseUrl}/user/partner/speedyy_account_managers`
export const getSpeedyyAccountManagsForAdminEndPoint = `${environment.baseUrl}/user/admin/filter`;
 
//API for LOU PDF Download
export const getDownloadLouPdf = (id: string, apidEndPoint: IApiEndPoint) => {
  return `${environment.baseUrl}/${apidEndPoint.service}/partner/${apidEndPoint.prefix}/${id}/lou_pdf`
}