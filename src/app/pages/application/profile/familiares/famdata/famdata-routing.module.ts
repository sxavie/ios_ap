import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamdataPage } from './famdata.page';

const routes: Routes = [
  {
    path: '',
    component: FamdataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamdataPageRoutingModule {}
