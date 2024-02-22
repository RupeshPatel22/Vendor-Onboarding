import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryOutletStatuses, OutletCard, OutletStatus, OutletStatusList, Services } from 'src/app/shared/models/constants/vendor-registration-types';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
@Component({
  selector: 'app-food-history',
  templateUrl: './food-history.component.html',
  styleUrls: ['./food-history.component.scss']
})
export class FoodHistoryComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 10;
  search: string;
  historyRestaurantList: OutletCard[] = [];
  totalRecords: number;
  readonly outletStatusList = OutletStatusList;
  constructor(private vendorService: VendorRegistrationService, private router: Router) { }
  ngOnInit(): void {
    this.showHistoryOutletList();
  }
  /**
   * Method that redirects to view-outlet details page from history tab
   * @param outletId 
   */
  viewOutlet(outletId) {
    this.router.navigate(['vendors/view-vendor', outletId], { queryParams: { service: Services.Food } });
  }
  /**
 * Method that shows history tab outlet list for admin
 * @param pageIndex 
 * @param pageSize 
 */
  showHistoryOutletList(searchFlag?: boolean) {
    if (searchFlag) {
      this.currentPage = 1;
    }
    const data = {};
    data['filter'] = {
      status: HistoryOutletStatuses
    }
    data['pagination'] = {
      page_index: this.currentPage - 1,
      page_size: this.pageSize
    }
    data['sort'] = [
      {
        column: 'created_at',
        order: 'desc'
      }
    ]
    if (this.search) {
      data['search_text'] = this.search;
    }
    this.vendorService.getOutletsListForAdmin(data, Services.Food).subscribe(res => {
      this.historyRestaurantList = [];
      for (const i of res['result']['restaurants']) {
        this.historyRestaurantList.push(OutletCard.fromJson(i));
      }
      this.totalRecords = res['result']['total_records'];
    }
    )
  }
}
