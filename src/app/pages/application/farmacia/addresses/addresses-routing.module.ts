import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressesPage } from './addresses.page';

const routes: Routes = [
	{
		path: '',
		component: AddressesPage
	},
	{
		path: 'add',
		loadChildren: () => import('../addaddress/addaddress.module').then( m => m.AddaddressPageModule)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AddressesPageRoutingModule { }
