import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OutletCard, OutletCardStatusList } from 'src/app/shared/models/constants/vendor-registration-types';
@Component({
  selector: 'app-outlet-card',
  templateUrl: './outlet-card.component.html',
  styleUrls: ['./outlet-card.component.scss']
})
export class OutletCardComponent implements OnInit {
  @Input() outlet: OutletCard;
  readonly outletCardStatusList = OutletCardStatusList;
  constructor(private router: Router) { }
  ngOnInit(): void { }

  /**
   * Method that navigates to vendor details page with view/edit mode based on status
   * @param outlet 
   */
  navigateToVendorFormPage(outlet: OutletCard) {
    if (outlet.status === 'draft' || outlet.status === 'approvalRejected') {
      this.router.navigate(['vendors/create-vendor', outlet.id], { queryParams: { service: outlet.service } });
    } else {
      this.router.navigate(['vendors/view-vendor', outlet.id], { queryParams: { service: outlet.service } });
    }
  }
}
