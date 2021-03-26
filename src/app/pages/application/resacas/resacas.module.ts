import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResacasPageRoutingModule } from './resacas-routing.module';

import { ResacasPage } from './resacas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResacasPageRoutingModule
  ],
  declarations: [ResacasPage]
})
export class ResacasPageModule {}
