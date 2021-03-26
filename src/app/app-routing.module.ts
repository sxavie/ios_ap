import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';

const routes: Routes = [
  // Publicas
  // {
  //   path: '',
  //   loadChildren: () => import('./pages/application/farmacia/products/products.module').then( m => m.ProductsPageModule )
  // },
  {
    path: '',
    loadChildren: () => import('./pages/auth/inicio/inicio.module').then( m => m.InicioPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/application/outletapp.module').then( m => m.OutletappPageModule),
    canActivate: [HomeGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'verifyaccount',
    loadChildren: () => import('./pages/auth/verifyaccount/verifyaccount.module').then( m => m.VerifyaccountPageModule)
  },
  {
    path: 'forgotpwd',
    loadChildren: () => import('./pages/auth/forgotpwd/forgotpwd.module').then( m => m.ForgotpwdPageModule)
  },
  {
    path: 'verifyfpwdpin',
    loadChildren: () => import('./pages/auth/verifyfpwdpin/verifyfpwdpin.module').then( m => m.VerifyfpwdpinPageModule)
  },
  {
    path: 'changepwdreq',
    loadChildren: () => import('./pages/auth/changepwdreq/changepwdreq.module').then( m => m.ChangepwdreqPageModule)
  },
  {
    path: 'view-test',
    loadChildren: () => import('./pages/view-test/view-test.module').then( m => m.ViewTestPageModule)
  },
  {
    path: 'mapbox',
    loadChildren: () => import('./pages/mapbox/mapbox.module').then( m => m.MapboxPageModule)
  }

];

@NgModule({
  imports: [
      RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
