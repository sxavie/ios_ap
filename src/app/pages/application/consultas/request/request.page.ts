import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Capacitor, Plugins } from '@capacitor/core'
import { AlertController, LoadingController, ModalController, ViewWillEnter } from '@ionic/angular';
import { UserService } from 'src/app/services/userservice.service';

import { ChangepaymentComponent } from 'src/app/components/changepayment/changepayment.component';
import { AlertsService } from 'src/app/services/alerts.service';
import { OrderService } from 'src/app/services/order.service';
import { PayMethodsService } from 'src/app/services/paymethods.service';

declare var google;

const { Geolocation } = Capacitor.Plugins;

@Component({
	selector: 'app-request',
	templateUrl: './request.page.html',
	styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit, ViewWillEnter {

	public selAddress;
	public isVirtual = true
	public isIncomming = true;
	public AddrList: any;
	public payLengt: any;

	public cuponCode: string;
	public cuponValidationClass;

	public showSwitch = true;

	public map;
	public myLatLng = { lat: 0, lng: 0 };

	constructor(private loadingCtrl: LoadingController,
		public orderservice: OrderService,
		private router: Router,
		private userservice: UserService,
		private alertsservice: AlertsService,
		private modalCtrl: ModalController,
		private loadCtrl: LoadingController,
		private payservice: PayMethodsService,
		private alertCtrl: AlertController) {

	}
	ionViewWillEnter(): void {

		// consultType = Vierual/Presecial
		// 2 Presencial
		// 1 Virtual 

		switch (this.orderservice.newConsultData.consultReason.toString()) {
			case '1':
				this.connection('virtual')
				break;
			default:
				this.showSwitch = false;
				this.orderservice.newConsultData.consultType = 2
				this.initMap(this.myLatLng, 1, 'current');
				this.isVirtual = false;
				break;
		}

		// if( this.orderservice.newConsultData.consultReason != 1){ }

		this.getAddressList();
	}

	ngOnInit() { }

	async getAddressList() {

		this.payLengt = await this.payservice.getPayMethods().toPromise();

		if (this.payLengt.cards.length > 0) {
			this.userservice.defaultMethod = this.payLengt.cards[0];
		}

		this.AddrList = await this.userservice.getAddressList().toPromise();

	}

	selectedAddress() {

		if (this.selAddress === 'pinMap') {

			this.initMap(this.myLatLng, 1, 'PIN')

		} else {
			let address = this.AddrList.find(x => {
				return x._id === this.selAddress;
			})
			this.myLatLng = {
				lat: address.latitude,
				lng: address.longitude
			}
			this.initMap(this.myLatLng, 2, address.name)
		};

	}

	async reqOrderNow(meeting: boolean) {

		// validacion para virtual tarjeta de credito/debito
		// if( this.isVirtual ) {
		//   this.payLengt = await this.payservice.getPayMethods().toPromise();
		//   console.log(this.payLengt.cards.length);
		if (this.payLengt.cards.length <= 0) {
			this.alertOrderInPorgress()
			return
		}
		//   this.orderservice.newConsultData.paymentMethod = 1
		// } else {
		//   this.orderservice.newConsultData.paymentMethod = (this.userservice.defaultMethod.cardID === 'cash') ? 2 : 1
		// }

		// se agrega esta linea para definir metodos de pago con tarjeta
		this.orderservice.newConsultData.paymentMethod = 1


		this.orderservice.newConsultData.consultType = (this.isVirtual) ? 1 : 2
		this.orderservice.newConsultData.meeting = meeting
		this.orderservice.newConsultData.lat = this.myLatLng.lat
		this.orderservice.newConsultData.lon = this.myLatLng.lng

		let haveSynptoms = [1, 2].includes(this.orderservice.newConsultData.consultReason);

		let navigation = (meeting) ? 'app/consultas/schedule' : (haveSynptoms) ? 'app/consultas/motivos' : 'app/consultas/selectuser'



		// console.log(this.orderservice.newConsultData)

		this.validarCupon()

		this.router.navigate([navigation])

	}

	async changeMethod() {

		const modal = await this.modalCtrl.create({
			component: ChangepaymentComponent,
			cssClass: 'changePay-modal',
			backdropDismiss: false
		});
		modal.onWillDismiss().then(() => {
			// linea selecciona metodo por defaul, codigoDuro reqOrderNow() para dejar newConsultData.paymentMethod = 1
			// this.orderservice.newConsultData.paymentMethod = (this.userservice.defaultMethod.cardID === 'cash') ? 2 : 1
		});
		return await modal.present();

	}

	// Map definition
	async initMap(pos, source, title) {

		const loading = await this.loadCtrl.create({ spinner: 'lines' })
		loading.present();

		let zoom = 16;

		if (source === 1) {
			pos = await this.getCurrentPosition()
			zoom = 18;
		};

		const mapHtml = await document.getElementById('mapa');

		let mapOpts = {
			zoom: zoom,
			center: pos,
			mapTypeControl: false,
			scaleControl: true,
			streetViewControl: false,
			fullscreenControl: false,
			zoomControl: false
		};

		this.map = new google.maps.Map(mapHtml, mapOpts);

		let ico = './assets/tidulogogps.png';

		if (source === 2) {

			// source 2: Usuario selecciona de direcciones guardadas
			const marker = new google.maps.Marker({
				position: pos,
				map: this.map,
				title: title,
				animation: google.maps.Animation.DROP,
				icon: ico
			});

		} else {

			// soruce 1: geolocalizacion OnInit y seleccionar en el mapa

			const darggMarker = new google.maps.Marker({
				position: pos,
				map: this.map,
				draggable: true,
				title: title,
				animation: google.maps.Animation.DROP,
				icon: ico
			});

			darggMarker.addListener("click", () => {
				if (darggMarker.getAnimation() !== null) {
					darggMarker.setAnimation(null);
				} else {
					darggMarker.setAnimation(google.maps.Animation.BOUNCE)
				}
			});

			darggMarker.addListener('dragend', (dragendPos) => {

				this.myLatLng = {
					lat: dragendPos.latLng.lat().toFixed(6),
					lng: dragendPos.latLng.lng().toFixed(6)
				}
				this.map.panTo(dragendPos.latLng)

			})

			this.map.setCenter(darggMarker.position);

		}

		loading.dismiss();
	}

	private async getCurrentPosition() {

		try {
			const position = await Plugins.Geolocation.getCurrentPosition();
			return this.myLatLng = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			}
		} catch (err) {
			if (err.code === 1) { this.alertsservice.nativeToast('Usuario denego ubicación') };
			if (err.code === 2) { this.alertsservice.nativeToast('Ubocación no disponible') };

		}

	}

	async displayLoader() {

		const loading = await this.loadingCtrl.create({
			spinner: 'lines',
			translucent: true
		});
		await loading.present();
		return this.loadingCtrl;

	}

	validarCupon() {

		if (!this.cuponCode) { return }

		this.orderservice.cuponValidation(this.userservice.usuario._id,
			this.cuponCode).subscribe(
				(couponResp: any) => {

					if (couponResp.status) {

						this.alertsservice.nativeToast('El cupón es valido')
						this.orderservice.newConsultData.coupon = this.cuponCode;
						this.cuponValidationClass = 'codeIsValid';
					} else {

						this.alertsservice.nativeToast('El cupón ya no es valido')
						this.orderservice.newConsultData.coupon = null;
						this.cuponValidationClass = 'codeIsInvalid';
					}

				}, (err) => {

					if (!err.error.status) {
						this.cuponValidationClass = 'codeIsInvalid';
						this.alertsservice.nativeToast(err.error.message)
						this.orderservice.newConsultData.coupon = null;
					}
					if (err.status === 0) {
						this.alertsservice.showAlert('Error al conectarse con el servidor', 'Server Error')
					}
				}
			)
	}

	async alertOrderInPorgress() {
		const alert = await this.alertCtrl.create({
			cssClass: 'alerts-css-custom',
			header: 'Consultas!',
			message: 'Debe tener una trajeta registrada para continuar.',
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					cssClass: 'secondary'
				}, {
					text: 'Registrar',
					handler: () => {
						this.router.navigate(['/app/agregarpago'])
					}
				}
			]
		});

		await alert.present();
	}

	connection(state: string) {
		var button = document.getElementById("select-button");
		var conectado = document.getElementById("conectado");
		var desconectado = document.getElementById("desconectado");
		if (state == "presencial") {
			conectado.style.color = "rgb(255, 255, 255)";
			desconectado.style.color = "rgb(193, 193, 193)";
			button.style.left = "0%";
			this.isVirtual = true
		} else {
			desconectado.style.color = "rgb(255, 255, 255)";
			conectado.style.color = "rgb(193, 193, 193)";
			button.style.left = "50%";
			this.isVirtual = false;
			this.initMap(this.myLatLng, 1, 'PIN');
		}

	}

}


