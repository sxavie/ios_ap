import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabschatPageRoutingModule } from './labschat-routing.module';

import { LabschatPage } from './labschat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabschatPageRoutingModule
  ],
  declarations: [LabschatPage]
})
export class LabschatPageModule {}
