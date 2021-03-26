import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamalergiasPageRoutingModule } from './famalergias-routing.module';

import { FamalergiasPage } from './famalergias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamalergiasPageRoutingModule
  ],
  declarations: [FamalergiasPage]
})
export class FamalergiasPageModule {}
