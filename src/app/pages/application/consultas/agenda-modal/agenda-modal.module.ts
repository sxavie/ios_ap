import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendaModalPageRoutingModule } from './agenda-modal-routing.module';

import { AgendaModalPage } from './agenda-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaModalPageRoutingModule
  ],
  declarations: [AgendaModalPage]
})
export class AgendaModalPageModule {}
