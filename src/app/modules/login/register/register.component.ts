import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { LoginService } from 'src/app/shared/services/login.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() flag = new EventEmitter();
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, this.customEmailValidator()]),
    countryCode: new FormControl({ disabled: true, value: '+91' }, [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('[6-9][0-9]{9}')]),
  })
  constructor(private loginService: LoginService, private toastMsgService: ToastService) { }
  ngOnInit(): void {
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
      if (!val.match("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")) {
        return { email: true }
      }
    };
  }
  /**
   * Method that make API call to send OTPs on user's email and mobile
   * @returns 
   */
  submit() {
    if (this.registerForm.status === 'INVALID') {
      this.registerForm.markAllAsTouched();
      return;
    }
    const email = this.registerForm.get('email').value;
    const phone = `${this.registerForm.get('countryCode').value}${this.registerForm.get('mobile').value}`;
    this.loginService.sendRegistrationOtp(email, phone).subscribe(res => {
      this.toastMsgService.showSuccess('OTPs sent successfully');
      this.flag.emit();
    })
  }
}
