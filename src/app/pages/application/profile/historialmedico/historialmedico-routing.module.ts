import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialmedicoPage } from './historialmedico.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialmedicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialmedicoPageRoutingModule {}
