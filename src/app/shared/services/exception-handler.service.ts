import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { Observable, Subject } from 'rxjs';
import * as apiUrls from '../../core/apiUrls';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExceptionHandlerService {

  error$ = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) { 
    this.error$
      .pipe(
        debounceTime(5000),
        distinctUntilChanged()
      )
      .subscribe(error => {
        this.createLog(this.toJson(error)).subscribe();
      });

  }

  /**
   * Method that captures unhandled errors
   * @param error 
   */
  handleError(error: any) {
    console.error(error);
    if (error instanceof HttpErrorResponse && !error.status.toString().startsWith('5')) return;
    this.error$.next(error);
  }

  /**
   * Method that sends unhandled error data using API
   * @param data 
   * @returns 
   */
  createLog(data: any): Observable<any> {
    return this.http.post(apiUrls.postClientLog, data).pipe(
      map(response => {
        return response;
      })
    )
  }

  /**
   * Method that makes data in a format to be send
   * @param error 
   * @returns 
   */
  toJson(error: any) {
    const data = {};
    let decoded: any;
    if (localStorage.getItem('token')) {
      decoded = jwt_decode(localStorage.getItem('token'));
    }
    data['level'] = 'error';
    data['user_id'] = decoded?.['id'];
    data['user_type'] = decoded?.['user_type'];
    data['client_app'] = 'partner_dashboard';
    data['message'] = error['message'].substring(0, 255);
    if (error instanceof HttpErrorResponse) {
      data['code'] = 102;
      data['data'] = `Error occured in API`;
    } else {
      data['code'] = 100;
      data['data'] = `Error occured in ${this.router.url}`;
    }
    return data;
  }
}
