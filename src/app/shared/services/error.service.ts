import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../components/toast/toast.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Roles } from '../models/constants/vendor-registration-types';
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  showModal = new BehaviorSubject(null);
  error: any;
  customMessage: string;
  shouldReload: boolean;
  httpErrorMessage: string;
  constructor(private toastMsgService: ToastService, private router: Router, private authenticationService: AuthenticationService) { }
  /**
   * Method that shows error modal
   * @param error 
   * @param customMessage 
   * @param shouldReload 
   */
  showErrorModal(error, customMessage?: string, shouldReload?: boolean) {
    if (error) {
      this.error = new Error(error);
    }
    if (customMessage) {
      this.customMessage = customMessage;
    }
    this.showModal.next(true);
    this.shouldReload = shouldReload;
  }
  /**
   * Method that hides error modal
   */
  hideErrorModal() {
    this.error = null;
    this.customMessage = null;
    this.shouldReload = false;
    this.showModal.next(false);
  }
  /**
 * Method that handle errors
 * @param error
 * @returns boolean
 */
  errorHandler(error: HttpErrorResponse): HttpErrorResponse {
    if (error.status === 401) {
      this.toastMsgService.showError('Your session is invalid. Kindly login again');
      localStorage.clear();
      this.authenticationService.role === Roles.Partner ? this.router.navigate(['login']) : this.router.navigate(['admin']);
      if (error.url.includes('user/token/refresh')) window.location.reload();
    }
    else if (error.status === 500) {
      this.router.navigate(['serverError']);
    }
    else {
      error['error']?.['errors']?.forEach(err => {
        this.toastMsgService.showError(err.message)
      })
    }
    return error;
  }
}
