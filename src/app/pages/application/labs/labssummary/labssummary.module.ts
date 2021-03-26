import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabssummaryPageRoutingModule } from './labssummary-routing.module';

import { LabssummaryPage } from './labssummary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabssummaryPageRoutingModule
  ],
  declarations: [LabssummaryPage]
})
export class LabssummaryPageModule {}
