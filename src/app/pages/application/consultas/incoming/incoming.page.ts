import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, ViewWillLeave } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx'

import { Socket } from 'ngx-socket-io';
import { Capacitor, Plugins } from '@capacitor/core'
import { UserService } from 'src/app/services/userservice.service';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { ConsultResp } from 'src/app/models/consultResp.model';
const { Geolocation } = Capacitor.Plugins;


@Component({
	selector: 'app-incoming',
	templateUrl: './incoming.page.html',
	styleUrls: ['./incoming.page.scss'],
})
export class IncomingPage implements OnInit, AfterViewInit, ViewWillLeave {
	avatarImage = "";
	orderResp: ConsultResp;
	public cancellable = false;

	public socketSubscription: Subscription;
	// uber/map params.
	public map;
	directionsDisplay = new google.maps.DirectionsRenderer

	// dubicacion del uber
	public origin = { lat: 0, lng: 0 };
	// a donde se solicita
	public destination = { lat: 0, lng: 0 };

	constructor(private router: Router,
		private loadCtrl: LoadingController,
		private menuCtrl: MenuController,
		private userservice: UserService,
		private orderservice: OrderService,
		private socket: Socket,
		private alertservice: AlertsService,
		private callnumber: CallNumber,
		private alertCtrl: AlertController) { }

	ionViewWillLeave() {
		//this.socket.disconnect();
		this.socketSubscription.unsubscribe();
		// console.log('Socket disconnected')
	}

	ngOnInit() {

		// console.log( ' newData ==> ',this.orderservice.newConsultData );
		// console.log( ' newResp ==> ',this.orderservice.consultResponse );
		
		this.orderResp = this.orderservice.consultResponse;
		this.cancellable = this.orderResp.orderStatus >= 3;
		this.avatarImage = this.userservice.transformFamilyFilename(this.orderResp.filename);
		this.destination = { lat: Number(this.orderResp.address.latitude), lng: Number(this.orderResp.address.longitude) };

		//this.socket.connect();
		this.socketSubscription = this.socket.fromEvent(this.userservice.usuario._id).subscribe((skResp: any) => {

			// si existe la prop message, es de error
			if (skResp.message){
				this.alertservice.showToast(skResp.message, 3000);
				return;
			};

			// la consulta ya no puede ser cancelada
			if (skResp.order.orderStatus === 3) {
				this.alertservice.nativeToast(skResp.order.message);
				this.cancellable = true;
			};

			// la consulta es finalizada en status 4
			if (skResp.order.orderStatus === 4) {
				this.orderservice.consultResponse.consultAmount = skResp.order.amount.consult;
				this.orderservice.consultResponse.shippingAmount = skResp.order.amount.km;
				this.orderservice.consultResponse.amount = skResp.order.amount.total;
				this.socketSubscription.unsubscribe();
				this.router.navigate(['app/consultas/summary'])
			};
		})

	}

	ngAfterViewInit() {
		this.initMap();
	}

	async initMap() {

		const loading = await this.loadCtrl.create({ spinner: 'lines' })
		loading.present();

		let pos = await this.getCurrentPosition();

		const mapHtml = document.getElementById('map');
		let mapOpts = {
			zoom: 14,
			center: pos,
			mapTypeIds: 'roadmap',
			mapTypeControl: false,
			scaleControl: true,
			streetViewControl: false,
			fullscreenControl: false,
			zoomControl: false
		};

		this.map = new google.maps.Map(mapHtml, mapOpts)
		this.directionsDisplay.setMap(this.map);

		google.maps.event.addListenerOnce(this.map, 'idle', () => {
			this.calculateRoute(pos);

			loading.dismiss();
		})

	}

	private calculateRoute(pos) {

		new google.maps.DirectionsService().route({
			origin: pos,
			destination: this.destination,
			travelMode: google.maps.TravelMode.DRIVING
		}, (resp, status) => {

			if (status === google.maps.DirectionsStatus.OK) {
				this.directionsDisplay.setDirections(resp)
			} else {
				console.log(' err  ', status)
			}
		})

	}

	private async getCurrentPosition() {

		try {
			const position = await Plugins.Geolocation.getCurrentPosition();
			return this.origin = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			}
		} catch (err) {
			console.log('getCurrentPosition() => ', err)
			// if(err.code === 1){ this.showToast('Usuario denego ubicación')};
			// if(err.code === 2){ this.showToast('Ubocación no disponible')};
		}

	}

	orderCancell() { 

		this.orderservice.cancellOrder(this.orderservice.consultResponse._id)
			.subscribe(
				(orderCancelled: any) => {
					this.alertservice.showAlert('La orden ha sido cancelada', 'Orden');
					this.router.navigate(['app/'])
				}, 
				(error) => {
					this.alertservice.showToast(`error ${error}`, 2500, 'danger', 'top');
				}, 
				() => { }
			);

	}

	toggleMenu() {
		this.menuCtrl.toggle('tdxMenu');
	}
	calling() {
		this.callnumber.callNumber('8126387799', false)
	}
	chating() {
		this.router.navigate(['/app/consultas/chat'])
	}

	nextt() {
		this.router.navigate(['app/consultas/summary'])
	}

	async orderCancell_walert() {

		const alert = await this.alertCtrl.create({
			cssClass: 'alerts-css-custom',
			header: 'Seguro que de seas cancelar!',
			message: `Al cancelar se aplicarán cargos <span class='fares'> $ ${ this.orderResp.km_fare } MXN </span> por tarifa de distancia. </br> ¿Desea continuar?`,
			buttons: [
				{
					text: 'Permanecer',
				},{
					text: 'Confirmar',
					role: 'cancel',
					cssClass: 'secondary',
					handler: async () => {
						await this.socketSubscription.unsubscribe();
						await this.orderCancell();
						this.router.navigate(['/app'])
					}
				},
			]
		});

		await alert.present();

	}

}
