import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MotivosPageRoutingModule } from './motivos-routing.module';

import { MotivosPage } from './motivos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MotivosPageRoutingModule
  ],
  declarations: [MotivosPage]
})
export class MotivosPageModule {}
