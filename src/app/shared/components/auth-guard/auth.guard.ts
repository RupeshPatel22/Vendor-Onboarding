import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import jwt_decode from "jwt-decode";
import { allowRouteAccessTo, Roles } from '../../models/constants/vendor-registration-types';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  _baseurl = window.location.origin;
  _localbaseUrl = window.location.host;
  currentUrl: string;
  role: string;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService) { }
  /**
   * Method that activates routing based on authorization of user
   * @returns boolean values
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.currentUrl = state.url;
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token);
      this.authenticationService.role = decoded['user_type'];
    }
    if (!token && this.currentUrl !== '/login') {
      this.router.navigate(['login']);
      return false;
    }
    else if (token && (this.currentUrl === '/login' || this.currentUrl === '/admin')) {
      this.router.navigate(['home/food']);
      return false;
    }
    else if (token && !Object.values(Roles).includes(this.authenticationService.role)) {
      localStorage.clear();
      this.router.navigate(['login']);
      return false;
    }
    else if (token && !allowRouteAccessTo[this.processUrl(this.currentUrl)].includes(this.authenticationService.role)) {
      this.router.navigate(['home/food']);
      return false;
    }
    return true;
  }
  /**
  * Method that return url after removing dynamic routing from it
  * @param url 
  * @returns 
  */
  processUrl(url: string) {
    url = url.split('?')[0];
    if (allowRouteAccessTo[url]) return url;
    return url.substring(0, url.lastIndexOf('/'));
  }
}
