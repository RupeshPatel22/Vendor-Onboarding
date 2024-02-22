import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { Services } from 'src/app/shared/models/constants/vendor-registration-types';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';

@Component({
  selector: 'app-commision-onboarding',
  templateUrl: './commision-onboarding.component.html',
  styleUrls: ['./commision-onboarding.component.scss']
})
export class CommisionOnboardingComponent implements OnInit {

  @Input() disableAll: boolean;
  @Output() changeTab = new EventEmitter<string>();
  valid: boolean;
  outletId: string;
  service: string;
  readonly services = Services;
  constructor(private activeRoute: ActivatedRoute, private vendorService: VendorRegistrationService,
    private toastMsgService: ToastService) {
    this.outletId = this.activeRoute.snapshot.paramMap.get('outletId');
    this.service = this.activeRoute.snapshot.queryParams['service'];

  }

  ngOnInit(): void {
  }

  /**
  * Method that checks validity of form and emits event
  * to go to next page
  */
  next() {
    this.valid = true;
    if (!this.disableAll) {
      const formData = {}
      formData['status'] = 'draft';
      formData['tnc_accepted'] = true;
      formData['draft_section'] = "2";
      this.vendorService.saveOutletDetails(this.outletId, formData).subscribe(res => {
        this.changeTab.emit();
      });
    } else {
      this.changeTab.emit();
    }
  }

  /**
  * Method that emits event to go to previous page
  */
  previous() {
    this.changeTab.emit('back')
  }

}
