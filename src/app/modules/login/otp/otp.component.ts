import { LoginService } from './../../../shared/services/login.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Config } from 'ng-otp-input/lib/models/config';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  @Input() openedFor: string;
  @Output() flag = new EventEmitter<boolean>();
  //configurations for otp input boxes
  config: Config = {
    allowNumbersOnly: true,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: true,
    placeholder: '',
    inputStyles: {
      width: '1.5em',
      height: '1.5em',
      margin: '0.6em 0.9em 0.5em 0',
      padding: '8px',
      'font-size': '35px',
    },
  };
  emailOtp: string;
  phoneOtp: string;
  windowWidth = window.innerWidth;
  canResendEmailOtp: boolean = false;
  canResendPhoneOtp: boolean = false;
  emailOtpResendTimer: number = 30;
  phoneOtpResendTimer: number = 30;
  emailInterval: any;
  phoneInterval: any;
  partialEmail: string;
  partialMobile: string;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastMsgService: ToastService
  ) { }
  ngOnInit(): void {
    if (this.windowWidth > 320 && this.windowWidth < 767) {
      this.config['inputStyles']['font-size'] = '25px';
      this.config['inputStyles']['margin'] = '0.6em 0.3em 0.5em 0';
    }
    if (this.windowWidth > 768 && this.windowWidth < 1024) {
      this.config['inputStyles']['margin'] = '0.6em 1.5em 0.5em 0';
    }
    if (this.windowWidth > 1270 && this.windowWidth < 1920) {
      this.config['inputStyles']['margin'] = '0.6em 0.3em 0.5em 0';
      this.config['inputStyles']['font-size'] = '32px';
    }
    if (this.windowWidth > 2550 && this.windowWidth < 2570) {
      this.config['inputStyles']['margin'] = '0.6em 0.6em 0.5em 0';
    }
    if (this.openedFor === 'registration') {
      this.startEmailOtpResendTimer();
      this.displayPartialEmailId();
    }
    this.startPhoneOtpResendTimer();
    this.displayPartialMobile();
  }
  /**
  * Method that invokes when user enters email otp
  * @param event
  */
  onEmailOtpChange(event: string) {
    this.emailOtp = event;
  }
  /**
   * Method that invokes when user enters phone otp
   * @param event
   */
  onPhoneOtpChange(event: string) {
    this.phoneOtp = event;
  }
  /**
   * Method that makes Verify OTP API call based on
   * whether it is registration or login process
   * and navigates to home page
   */
  verifyOtp() {
    if (this.openedFor === 'registration') {
      this.loginService.verifyRegistrationOtp(this.emailOtp, this.phoneOtp).subscribe(res => {
        this.stopEmailOtpResendTimer();
        this.stopPhoneOtpResendTimer();
        this.toastMsgService.showSuccess('Registered successfully');
        this.router.navigate(['home/food']);
      })
    }
    else {
      this.loginService.verifyLoginOtp(this.phoneOtp).subscribe((data) => {
        const res = data;
        if (res) {
          this.stopPhoneOtpResendTimer();
          this.toastMsgService.showSuccess('Logged In successfully');
          this.router.navigate(['home/food']);
        }
      });
    }
  }
  /**
   * Method that makes API call to re-send email otp for registration
   */
  reSendEmailOtp() {
    this.loginService.reSendEmailRegistrationOtp().subscribe(res => {
      this.toastMsgService.showSuccess('OTP re-sent on your email id successfully');
      this.startEmailOtpResendTimer();
    })
  }
  /**
   * Method that makes re-send otp api call based on 
   * whether it is for registration process or login process
   */
  reSendPhoneOtp() {
    if (this.openedFor === 'registration') {
      this.loginService.reSendPhoneRegistrationOtp().subscribe(res => {
        this.toastMsgService.showSuccess('OTP re-sent to your mobile successfully');
        this.startPhoneOtpResendTimer();
      })
    }
    else {
      this.loginService.sendLoginOtp(this.loginService.phoneNumber).subscribe(res => {
        this.toastMsgService.showSuccess('OTP re-sent to your mobile successfully');
        this.startPhoneOtpResendTimer();
      });
    }
  }
  /**
   * Method that start timer of 30 secs to resend email otp
   */
  startEmailOtpResendTimer() {
    this.canResendEmailOtp = false;
    this.emailInterval = setInterval(() => {
      this.emailOtpResendTimer--;
      if (this.emailOtpResendTimer === 0) {
        this.stopEmailOtpResendTimer();
      }
    }, 1000)
  }
  /**
   * Method that stop timer for resend email otp
   */
  stopEmailOtpResendTimer() {
    clearInterval(this.emailInterval);
    this.emailOtpResendTimer = 30;
    this.canResendEmailOtp = true;
  }
  /**
   * Method that start timer of 30 secs to resend phone otp
   */
  startPhoneOtpResendTimer() {
    this.canResendPhoneOtp = false;
    this.phoneInterval = setInterval(() => {
      this.phoneOtpResendTimer--;
      if (this.phoneOtpResendTimer === 0) {
        this.stopPhoneOtpResendTimer();
      }
    }, 1000)
  }
  /**
   * Method that stop timer for resend phone otp
   */
  stopPhoneOtpResendTimer() {
    clearInterval(this.phoneInterval);
    this.phoneOtpResendTimer = 30;
    this.canResendPhoneOtp = true;
  }
  /**
   * here showing firsrt 2 letters of email and last n letters from '@'
   * @returns 
   */
  displayPartialEmailId() {
    const splitedEmail = this.loginService.email.split('@');
    this.partialEmail = `${splitedEmail[0].slice(0, 2)}${new Array(splitedEmail[0].length - 2 + 1).join('*')}@${splitedEmail[1]}`;
  }
  /**
   * here showing last 2 digits of phone number
   * @returns 
   */
  displayPartialMobile() {
    const phone = this.loginService.phoneNumber;
    this.partialMobile = `${new Array(phone.length - 5 + 1).join('*')}${phone.slice(-2)}`; // substracting 5 to remove +91 and last 2 digits (total 5 chars)
  }
  /**
   * Method that emits flag to login component and then
   * it shows login form if emitted flag is true
   * else it will show either login or registration form based on whichever it was 
   * showing earlier
   * @param flag 
   */
  closeOtpPage(flag: boolean) {
    this.stopEmailOtpResendTimer();
    this.stopPhoneOtpResendTimer();
    this.flag.emit(flag);
  }
}
