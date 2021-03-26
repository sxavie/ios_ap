import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasetrackPage } from './purchasetrack.page';

const routes: Routes = [
  {
    path: '',
    component: PurchasetrackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasetrackPageRoutingModule {}
