import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabsservicesPageRoutingModule } from './labsservices-routing.module';

import { LabsservicesPage } from './labsservices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabsservicesPageRoutingModule
  ],
  declarations: [LabsservicesPage]
})
export class LabsservicesPageModule {}
