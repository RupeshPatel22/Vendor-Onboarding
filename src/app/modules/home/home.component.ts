import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddNewPartnerModalComponent } from 'src/app/shared/components/modals/add-new-partner-modal/add-new-partner-modal.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
import { Roles, Services } from 'src/app/shared/models/constants/vendor-registration-types';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showServicesSubMenu: boolean;
  showHistorySubMenu: boolean;
  currentActiveNavbar: number = 0;
  username: string;
  role: Roles;
  readonly roles = Roles;
  navLinks = [
    {
      name: Services.Food,
      route: 'food',
      icon: 'assets/food-icon.svg',
      allowedRouteAccessTo: [Roles.Partner, Roles.Admin]
    },
    {
      name: Services.Grocery,
      route: 'grocery',
      icon: 'assets/grocery-icon.svg',
      allowedRouteAccessTo: [Roles.Partner, Roles.Admin]
    },
    {
      name: Services.Rider,
      route: 'rider',
      icon: 'assets/rider-icon.svg',
      allowedRouteAccessTo: [Roles.Admin]
    },
    {
      name: Services.Paan,
      route: 'paan',
      icon: 'assets/paan.svg',
      allowedRouteAccessTo: [Roles.Partner, Roles.Admin]
    },
    {
      name: Services.Flower,
      route: 'flower',
      icon: 'assets/flower-icon.svg',
      allowedRouteAccessTo: [Roles.Partner, Roles.Admin]
    },
    {
      name: Services.Pharmacy,
      route: 'pharmacy',
      icon: 'assets/pharmacy-icon.svg',
      allowedRouteAccessTo: [Roles.Partner, Roles.Admin]
    },
    {
      name: Services.Pet,
      route: 'pet',
      icon: 'assets/pet-icon.svg',
      allowedRouteAccessTo: [Roles.Partner, Roles.Admin]
    }
  ]
  constructor(
    private router: Router,
    public matDialog: MatDialog,
    private vendorService: VendorRegistrationService, private authenticationService: AuthenticationService
  ) { }
  ngOnInit(): void {
    this.role = this.authenticationService.role;
    this.username = localStorage.getItem('userName');
    this.navLinks.filter((link, index) => {
      if (this.router.url.includes(link.route)) return this.currentActiveNavbar = index;
    })
  }
  /**
   * Method that allows to open modal
   * @return void
   */
  openModal() {
    const modalDialog = this.matDialog.open(AddNewPartnerModalComponent, {
      width: '600px',
      autoFocus: false,
    });
  }
  navigateToPage(route: string) {
    this.router.navigate([`home/${route}`])
  }
  /**
   * Method that allows to go at login
   */
  logout() {
    this.role === Roles.Partner ? this.router.navigate(['login']) : this.router.navigate(['admin']);
    localStorage.clear();
  }
}
