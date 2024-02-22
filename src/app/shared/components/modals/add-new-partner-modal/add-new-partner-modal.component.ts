import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
import { FormControl, Validators } from '@angular/forms';
import { Services } from 'src/app/shared/models/constants/vendor-registration-types';
@Component({
  selector: 'app-add-new-partner-modal',
  templateUrl: './add-new-partner-modal.component.html',
  styleUrls: ['./add-new-partner-modal.component.scss'],
})
export class AddNewPartnerModalComponent implements OnInit {
  vendorCategory = Object.values(Services);
  selectVendorCategory = new FormControl(null, [Validators.required]);
  outletName = new FormControl('', [Validators.required]);
  showOutletNameField: boolean = false;
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<AddNewPartnerModalComponent>,
    private vendorService: VendorRegistrationService
  ) { }
  ngOnInit(): void {
    this.vendorCategory.splice(this.vendorCategory.indexOf(Services.Rider), 1); // deleting rider from array
  }
  createOutlet() {
    if (this.selectVendorCategory.status === 'INVALID' || this.outletName.status === 'INVALID') {
      this.selectVendorCategory.markAsTouched();
      this.outletName.markAsTouched();
      return;
    }
    const data = {
      name: this.outletName.value
    }
    this.vendorService.createNewOutlet(data).subscribe((data) => {
      const res = data;
      this.router.navigate(['vendors/create-vendor', res['result']['id']], { queryParams: { service: this.vendorService.service } });
      this.dialogRef.close();
    });
  }
  vendorCategorySelectionChange() {
    this.vendorService.service = this.selectVendorCategory.value;
  }
  closeModal() {
    this.dialogRef.close();
  }
}
