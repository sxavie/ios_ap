import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyfpwdpinPage } from './verifyfpwdpin.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyfpwdpinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyfpwdpinPageRoutingModule {}
