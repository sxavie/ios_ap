import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarfamiliarPage } from './agregarfamiliar.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarfamiliarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarfamiliarPageRoutingModule {}
