import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasechatPage } from './purchasechat.page';

const routes: Routes = [
  {
    path: '',
    component: PurchasechatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasechatPageRoutingModule {}
