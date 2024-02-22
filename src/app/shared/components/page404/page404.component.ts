import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})
export class Page404Component implements OnInit {
  constructor(private authenticationService: AuthenticationService, private router: Router) { }
  ngOnInit(): void {
  }
  /**
   * redirect to home page if page was not found 
   */
  redirectToHome() {
    this.authenticationService.role === 'partner' ? this.router.navigate(['login']) : this.router.navigate(['admin']);
  }
}
