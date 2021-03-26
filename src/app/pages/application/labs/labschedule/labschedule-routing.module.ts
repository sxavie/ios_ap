import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabschedulePage } from './labschedule.page';

const routes: Routes = [
  {
    path: '',
    component: LabschedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabschedulePageRoutingModule {}
