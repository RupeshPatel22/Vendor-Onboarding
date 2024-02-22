import { Component, OnInit } from '@angular/core';
import { ApprovalPendingOutletStatuses, OutletCard, Roles, Services } from 'src/app/shared/models/constants/vendor-registration-types';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';

@Component({
  selector: 'app-paan',
  templateUrl: './paan.component.html',
  styleUrls: ['./paan.component.scss']
})
export class PaanComponent implements OnInit {
  paanList: OutletCard[] = [];
  role: Roles;
  readonly roles = Roles;
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
    }
  }
  /**
   * Method that shows outlets List on api call
   */
  setOutletsList() {
    this.vendorService.getOutletsList(Services.Paan).subscribe((res) => {
      for (const i of res['result']) {
        this.paanList.push(OutletCard.fromJson(i, Services.Paan));
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
    this.vendorService.getOutletsListForAdmin(data, Services.Paan).subscribe(res => {
      this.paanList = [];
      for (const i of res['result']['outlets']) {
        this.paanList.push(OutletCard.fromJson(i, Services.Paan));
      }
      this.totalApprovalPendingRecords = res['result']['total_records'];
    });
  }
}

