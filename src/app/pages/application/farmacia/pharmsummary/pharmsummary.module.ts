import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PharmsummaryPageRoutingModule } from './pharmsummary-routing.module';

import { PharmsummaryPage } from './pharmsummary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PharmsummaryPageRoutingModule
  ],
  declarations: [PharmsummaryPage]
})
export class PharmsummaryPageModule {}
