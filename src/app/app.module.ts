import { ComponentsModule } from './shared/components/components.module';
import { DirectivesModule } from './shared/directives/directives.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { OtpComponent } from './modules/login/otp/otp.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from './core/interceptors/http-request-interceptors';
import { LoginService } from './shared/services/login.service';
import { NgOtpInputModule } from 'ng-otp-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule, Routes } from '@angular/router';
import { AddNewPartnerModalComponent } from './shared/components/modals/add-new-partner-modal/add-new-partner-modal.component';
import { MaterialModule } from '../material.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { AdminComponent } from './modules/admin/admin.component';
import { ServerErrorPageComponent } from './shared/components/server-error-page/server-error-page.component'
import { NgxPaginationModule } from 'ngx-pagination';
import { RegisterComponent } from './modules/login/register/register.component';
import { ExceptionHandlerService } from './shared/services/exception-handler.service';
const appRoutes: Routes = [];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OtpComponent,
    AddNewPartnerModalComponent,
    AdminComponent,
    ServerErrorPageComponent,
    RegisterComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    DirectivesModule,
    ComponentsModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    HttpClientModule,
    NgSelectModule,
    MatSidenavModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 2000,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    LoginService,
    { provide: ErrorHandler, useClass: ExceptionHandlerService }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddNewPartnerModalComponent],
})
export class AppModule {
  constructor() { }
}
