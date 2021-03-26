import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarpagoPage } from './agregarpago.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarpagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarpagoPageRoutingModule {}
