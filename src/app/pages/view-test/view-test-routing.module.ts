import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTestPage } from './view-test.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTestPageRoutingModule {}
