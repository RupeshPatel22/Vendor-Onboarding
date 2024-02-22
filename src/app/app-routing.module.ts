import { ServerErrorPageComponent } from './shared/components/server-error-page/server-error-page.component';
import { AuthGuard } from './shared/components/auth-guard/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { AdminComponent } from './modules/admin/admin.component';
import { Page404Component } from './shared/components/page404/page404.component';
const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  // },
  // { path: '', component: VendorsComponent, canActivate: [AuthGuard] },
  {
    path: '',
    redirectTo: 'home/food',
    pathMatch: 'full'
  },
  { path: 'admin', component: AdminComponent, data: { title: '[Admin] Partner with Speedyy' } },
  { path: 'login', component: LoginComponent, data: { title: 'Partner with Speedyy' }, canActivate: [AuthGuard] },
  {
    path: 'vendors',
    loadChildren: () =>
      import('./modules/vendors/vendors.module').then((m) => m.VendorsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  { path: 'serverError', component: ServerErrorPageComponent, data: { title: 'Internal Server Error' } },
  //Wild Card Route for 404 request
  { path: '**', pathMatch: 'full', component: Page404Component, data: { title: 'Invalid path' } },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
