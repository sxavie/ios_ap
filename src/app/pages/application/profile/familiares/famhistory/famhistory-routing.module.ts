import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamhistoryPage } from './famhistory.page';

const routes: Routes = [
  {
    path: '',
    component: FamhistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamhistoryPageRoutingModule {}
