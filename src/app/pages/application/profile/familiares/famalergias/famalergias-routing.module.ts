import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamalergiasPage } from './famalergias.page';

const routes: Routes = [
  {
    path: '',
    component: FamalergiasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamalergiasPageRoutingModule {}
