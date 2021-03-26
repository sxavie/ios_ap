import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendaModalPage } from './agenda-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AgendaModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaModalPageRoutingModule {}
