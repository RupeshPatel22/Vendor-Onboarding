import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormErrorMsgComponent } from './form-error-msg/form-error-msg.component';
import { ConfirmationModalModule } from './confirmation-modal/confirmation-modal.module';

import { ToastComponent } from './toast/toast.component';
import { Page404Component } from './page404/page404.component';

@NgModule({
  declarations: [
    ToastComponent,
    FormErrorMsgComponent,
    Page404Component,
  ],
  imports: [CommonModule, ConfirmationModalModule],
  exports: [
    ToastComponent,
    FormErrorMsgComponent,
  ],
})
export class ComponentsModule { }
