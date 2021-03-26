import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabsPage } from './labs.page';

const routes: Routes = [
  {
    path: '',
    component: LabsPage
  },
  {
    path: 'labschedule',
    loadChildren: () => import('./labschedule/labschedule.module').then( m => m.LabschedulePageModule)
  },
  {
    path: 'labscheckout',
    loadChildren: () => import('./labscheckout/labscheckout.module').then( m => m.LabscheckoutPageModule)
  },
  {
    path: 'labaddresses',
    loadChildren: () => import('./labaddresses/labaddresses.module').then( m => m.LabaddressesPageModule)
  },
  {
    path: 'labpaymethod',
    loadChildren: () => import('./labpaymethod/labpaymethod.module').then( m => m.LabpaymethodPageModule)
  },  {
    path: 'labsservices',
    loadChildren: () => import('./labsservices/labsservices.module').then( m => m.LabsservicesPageModule)
  },
  {
    path: 'labsinroute',
    loadChildren: () => import('./labsinroute/labsinroute.module').then( m => m.LabsinroutePageModule)
  },
  {
    path: 'labssummary',
    loadChildren: () => import('./labssummary/labssummary.module').then( m => m.LabssummaryPageModule)
  },
  {
    path: 'labschat',
    loadChildren: () => import('./labschat/labschat.module').then( m => m.LabschatPageModule)
  },
  {
    path: 'labschedulecovid',
    loadChildren: () => import('./labschedulecovid/labschedulecovid.module').then( m => m.LabschedulecovidPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabsPageRoutingModule {}
