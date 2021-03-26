import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchasechatPageRoutingModule } from './purchasechat-routing.module';

import { PurchasechatPage } from './purchasechat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchasechatPageRoutingModule
  ],
  declarations: [PurchasechatPage]
})
export class PurchasechatPageModule {}
