import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, LoadingController, AlertController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { MenuDataService } from 'src/app/services/menu-data.service';
import { UserService } from 'src/app/services/userservice.service';
import { } from 'googlemaps';
import { Socket } from 'ngx-socket-io';

import { Capacitor, Plugins, GeolocationPosition, LocalNotification } from '@capacitor/core';
import { Consult } from 'src/app/models/consult.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { Usuario } from 'src/app/models/usuario.model';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';
import { ScheduledEvent } from 'src/app/interfaces/interfaces';
import { parse } from 'path';
import { title } from 'process';
import { SocketsService } from 'src/app/services/sockets.service';
import { PayMethodsService } from 'src/app/services/paymethods.service';

const { Geolocation, LocalNotifications } = Capacitor.Plugins;


interface MarkerPosition {
	latitude: number,
	longitude: number
	partnerId: string
};

@Component({
	selector: 'app-home',
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, ViewWillEnter, ViewWillLeave {

	PartnerLocation: Subscription;

	public map;
	public myLatLng;
	public loading;

	public goomarkers: google.maps.Marker[] = [];
	public markers: any[] = [];

	public userData: Usuario;
	public isOrder: any = null;

	public eventSource: ScheduledEvent[] = [];

	constructor(private menuCtrl: MenuController,
		public router: Router,
		public menuData: MenuDataService,
		public userservice: UserService,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public alertsservice: AlertsService,
		public orderService: OrderService,
		public socket: Socket,
		public orderservice: OrderService,
		public socketservice: SocketsService,
		public paymentService: PayMethodsService
	) {

	}
	ionViewWillLeave() {
		// this.PartnerLocation.unsubscribe();
	}

	async ionViewWillEnter() {

		localStorage.removeItem('in-profile')

		await this.userservice.clearUserCache().then(
			(resp: any) => {

				this.userData = resp;
				this.isOrder = resp.isOrder

			}, (err) => {
				if (err.status === 0) {
					this.alertsservice.showAlert('Error al conectarse con el servidor', 'Server Error')
				}
			}).finally(async () => {
				// this.getEventsSource();
				if (this.isOrder) {

					this.orderService.getOrderId(this.isOrder).subscribe(
						(order: any) => {

							console.log('incomming ', order)
							this.orderService.consultResponse = order;
							this.router.navigate(['/app/consultas/incoming'])

							return;

						}, (err) => {
							console.log(err)
						}
					)

				} else {
					this.socketservice.socketOrderListener();
				}
			});


		// this.paymentService.getPendingOrders(this.userData._id)
		// 	.subscribe((pnd: any) => {
		// 		const pendingOrders = pnd.pending_orders;
		// 		if (pendingOrders.length > 0) {
		// 			console.log( pendingOrders.description );
		// 		};
		// 	}), (err => {
		// 		console.log(err)
		// 	});


	}

	async getEventsSource() {

		// eventos Source
		let events: any = await this.orderservice.scheduled(this.userservice.usuario._id).toPromise();
		events.data.forEach(ev => {
			let newEvent: ScheduledEvent = {
				title: ev.consultReason,
				endTime: new Date(ev.date),
				startTime: new Date(ev.date),
				hour: ev.hour,
				allDay: true
			}
			this.eventSource.push(newEvent)
		})
		this.orderservice.eventsSoruce = this.eventSource;
		localStorage.removeItem('eventSource');
		localStorage.setItem('eventSource', JSON.stringify(this.eventSource))

	}

	async ngOnInit() {


		// let noti = LocalNotifications.schedule({
		//   notifications: [{
		//     title: 'Notificacion',
		//     body: 'cuerpo',
		//     id: 1,
		//     schedule: { at: new Date(Date.now() + 1000 * 10) },
		//     sound: null,
		//     attachments: null,
		//     actionTypeId: "",
		//     extra: null
		//   }]
		// })

		// console.log( "shedule Nots ", noti )


		await this.initMap();

	}

	irA(pagex: string) {
		switch (pagex) {
			case 'Consultas': {
				this.router.navigate(['app/consultas']);
				break;
			}
			case 'Resacas': {
				this.orderService.newConsultData = new Consult(5)
				this.router.navigate(['app/consultas/request'])
				break
			}
			case 'Farmaica': {
				this.router.navigate(['app/farmacia'])
				break
			}
			case 'Lab': {
				this.router.navigate(['app/labs'])
				break
			}
		}

	}

	async initMap() {

		// this.displayLoader();

		this.loading = await this.loadingCtrl.create({
			spinner: 'lines-small',
			translucent: true
		});

		await this.loading.present();
		// return this.loadingCtrl;

		let pos = await this.getPosition()

		const mapHtml = document.getElementById('homemapa');

		let mapOpts = {
			zoom: 16,
			center: pos,
			mapTypeControl: false,
			scaleControl: true,
			streetViewControl: false,
			fullscreenControl: false,
			zoomControl: false,
			mapTypeId: 'terrain'
		};

		this.map = new google.maps.Map(mapHtml, mapOpts)

		setTimeout(() => {
			this.loading.dismiss();
		}, 500);

		this.socketListenner();


	}

	async getPosition() {

		try {
			const position = await Plugins.Geolocation.getCurrentPosition();
			return this.myLatLng = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			}
		} catch (err) {
			// if(err.code === 1){ this.alertsservice.nativeToast('Usuario denego ubicación')};
			// if(err.code === 2){ this.alertsservice.nativeToast('Ubocación no disponible')};
		}

	}

	toggleMenu() {
		this.menuCtrl.toggle('tdxMenu')
	}

	ngOnDestroy() {
		localStorage.removeItem('User-Data')
	}

	socketListenner() {

		//this.socket.connect();
		// console.log('socket Connected')
		// console.log('PartnerLocation - subscribe()')
		this.PartnerLocation = this.socket.fromEvent('PartnerLocation').subscribe((sioPosition: MarkerPosition) => {

			let found = false;
			this.goomarkers.forEach((docMarker, i) => {
				if (docMarker.getTitle() === sioPosition.partnerId) {
					found = true;
					docMarker.setPosition(new google.maps.LatLng(sioPosition.latitude, sioPosition.longitude))
					docMarker.setMap(this.map)
				}
			});

			if (!found) {
				const mark = new google.maps.Marker({
					position: new google.maps.LatLng(
						sioPosition.latitude, sioPosition.longitude
					),
					title: sioPosition.partnerId,
					icon: './assets/car-pin.png'
				})
				mark.setMap(this.map)
				this.goomarkers.push(mark)
			}
			// console.log( this.goomarkers )
		});

		setTimeout(() => {

			this.goomarkers.forEach((docMarker, i) => {
				// console.log(docMarker, '  setMap = null')
				docMarker.setMap(null)
			});

			this.reconnectSocket();

		}, 20000);

	}

	reconnectSocket() {

		// console.log('PartnerLocation - unsubscribe()')
		this.PartnerLocation.unsubscribe();

		//this.socket.disconnect()
		// console.log('socket disconnected')
		this.goomarkers = [];
		this.markers = [];
		this.socketListenner();
	}



}
