import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyaccountPageRoutingModule } from './verifyaccount-routing.module';

import { VerifyaccountPage } from './verifyaccount.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyaccountPageRoutingModule
  ],
  declarations: [VerifyaccountPage]
})
export class VerifyaccountPageModule {}
