import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosgeneralesPageRoutingModule } from './datosgenerales-routing.module';

import { DatosgeneralesPage } from './datosgenerales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosgeneralesPageRoutingModule
  ],
  declarations: [DatosgeneralesPage]
})
export class DatosgeneralesPageModule {}
