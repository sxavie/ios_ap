import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabscheckoutPageRoutingModule } from './labscheckout-routing.module';

import { LabscheckoutPage } from './labscheckout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabscheckoutPageRoutingModule
  ],
  declarations: [LabscheckoutPage]
})
export class LabscheckoutPageModule {}
