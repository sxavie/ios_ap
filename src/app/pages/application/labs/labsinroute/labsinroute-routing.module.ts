import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabsinroutePage } from './labsinroute.page';

const routes: Routes = [
  {
    path: '',
    component: LabsinroutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabsinroutePageRoutingModule {}
