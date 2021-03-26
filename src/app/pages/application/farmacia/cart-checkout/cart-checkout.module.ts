import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartCheckoutPageRoutingModule } from './cart-checkout-routing.module';

import { CartCheckoutPage } from './cart-checkout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartCheckoutPageRoutingModule
  ],
  declarations: [CartCheckoutPage]
})
export class CartCheckoutPageModule {}
