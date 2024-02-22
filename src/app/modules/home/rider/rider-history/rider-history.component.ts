import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OutletCard, RiderStatus, RiderStatusList, Services } from 'src/app/shared/models/constants/vendor-registration-types';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
@Component({
  selector: 'app-rider-history',
  templateUrl: './rider-history.component.html',
  styleUrls: ['./rider-history.component.scss']
})
export class RiderHistoryComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 10;
  totalRiderRecords: number;
  historyRiderList: OutletCard[] = [];
  search: string;
  approvalStatus: RiderStatus[] = ['approved', 'rejected'];
  readonly riderStatusList = RiderStatusList;
  constructor(private vendorService: VendorRegistrationService, private router: Router) { }
  ngOnInit(): void {
    this.showHistoryRiderList();
  }
  /**
  * Method that redirects to view-outlet details page from history tab
  * @param riderId 
  */
  viewRider(riderId) {
    this.router.navigate(['vendors/view-vendor', riderId], { queryParams: { service: Services.Rider } });
  }
  /**
* Method that shows history tab rider list for admin
* @param pageIndex 
* @param pageSize 
*/
  showHistoryRiderList(searchFlag?: boolean) {
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
      this.historyRiderList = [];
      for (const i of res['result']['records']) {
        this.historyRiderList.push(OutletCard.fromJson(i));
      }
      this.totalRiderRecords = res['result']['total_records'];
    }
    )
  }
}
