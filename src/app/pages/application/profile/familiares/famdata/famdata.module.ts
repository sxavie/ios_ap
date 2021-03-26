import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamdataPageRoutingModule } from './famdata-routing.module';

import { FamdataPage } from './famdata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamdataPageRoutingModule
  ],
  declarations: [FamdataPage]
})
export class FamdataPageModule {}
