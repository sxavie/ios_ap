import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FamiliaresPage } from './familiares.page';

const routes: Routes = [
  {
    path: '',
    component: FamiliaresPage
  },
  {
    path: 'familiar/:id',
    loadChildren: () => import('./familiar/familiar.module').then( m => m.FamiliarPageModule)
  },
  {
    path: 'famalergias',
    loadChildren: () => import('./famalergias/famalergias.module').then( m => m.FamalergiasPageModule)
  },
  {
    path: 'famhistory',
    loadChildren: () => import('./famhistory/famhistory.module').then( m => m.FamhistoryPageModule)
  },
  {
    path: 'famdata',
    loadChildren: () => import('./famdata/famdata.module').then( m => m.FamdataPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamiliaresPageRoutingModule {}
