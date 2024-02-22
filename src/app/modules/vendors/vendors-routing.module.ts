import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/components/auth-guard/auth.guard';
import { ReadMouDialogComponent } from './create-vendor/components/read-mou-dialog/read-mou-dialog.component';
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
const routes: Routes = [
  {
    path: 'create-vendor/:outletId',
    component: CreateVendorComponent,
    data: { title: 'Create Vendor' }
  },
  {
    path: 'view-vendor/:outletId',
    component: CreateVendorComponent,
    data: { kind: 'view', title: 'View Vendor' }
  },
  {
    path: "read-mou-dialog",
    component: ReadMouDialogComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsRoutingModule { }
