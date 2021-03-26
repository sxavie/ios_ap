import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabsinroutePageRoutingModule } from './labsinroute-routing.module';

import { LabsinroutePage } from './labsinroute.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabsinroutePageRoutingModule
  ],
  declarations: [LabsinroutePage]
})
export class LabsinroutePageModule {}
