import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangepwdreqPage } from './changepwdreq.page';

const routes: Routes = [
  {
    path: '',
    component: ChangepwdreqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangepwdreqPageRoutingModule {}
