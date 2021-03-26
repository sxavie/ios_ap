import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchasetrackPageRoutingModule } from './purchasetrack-routing.module';

import { PurchasetrackPage } from './purchasetrack.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchasetrackPageRoutingModule
  ],
  declarations: [PurchasetrackPage]
})
export class PurchasetrackPageModule {}
