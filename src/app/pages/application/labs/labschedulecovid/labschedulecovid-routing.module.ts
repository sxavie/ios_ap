import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabschedulecovidPage } from './labschedulecovid.page';

const routes: Routes = [
  {
    path: '',
    component: LabschedulecovidPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabschedulecovidPageRoutingModule {}
