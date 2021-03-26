import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ViewWillEnter } from '@ionic/angular';
import { NewaddressComponent } from 'src/app/components/newaddress/newaddress.component';
import { AddressService } from 'src/app/services/address.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { LabsService } from 'src/app/services/labs.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
	selector: 'app-labaddresses',
	templateUrl: './labaddresses.page.html',
	styleUrls: ['./labaddresses.page.scss'],
})
export class LabaddressesPage implements OnInit, ViewWillEnter {

	public myAddresses: any[] = [];
	public selectedAddress;
	public loading;

	constructor(private addressservice: AddressService,
		private router: Router,
		private alertsservice: AlertsService,
		private labsservices: LabsService,
		private loadingCtrl: LoadingController,
		private modalCtrl: ModalController
	) { }

	ionViewWillEnter() {
		this.getAddressList();
	}

	ngOnInit() { }

	labs_next() {

		if (!this.selectedAddress) {
			this.alertsservice.showAlert('No ha seleccionado una dirección para programar la visita', 'Dirección')
			return;
		}

		this.labsservices.serviceFlowJSONData.data.addressID = this.selectedAddress._id;
		this.labsservices.temp_address_service = this.selectedAddress;

		this.router.navigate(['/app/labs/labscheckout'])

	}

	async getAddressList() {

		this.loading = await this.loadingCtrl.create({
			spinner: 'lines-small',
			message: 'Cargando direcciones...',
		});

		await this.loading.present();

		this.addressservice.getAddress().subscribe((addresses: any) => {
			this.myAddresses = addresses;
			this.loading.dismiss();
		});

	}

	async showAddressModal() {

		const addressModal = await this.modalCtrl.create({
			cssClass: 'address-modal',
			component: NewaddressComponent
		});
		await addressModal.present();

		const data: any = await addressModal.onWillDismiss()
		if (data.data) 
			this.getAddressList()

	}



}
