import { Injectable } from '@angular/core';
import { Roles } from '../models/constants/vendor-registration-types';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  role: Roles = Roles.Partner;
  constructor() { }
}
