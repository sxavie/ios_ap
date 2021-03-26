import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetodopagoPage } from './metodopago.page';

const routes: Routes = [
  {
    path: '',
    component: MetodopagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetodopagoPageRoutingModule {}
