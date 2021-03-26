import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyaccountPage } from './verifyaccount.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyaccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyaccountPageRoutingModule {}
