import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { Config } from 'ng-otp-input/lib/models/config';
import { NgOtpInputComponent } from 'ng-otp-input';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  
  phone = new FormControl('', [Validators.required, Validators.pattern('[6-9][0-9]{9}')]);
  otp: string;
  interval: any;
  timeLeft: number = 30;
  canResendOtp: boolean;
  isOtpSent: boolean;

  otpInputConfig: Config = {
    allowNumbersOnly: true,
    length: 5,
  };
  @ViewChild(NgOtpInputComponent) otpInputField: NgOtpInputComponent;

  constructor(
    private loginService: LoginService,
    private toastMsgService: ToastService,
    private router: Router
  ) { }
  ngOnInit(): void { }
  /**
   * Method for Admin login
   */

  /**
   * Method that sends login otp
   * @returns 
   */
   sendOtp() {
    if (!this.phone.valid) return this.toastMsgService.showError('Enter valid phone number');
    const data = {
      phone: `+91${this.phone.value}`
    }
    this.loginService.sendAdminLoginOtp(data).subscribe(res => {
      this.startTimer();
      this.isOtpSent = true;
      this.toastMsgService.showSuccess('OTP sent');
    })
     // clear the OTP field
    if (this.otpInputField) {
      this.otpInputField.setValue('');
    }
  }

  /**
   * Method that verifies login otp
   */
  verifyOtp() {
    const data = {
      phone: `+91${this.phone.value}`,
      otp: this.otp
    }
    this.loginService.verifyAdminLoginOtp(data).subscribe(res => {
      this.stopTimer();
      this.router.navigate(['home/food']);
      this.toastMsgService.showSuccess('Logged In Successfully');
    })
  }

  /**
   * Method that invokes on each otp input
   * and it stores the otp
   * @param event 
   */
  onOtpChange(event: string) {
    this.otp = event;
  }

  /**
   * Method that starts timer for resend otp
   */
  startTimer() {
    this.canResendOtp = false;
    this.interval = setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeLeft === 0) {
        this.stopTimer();
      }
    }, 1000)
  }

  /**
   * Method that stops timer
   */
  stopTimer() {
    clearInterval(this.interval);
    this.timeLeft = 30;
    this.canResendOtp = true;
  }

  /**
   * Method that allow user to enter phone number again
   */
  signInAgain() {
    this.phone.reset();
    this.isOtpSent = false;
    this.stopTimer();
  }
}
