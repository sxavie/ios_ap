import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasesummaryPage } from './purchasesummary.page';

const routes: Routes = [
  {
    path: '',
    component: PurchasesummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasesummaryPageRoutingModule {}
