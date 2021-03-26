import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutletappPage } from './outletapp.page';

const routes: Routes = [
  {
    path: '',
    component: OutletappPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'consultas',
        loadChildren: () => import('./consultas/consultas.module').then(m => m.ConsultasPageModule)
      },
      {
        path: 'resacas',
        loadChildren: () => import('./resacas/resacas.module').then(m => m.ResacasPageModule)
      },
      {
        path: 'labs',
        loadChildren: () => import('./labs/labs.module').then(m => m.LabsPageModule)
      },
      {
        path: 'farmacia',
        loadChildren: () => import('./farmacia/farmacia.module').then(m => m.FarmaciaPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('./profile/perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: 'datosgenerales',
        loadChildren: () => import('./profile/datosgenerales/datosgenerales.module').then(m => m.DatosgeneralesPageModule)
      },
      {
        path: 'alergias',
        loadChildren: () => import('./profile/alergias/alergias.module').then(m => m.AlergiasPageModule)
      },
      {
        path: 'historialmedico',
        loadChildren: () => import('./profile/historialmedico/historialmedico.module').then(m => m.HistorialmedicoPageModule)
      },
      {
        path: 'familiares',
        loadChildren: () => import('./profile/familiares/familiares.module').then(m => m.FamiliaresPageModule)
      },
      {
        path: 'metodopago',
        loadChildren: () => import('./profile/metodopago/metodopago.module').then(m => m.MetodopagoPageModule)
      },
      {
        path: 'agregarpago',
        loadChildren: () => import('./profile/agregarpago/agregarpago.module').then(m => m.AgregarpagoPageModule)
      },
      {
        path: 'agregarfamiliar',
        loadChildren: () => import('./profile/agregarfamiliar/agregarfamiliar.module').then(m => m.AgregarfamiliarPageModule)
      },
      {
        path: 'videocall',
        loadChildren: () => import('./videocall/videocall.module').then(m => m.VideocallPageModule)
      },
      {
        path: 'help',
        loadChildren: () => import('../ayuda/ayuda.module').then(m => m.AyudaPageModule)
      },
      {
        path: '',
        redirectTo: '/app/home',
        pathMatch: 'full'
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutletappPageRoutingModule { }
