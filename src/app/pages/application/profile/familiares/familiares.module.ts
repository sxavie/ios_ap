import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamiliaresPageRoutingModule } from './familiares-routing.module';

import { FamiliaresPage } from './familiares.page';

import { ImagePipe } from '../../../../pipes/image.pipe';



@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    IonicModule,
    FamiliaresPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FamiliaresPage, ImagePipe]
})
export class FamiliaresPageModule {}
