import { PharmacyComponent } from './pharmacy/pharmacy.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/components/auth-guard/auth.guard';
import { FoodHistoryComponent } from './food/food-history/food-history.component';
import { FoodComponent } from './food/food.component';
import { GroceryHistoryComponent } from './grocery/grocery-history/grocery-history.component';
import { GroceryComponent } from './grocery/grocery.component';
import { HomeComponent } from './home.component';
import { RiderHistoryComponent } from './rider/rider-history/rider-history.component';
import { RiderComponent } from './rider/rider.component';
import { PharmacyHistoryComponent } from './pharmacy/pharmacy-history/pharmacy-history.component';
import { Services } from 'src/app/shared/models/constants/vendor-registration-types';
import { PaanComponent } from './paan/paan.component';
import { PaanHistoryComponent } from './paan/paan-history/paan-history.component';
import { FlowerComponent } from './flower/flower.component';
import { FlowerHistoryComponent } from './flower/flower-history/flower-history.component';
import { PetComponent } from './pet/pet.component';
import { PetHistoryComponent } from './pet/pet-history/pet-history.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'food',
        component: FoodComponent,
        data: { title: `[F] All Outlets` }
      },
      {
        path: 'food-history',
        component: FoodHistoryComponent,
        data: { title: `[F] Outlets History` },
        canActivate: [AuthGuard]
      },
      {
        path: 'grocery',
        component: GroceryComponent,
        data: { title: `[G] All Outlets` }
      },
      {
        path: 'grocery-history',
        component: GroceryHistoryComponent,
        data: { title: `[G] Outlets History` },
        canActivate: [AuthGuard]
      },
      {
        path: 'rider',
        component: RiderComponent,
        data: { title: `[R] All Riders` }
      },
      {
        path: 'rider-history',
        component: RiderHistoryComponent,
        data: { title: `[R] Riders History` }
      },
      {
        path: 'pharmacy',
        component: PharmacyComponent,
        data: { title: `[P] All Outlets` }
      },
      {
        path: 'pharmacy-history',
        component: PharmacyHistoryComponent,
        data: { title: `[P] Outlets History` },
        canActivate: [AuthGuard]
      },
      {
        path: 'paan',
        component: PaanComponent,
        data: { title: `[P] All Outlets` }
      },
      {
        path: 'paan-history',
        component: PaanHistoryComponent,
        data: { title: `[P] Outlets History` },
        canActivate: [AuthGuard]
      },
      {
        path: 'flower',
        component: FlowerComponent,
        data: { title: `[F] All Outlets` }
      },
      {
        path: 'flower-history',
        component: FlowerHistoryComponent,
        data: { title: `[F] Outlets History` },
        canActivate: [AuthGuard]
      },
      {
        path: 'pet',
        component: PetComponent,
        data: { title: `[P] All Outlets` }
      },
      {
        path: 'pet-history',
        component: PetHistoryComponent,
        data: { title: `[P] Outlets History` },
        canActivate: [AuthGuard]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
