import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutletappPageRoutingModule } from './outletapp-routing.module';

import { OutletappPage } from './outletapp.page';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutletappPageRoutingModule,
    ComponentsModule
  ],
  declarations: [OutletappPage]
})
export class OutletappPageModule {}
