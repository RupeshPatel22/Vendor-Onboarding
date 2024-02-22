import { Observable } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as apiUrls from '../../core/apiUrls';
import { ErrorService } from '../services/error.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  httpErrorMessage: string;
  result: string;
  phoneNumber: string;
  user: string;
  password: string;
  email: string;
  constructor(private http: HttpClient, private errorService: ErrorService) { }
  /**
   * Method that sends OTPs to user's email and phone
   * @param email 
   * @param phone 
   * @returns 
   */
  sendRegistrationOtp(email: string, phone: string): Observable<any> {
    this.email = email;
    this.phoneNumber = phone;
    const data = {
      email: this.email,
      phone: this.phoneNumber
    }
    return this.http.post(apiUrls.postOtpRegistrationEndPoint, data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that verifies OTPs provided by user
   * @param emailOtp 
   * @param phoneOtp 
   * @returns 
   */
  verifyRegistrationOtp(emailOtp: string, phoneOtp: string): Observable<any> {
    const data = {
      email: this.email,
      email_otp: emailOtp,
      phone: this.phoneNumber,
      phone_otp: phoneOtp
    }
    return this.http.post(apiUrls.postVerifyRegistrationEndPoint, data).pipe(
      map((response) => {
        localStorage.setItem('token', response['result']['token']);
        localStorage.setItem('refreshToken', response['result']['refresh_token']);
        localStorage.setItem('userName', response['result']['email']);
        return response;
      })
    )
  }
  /**
   * Method that re-send phone otp for registration process
   * @returns 
   */
  reSendPhoneRegistrationOtp(): Observable<any> {
    const data = {
      email: this.email,
      phone: this.phoneNumber
    }
    return this.http.post(apiUrls.postResendPhoneOtpRegistrationEndPoint, data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that re-send email otp for registration process
   * @returns 
   */
  reSendEmailRegistrationOtp(): Observable<any> {
    const data = {
      email: this.email,
      phone: this.phoneNumber
    }
    return this.http.post(apiUrls.postResendEmailOtpRegistrationEndPoint, data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that sends/re-sends otp for login
   * @param phone
   * @returns boolean
   */
  public sendLoginOtp(phone: string): Observable<any> {
    this.phoneNumber = phone;
    const data = {
      phone: phone,
    };
    return this.http.post(apiUrls.postOtpLoginEndPoint, data).pipe(
      map((response) => {
        return response['status'];
      })
    );
  }
  /**
   * Method that verifies otp for login
   * @param otp
   * @returns boolean
   */
  public verifyLoginOtp(otp: string): Observable<any> {
    const data = {
      phone: this.phoneNumber,
      phone_otp: otp,
    };
    return this.http.post(apiUrls.postVerifyLoginEndPoint, data).pipe(
      map((response) => {
        localStorage.setItem('token', response['result']['token']);
        localStorage.setItem('refreshToken', response['result']['refresh_token']);
        localStorage.setItem('userName', response['result']['email']);
        return response['status'];
      })
    );
  }

  /**
   * Method that sends otp for admin login
   * @param data 
   * @returns 
   */
   sendAdminLoginOtp(data: any): Observable<any> {
    return this.http.post(apiUrls.postSendAdminLoginOtpEndPoint, data).pipe(
      map(response => {
        return response;
      }) 
    )
  }

  /**
   * Method that verifies admin login otp
   * @param data 
   * @returns 
   */
  verifyAdminLoginOtp(data: any): Observable<any> {
    return this.http.post(apiUrls.postVerifyAdminLoginOtpEndPoint, data).pipe(
      map(response => {
        localStorage.setItem('token', response['result']['token']);
        localStorage.setItem('refreshToken', response['result']['refresh_token']);
        localStorage.setItem('userName', response['result']['full_name']);
        return response;
      })
    )
  }
  /**
   * Method that gets new auth token
   * @returns 
   */
  refreshAuthToken(): Observable<any> {
    const headers = new HttpHeaders({
      refresh_token: 'true'
    })
    return this.http.post(apiUrls.postRefreshTokenEndPoint, {}, { headers }).pipe(
      map((response) => {
        localStorage.setItem('token', response['result']['token']);
        localStorage.setItem('refreshToken', response['result']['refresh_token']);
      })
    )
  }
}
