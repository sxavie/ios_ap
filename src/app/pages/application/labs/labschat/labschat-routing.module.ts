import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabschatPage } from './labschat.page';

const routes: Routes = [
  {
    path: '',
    component: LabschatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabschatPageRoutingModule {}
