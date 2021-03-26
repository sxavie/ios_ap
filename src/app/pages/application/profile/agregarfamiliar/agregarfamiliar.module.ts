import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarfamiliarPageRoutingModule } from './agregarfamiliar-routing.module';

import { AgregarfamiliarPage } from './agregarfamiliar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarfamiliarPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AgregarfamiliarPage]
})
export class AgregarfamiliarPageModule {}
 