import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabpaymethodPage } from './labpaymethod.page';

const routes: Routes = [
  {
    path: '',
    component: LabpaymethodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabpaymethodPageRoutingModule {}
