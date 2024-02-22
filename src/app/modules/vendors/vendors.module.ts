import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorsRoutingModule } from './vendors-routing.module';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxImgModule } from 'ngx-img'
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../material.module';
import { AgmCoreModule } from '@agm/core';
import { OutletDetailsComponent } from './create-vendor/components/outlet-details/outlet-details.component';
import { FssaiDetailsComponent } from './create-vendor/components/fssai-details/fssai-details.component';
import { CommisionOnboardingComponent } from './create-vendor/components/commision-onboarding/commision-onboarding.component';
import { OwnerLocationDetailsComponent } from './create-vendor/components/owner-location-details/owner-location-details.component';
import { GstPanDetailsComponent } from './create-vendor/components/gst-pan-details/gst-pan-details.component';
import { BankDetailsComponent } from './create-vendor/components/bank-details/bank-details.component';
import { ESignComponent } from './create-vendor/components/e-sign/e-sign.component';
import { OnboardingFormComponent } from './create-vendor/components/onboarding-form/onboarding-form.component';
import { environment } from 'src/environments/environment';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { CongratulationsDialogComponent } from './create-vendor/components/congratulations-dialog/congratulations-dialog.component';
// import { GoogleMapsModule } from '@angular/google-maps'
import { NgxPaginationModule } from 'ngx-pagination';
import { RiderDetailsComponent } from './create-vendor/components/rider-details/rider-details.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ViewGstDeclarationComponent } from './create-vendor/components/view-gst-declaration/view-gst-declaration.component';
import { ReadMouDialogComponent } from './create-vendor/components/read-mou-dialog/read-mou-dialog.component';
@NgModule({
  declarations: [
    CreateVendorComponent,
    OutletDetailsComponent,
    FssaiDetailsComponent,
    CommisionOnboardingComponent,
    OwnerLocationDetailsComponent,
    GstPanDetailsComponent,
    BankDetailsComponent,
    ESignComponent,
    OnboardingFormComponent,
    CongratulationsDialogComponent,
    RiderDetailsComponent,
    ViewGstDeclarationComponent,
    ReadMouDialogComponent
  ],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxImgModule,
    FlexLayoutModule,
    MaterialModule,
    NgxPaginationModule,
    NgxMaterialTimepickerModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
      libraries: ['places']
    })
    // GoogleMapsModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-IN' }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VendorsModule { }
