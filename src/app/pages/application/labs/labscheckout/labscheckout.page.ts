import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadChildrenCallback, Router } from '@angular/router';
import { AlertController, LoadingController, ViewWillEnter } from '@ionic/angular';
import { throwError } from 'rxjs';
import { AddressService } from 'src/app/services/address.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { LabsService } from 'src/app/services/labs.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
	selector: 'app-labscheckout',
	templateUrl: './labscheckout.page.html',
	styleUrls: ['./labscheckout.page.scss'],
})
export class LabscheckoutPage implements OnInit, ViewWillEnter {

	public addressList;
	public meetingAddress;

	public cuponCode;
	public cuponValidationClass;

	public checkout_address = this.labsservices.temp_address_service;
	public checkout_payment = this.labsservices.temp_paymenthod_service;
	public checkout_FLOWData = this.labsservices.serviceFlowJSONData.data;
	public checkout_services = {
		totalPrice: '',
		totalKm: '',
		subtotal: '',
		servicesList: [],
		ServicesNumber: 0
	};

	constructor(private addresservice: AddressService,
		private userservice: UserService,
		private alertsservice: AlertsService,
		private labsservices: LabsService,
		private orderservice: OrderService,
		private router: Router,
		private loaderCtrl: LoadingController,
		private alertCtrl: AlertController) { }

	ngOnInit() {

	}

	ionViewWillEnter() {
		this.sendServicesID();
	}

	async sendServicesID() {

		let load = this.alertsservice.createLoader('Cargado servicios')
			; (await load).present()

		this.labsservices.getLabServiceResume().toPromise()
			.then((getResumeResp: any) => {

				if (!getResumeResp.codigo)
					this.alertsservice.showToast(getResumeResp.message, 2000, 'warning', 'top')

				if (getResumeResp.servicios)
					this.prepareData(getResumeResp)
				else
					this.alertsservice.showToast('Error al cargar la informacion de los servicios', 2000, 'warning', 'top')

			})
			.catch(err => throwError(err))
			.finally(async () => {
				(await load).dismiss();
				this.alertsservice.showAlert('Recuerda que es necesario un ayuno de 6 horas antes de tu laboratorio', 'Laboratorios');
			})
	}

	prepareData(data) {

		this.checkout_services.servicesList = data.servicios;
		this.checkout_services.totalPrice = data.total;
		this.checkout_services.subtotal = data.subtotal;
		this.checkout_services.totalKm = data.traslado;
		this.checkout_services.ServicesNumber = data.servicios.length;
	}

	async requestServices() {

		const loading = await this.loaderCtrl.create({
			spinner: 'lines-small',
			message: 'Cargando'
		});

		loading.present()

		this.labsservices.serviceFlowJSONData.data.amout = this.checkout_services.totalPrice;

		this.labsservices.saveAppointment().toPromise()
			.then((saveAptmResponse: any) => {

				if (saveAptmResponse.codigo) {
					this.alertsservice.showToast(saveAptmResponse.message, 2000, 'success', 'top')
					this.cleanVars()
					this.router.navigate(['/app/home'])
				} else
					this.alertsservice.showToast('Ocurrio un error al guardar la cita', 2000, 'danger', 'top')

			})
			.catch(err => throwError(err))
			.finally(() => loading.dismiss())

	}

	validarCupon() {

		if (!this.cuponCode) { return }

		this.orderservice.cuponValidation(this.userservice.usuario._id,
			this.cuponCode).subscribe(
				(couponResp: any) => {

					if (couponResp.status) {

						this.alertsservice.nativeToast('El cupón es valido')
						// this.orderservice.newConsultData.coupon = this.cuponCode;
						this.cuponValidationClass = 'codeIsValid';
					} else {
						this.alertsservice.nativeToast('El cupón ya no es valido')
						// this.orderservice.newConsultData.coupon = null;
						this.cuponValidationClass = 'codeIsInvalid';
					}

				}, (err) => {

					if (!err.error.status) {
						this.cuponValidationClass = 'codeIsInvalid';
						this.alertsservice.nativeToast(err.error.message)
						// this.orderservice.newConsultData.coupon = null;
					}
					if (err.status === 0) {
						this.alertsservice.showAlert('Error al conectarse con el servidor', 'Server Error')
					}
				}
			)
	}

	covertPriceToString(price: number = 0): string {
		price.toString();
		return price.toFixed(2)
	}

	cancelarALV() {

		this.labsservices.cancelarEstudio().toPromise()
			.then((cancelResponse: any) => {
				if (cancelResponse.codigo) {
					this.alertsservice.showToast(cancelResponse.message, 2000, 'success', 'top')
					this.router.navigate(['app/'])
				} else
					this.alertsservice.showToast('Error inesperado #10-4', 2000, 'danger', 'top')
			})
			.catch(err => throwError(err))

	}

	cleanVars() {

		this.checkout_address = []
		this.checkout_payment = []
		this.checkout_FLOWData = []
		this.checkout_services = {
			totalPrice: '',
			totalKm: '',
			subtotal: '',
			servicesList: [],
			ServicesNumber: 0
		}
	}

	async goHome() {





		const alert = await this.alertCtrl.create({
			message: 'Tienes una cita generada actualmente, si continuas se cancelara la solicitud. ¿Deseas continuar al inicio?',
			header: 'Servicio',
			buttons: [
				{
					text: 'Continuar',
					handler: () => this.cancelarALV()
				}, {
					text: 'Permanecer'
				}
			]

		});

		alert.present();

	}

}
