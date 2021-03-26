import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabssummaryPage } from './labssummary.page';

const routes: Routes = [
  {
    path: '',
    component: LabssummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabssummaryPageRoutingModule {}
