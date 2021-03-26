import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MetodopagoPageRoutingModule } from './metodopago-routing.module';
import { MetodopagoPage } from './metodopago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetodopagoPageRoutingModule
  ],
  declarations: [MetodopagoPage] 
})
export class MetodopagoPageModule {}
