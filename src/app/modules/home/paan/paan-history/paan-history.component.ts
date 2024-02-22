import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryOutletStatuses, OutletCard, OutletStatusList, Services } from 'src/app/shared/models/constants/vendor-registration-types';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';

@Component({
  selector: 'app-paan-history',
  templateUrl: './paan-history.component.html',
  styleUrls: ['./paan-history.component.scss']
})
export class PaanHistoryComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 10;
  search: string;
  historyPaanList: OutletCard[] = [];
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
    this.router.navigate(['vendors/view-vendor', outletId], { queryParams: { service: Services.Paan } });
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
    this.vendorService.getOutletsListForAdmin(data, Services.Paan).subscribe(res => {
      this.historyPaanList = [];
      for (const i of res['result']['outlets']) {
        this.historyPaanList.push(OutletCard.fromJson(i));
      }
      this.totalRecords = res['result']['total_records'];
    }
    )
  }
}
