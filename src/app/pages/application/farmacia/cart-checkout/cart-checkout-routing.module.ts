import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartCheckoutPage } from './cart-checkout.page';

const routes: Routes = [
  {
    path: '',
    component: CartCheckoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartCheckoutPageRoutingModule {}
