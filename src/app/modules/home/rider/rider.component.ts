import { Component, OnInit } from '@angular/core';
import { OutletCard, RiderStatus, Roles, Services } from 'src/app/shared/models/constants/vendor-registration-types';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
@Component({
  selector: 'app-rider',
  templateUrl: './rider.component.html',
  styleUrls: ['./rider.component.scss']
})
export class RiderComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 10;
  totalRiderRecords: number;
  riderList: OutletCard[] = [];
  search: string;
  role: Roles;
  readonly roles = Roles;
  approvalStatus: RiderStatus[] = ['pending'];
  constructor(private authenticationService: AuthenticationService, private vendorService: VendorRegistrationService) { }
  ngOnInit(): void {
    this.role = this.authenticationService.role;
    this.getRiderList();
  }
  /**
   * Method that gets all riders list for approval
   * @param searchFlag 
   */
  getRiderList(searchFlag?: boolean) {
    if (searchFlag) {
      this.currentPage = 1;
    }
    const data = {
      filter: {
        approval_status: this.approvalStatus
      },
      pagination: {
        page_index: this.currentPage - 1,
        page_size: this.pageSize
      }
    }
    if (this.search) {
      data['search_text'] = this.search;
    }
    this.vendorService.filterRiderList(Services.Rider, data).subscribe(res => {
      this.riderList = [];
      for (const i of res['result']['records']) {
        this.riderList.push(OutletCard.fromJson(i, Services.Rider));
      }
      this.totalRiderRecords = res['result']['total_records'];
    });
  }
}
