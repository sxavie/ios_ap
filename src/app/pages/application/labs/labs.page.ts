import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { AddressService } from 'src/app/services/address.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { LabsService } from 'src/app/services/labs.service';
import { PayMethodsService } from 'src/app/services/paymethods.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-labs',
	templateUrl: './labs.page.html',
	styleUrls: ['./labs.page.scss'],
})
export class LabsPage implements OnInit {

	public labSelected;
	public labsList: any;

	public viewSegment = 'history';

	public apiUrl_img = environment.apiUrl;

	constructor(private router: Router,
		private alertsservice: AlertsService,
		private labsservices: LabsService,
		private loadingCtrl: LoadingController,
		private paymethodService: PayMethodsService,
		private alertController: AlertController,
		private addressservice: AddressService) { }

	ngOnInit() {
		this.getServices();
	}

	async getServices() {
		this.getAddressList();
		// this.getCardsList();
		this.getLabsList();
	}


	next() {

		if (!this.labSelected) {
			this.alertsservice.showAlert('Seleccione un laboratorio', 'Laboratorios')
			return;
		}

		this.router.navigate(['app/labs/labsservices']);
	}


	// API services consume
	getLabsList() {
		this.apiUrl_img += '/images/medicalCenters/'

		this.loadingCtrl.create({
			spinner: 'lines-small'
		}).then((spinner) => {
			spinner.present();
		});

		this.labsservices.getLabs().toPromise()
			.then((labsData: any) => {
				this.labsList = labsData.data;
			})
			.catch((err) => {
				this.alertsservice.showToast('Hubo un error al cargar los laboratorios', 1500, 'danger')
			})
			.finally(() => this.loadingCtrl.dismiss());
	}

	getAddressList() {

		this.addressservice.getAddress().toPromise()
			.then((addressListResp:any) => {

				if(addressListResp.length < 1)
					this.showAddAlert(false, 'Agregue una dirección', 'Dirección')
				
			})
			.catch(err => throwError(err))
			// .finally( () => console.log('Respuesta Direcciones'))
	}

	// se quito
	getCardsList() {

		this.paymethodService.getPayMethods().toPromise()
			.then((listPayMethodsResp: any) => {

				if (!listPayMethodsResp.codigo)
					this.showAddAlert(true, listPayMethodsResp, 'Método de pago')

			})
			.catch(err => throwError(err))
			// .finally(() => console.log('Respuesta Tarjetas'))
	}

	// Axu Functions
	setLab(htmlRef, labId) {
		this.labsservices.selectedLabID = labId;
		let slots = document.getElementsByClassName('slotCard')

		for (let i = 0; i < slots.length; i++) {
			slots[i].classList.remove('default')
		}
		htmlRef.classList.add('default')
		this.labSelected = htmlRef
	}

	async showAddAlert(isCard, message, header) {

		const alert = await this.alertController.create({
			header,
			message,
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						this.router.navigate(['/app/home'])
						return;
					},
				}, {
					text: 'Agregar',
					handler: () => {
						const navigate = (isCard) ? 'app/metodopago' : '/app/farmacia/addresses'
						this.router.navigate([navigate])
						return;
					}

				},
			]
	});

		await alert.present();
	}




}
