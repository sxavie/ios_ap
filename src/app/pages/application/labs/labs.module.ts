import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabsPageRoutingModule } from './labs-routing.module';

import { LabsPage } from './labs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabsPageRoutingModule
  ],
  declarations: [LabsPage]
})
export class LabsPageModule {}
