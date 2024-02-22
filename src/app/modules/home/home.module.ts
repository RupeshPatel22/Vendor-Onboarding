import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { OutletCardComponent } from './outlet-card/outlet-card.component';
import { FoodComponent } from './food/food.component';
import { GroceryComponent } from './grocery/grocery.component';
import { FoodHistoryComponent } from './food/food-history/food-history.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroceryHistoryComponent } from './grocery/grocery-history/grocery-history.component';
import { RiderComponent } from './rider/rider.component';
import { RiderHistoryComponent } from './rider/rider-history/rider-history.component';
import { PharmacyComponent } from './pharmacy/pharmacy.component';
import { PharmacyHistoryComponent } from './pharmacy/pharmacy-history/pharmacy-history.component';
import { PaanComponent } from './paan/paan.component';
import { PaanHistoryComponent } from './paan/paan-history/paan-history.component';
import { FlowerComponent } from './flower/flower.component';
import { FlowerHistoryComponent } from './flower/flower-history/flower-history.component';
import { PetComponent } from './pet/pet.component';
import { PetHistoryComponent } from './pet/pet-history/pet-history.component';
@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    HomeComponent,
    OutletCardComponent,
    FoodComponent,
    GroceryComponent,
    FoodHistoryComponent,
    GroceryHistoryComponent,
    RiderComponent,
    RiderHistoryComponent,
    PharmacyComponent,
    PharmacyHistoryComponent,
    PaanComponent,
    PaanHistoryComponent,
    FlowerComponent,
    FlowerHistoryComponent,
    PetComponent,
    PetHistoryComponent
  ]
})
export class HomeModule {
}
