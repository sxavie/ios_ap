import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyfpwdpinPageRoutingModule } from './verifyfpwdpin-routing.module';

import { VerifyfpwdpinPage } from './verifyfpwdpin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyfpwdpinPageRoutingModule
  ],
  declarations: [VerifyfpwdpinPage]
})
export class VerifyfpwdpinPageModule {}
