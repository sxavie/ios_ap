import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResacasPage } from './resacas.page';

const routes: Routes = [
  {
    path: '',
    component: ResacasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResacasPageRoutingModule {}
