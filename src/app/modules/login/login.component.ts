import { LoginService } from './../../shared/services/login.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  otpSent: boolean = false;
  showDownloadButton: string = 'desktop';
  loginForm = new FormGroup({
    userCountryCode: new FormControl({ disabled: true, value: '+91' }, [
      Validators.required,
    ]),
    userMobile: new FormControl('', [
      Validators.required,
      Validators.pattern('[6-9][0-9]{9}'),
    ]),
  });
  currentPage: string = 'login';
  constructor(
    private loginService: LoginService,
    private toastMsgService: ToastService
  ) { }
  ngOnInit(): void {
    this.indentifyOS();
  }
  /**
   * Method that checks validaity of form and
   * let user enter otp
   */
  onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
    } else {
      this.sendOtp();
    }
  }
  /**
   * Method that sends otp for verification
   */
  async sendOtp() {
    const mobileNo = `+91${this.loginForm.get('userMobile').value}`
    this.loginService.sendLoginOtp(mobileNo).subscribe((data) => {
      const res = data;
      if (res) {
        this.toastMsgService.showSuccess('OTP sent successfully');
        this.otpSent = true;
      }
    });
  }
  /**
   * Method that hides otp form and shows 
   * login form if received flag is true 
   * else it will show either of forms
   * based on value of currentPage variable
   */
  hideOtpPage(event) {
    if (event) this.currentPage = 'login';
    this.otpSent = false;
  }
  toggleCurrentPage() {
    if (this.currentPage === 'login') {
      this.currentPage = 'registration';
    } else {
      this.currentPage = 'login';
    }
  }
  /**
   * Method that indentifies os and show or hide download buttons
   */
  indentifyOS() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) {
      this.showDownloadButton = 'android';
    }
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      this.showDownloadButton = 'ios';
    }
  }
}
