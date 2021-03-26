import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SummaryPageRoutingModule } from './summary-routing.module';
import { SummaryPage } from './summary.page';

import { NgxStarsModule } from 'ngx-stars';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SummaryPageRoutingModule,
    NgxStarsModule
  ],
  declarations: [SummaryPage]
})
export class SummaryPageModule {}
