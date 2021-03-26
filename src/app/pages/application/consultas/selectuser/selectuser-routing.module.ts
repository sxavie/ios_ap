import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectuserPage } from './selectuser.page';

const routes: Routes = [
  {
    path: '',
    component: SelectuserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectuserPageRoutingModule {}
