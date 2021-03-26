import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabaddressesPageRoutingModule } from './labaddresses-routing.module';

import { LabaddressesPage } from './labaddresses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabaddressesPageRoutingModule
  ],
  declarations: [LabaddressesPage]
})
export class LabaddressesPageModule {}
