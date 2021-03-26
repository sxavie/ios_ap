import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabpaymethodPageRoutingModule } from './labpaymethod-routing.module';

import { LabpaymethodPage } from './labpaymethod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabpaymethodPageRoutingModule
  ],
  declarations: [LabpaymethodPage]
})
export class LabpaymethodPageModule {}
