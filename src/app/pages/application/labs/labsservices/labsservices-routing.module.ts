import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabsservicesPage } from './labsservices.page';

const routes: Routes = [
  {
    path: '',
    component: LabsservicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabsservicesPageRoutingModule {}
