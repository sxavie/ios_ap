import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmaciaPage } from './farmacia.page';

const routes: Routes = [
  {
    path: '',
    component: FarmaciaPage,
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
  },{
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },{
    path: 'product-detail/:name',
    loadChildren: () => import('./product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  },{
    path: 'cart-checkout',
    loadChildren: () => import('./cart-checkout/cart-checkout.module').then( m => m.CartCheckoutPageModule)
  },
  {
    path: 'addresses',
    loadChildren: () => import('./addresses/addresses.module').then( m => m.AddressesPageModule)
  },
  {
    path: 'pharmsummary',
    loadChildren: () => import('./pharmsummary/pharmsummary.module').then( m => m.PharmsummaryPageModule)
  },
  {
    path: 'addaddress',
    loadChildren: () => import('./addaddress/addaddress.module').then( m => m.AddaddressPageModule)
  },
  {
    path: 'purchasesummary',
    loadChildren: () => import('./purchasesummary/purchasesummary.module').then( m => m.PurchasesummaryPageModule)
  },
  {
    path: 'purchasetrack',
    loadChildren: () => import('./purchasetrack/purchasetrack.module').then( m => m.PurchasetrackPageModule)
  },
  {
    path: 'purchasechat',
    loadChildren: () => import('./purchasechat/purchasechat.module').then( m => m.PurchasechatPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmaciaPageRoutingModule {}
