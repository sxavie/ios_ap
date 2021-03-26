import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchasesummaryPageRoutingModule } from './purchasesummary-routing.module';

import { PurchasesummaryPage } from './purchasesummary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchasesummaryPageRoutingModule
  ],
  declarations: [PurchasesummaryPage]
})
export class PurchasesummaryPageModule {}
