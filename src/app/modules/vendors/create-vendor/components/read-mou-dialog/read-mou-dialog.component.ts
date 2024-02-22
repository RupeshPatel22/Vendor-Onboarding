import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';
import { Area, BankDetails, City, Cuisine, ESignDetails, FssaiDetails, GstPanDetails, Language, OnboardingDetails, OwnerLocationDetails, OutletDetails } from '../../../../../shared/models/constants/vendor-registration-types';

@Component({
  selector: 'app-read-mou-dialog',
  templateUrl: './read-mou-dialog.component.html',
  styleUrls: ['./read-mou-dialog.component.scss']
})
export class ReadMouDialogComponent implements OnInit {
  ownerName: string;
  ownerContactNumber: string;
  ownerEmailId: string;
  outletName: string;
  outletAddress: string;
  fssaiNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
  currentDate = new Date();
  gstCategoryType: string;
  service: string;
  entityName: string;


  constructor(private vendorService: VendorRegistrationService, private activeRoute: ActivatedRoute) { 
    this.service = this.activeRoute.snapshot.queryParams['service'];
  }

  ngOnInit(): void {
    this.ownerName = this.vendorService.ownerLocationDetails.ownerName;
    this.ownerContactNumber = this.vendorService.ownerLocationDetails.ownerContactNumber;
    this.ownerEmailId = this.vendorService.ownerLocationDetails.ownerEmailId;
    this.outletName = this.vendorService.outletDetails.outletName;
    this.outletAddress = this.vendorService.fssaiDetails.fssaiAddress;
    this.entityName = this.vendorService.gstPanDetails.businessEntityName;
    if(this.vendorService.fssaiDetails.hasFssaiCertificate){
      this.fssaiNumber = this.vendorService.fssaiDetails.fssaiRegisterNumber;
    }
    else{
      this.fssaiNumber = this.vendorService.fssaiDetails.fssaiAcknowledgementNumber;
    }

    this.bankAccountNumber = this.vendorService.bankDetails.accountNumber;
    this.ifscCode = this.vendorService.bankDetails.ifscCode;
    this.gstCategoryType= this.vendorService.gstPanDetails.gstCategory;
  }

}
