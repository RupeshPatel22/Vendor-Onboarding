import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
import { ApprovalPendingOutletStatuses, OutletCard, OutletStatus, Roles, Services } from 'src/app/shared/models/constants/vendor-registration-types';
@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {
  role: Roles;
  readonly roles = Roles;
  restaurantList: OutletCard[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  search: string;
  totalApprovalPendingRecords: number;
  constructor(private authenticationService: AuthenticationService, private vendorService: VendorRegistrationService) { }
  ngOnInit(): void {
    this.role = this.authenticationService.role;
    if (this.role === Roles.Partner) {
      this.setOutletsList();
    } else {
      this.showAdminApprovalPendingOutletList();
      // this.showHistoryOutletList();
    }
  }
  /**
   * Method that shows outlets List on api call
   */
  setOutletsList() {
    this.vendorService.getOutletsList(Services.Food).subscribe((res) => {
      this.restaurantList = [];
      for (const i of res['result']) {
        this.restaurantList.push(OutletCard.fromJson(i, Services.Food));
      }
    });
  }
  /**
   * Method that shows outlets List for admin
   */
  showAdminApprovalPendingOutletList(searchFlag?: boolean) {
    if (searchFlag) {
      this.currentPage = 1;
    }
    const data = {};
    data['filter'] = {
      status: ApprovalPendingOutletStatuses
    }
    data['pagination'] = {
      page_index: this.currentPage - 1,
      page_size: this.pageSize
    }
    data['sort'] = [
      {
        column: 'updated_at',
        order: 'asc'
      }
    ]
    if (this.search) {
      data['search_text'] = this.search
    }
    this.vendorService.getOutletsListForAdmin(data, Services.Food).subscribe(res => {
      this.restaurantList = [];
      for (const i of res['result']['restaurants']) {
        this.restaurantList.push(OutletCard.fromJson(i, Services.Food));
      }
      this.totalApprovalPendingRecords = res['result']['total_records'];
    })
  }
}
