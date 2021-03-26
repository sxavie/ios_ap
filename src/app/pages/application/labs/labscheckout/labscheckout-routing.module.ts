import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabscheckoutPage } from './labscheckout.page';

const routes: Routes = [
  {
    path: '',
    component: LabscheckoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabscheckoutPageRoutingModule {}
