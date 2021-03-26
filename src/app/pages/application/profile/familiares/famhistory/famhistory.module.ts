import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamhistoryPageRoutingModule } from './famhistory-routing.module';

import { FamhistoryPage } from './famhistory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamhistoryPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FamhistoryPage]
})
export class FamhistoryPageModule {}
