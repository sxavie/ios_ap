import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ViewWillLeave } from '@ionic/angular';

import { Socket } from 'ngx-socket-io';
import { Consult } from 'src/app/models/consult.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { OrderService } from 'src/app/services/order.service';

import { Plugins } from '@capacitor/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UserService } from 'src/app/services/userservice.service';
import { ConsultResp } from 'src/app/models/consultResp.model';
const { Toast } = Plugins;

@Component({
	selector: 'app-selectuser',
	templateUrl: './selectuser.page.html',
	styleUrls: ['./selectuser.page.scss'],
})
export class SelectuserPage implements OnInit, ViewWillLeave {

	public imgAvatar: string;
	public userData: Usuario
	public userSelectedID;
	public orderResp: any;
	public isSocketConnected = false;

	public txtType;
	public loader;

	constructor(private alsertsservice: AlertsService,
		public userservice: UserService,
		public orderservice: OrderService,
		private socket: Socket,
		private loadingCtrl: LoadingController,
		private router: Router
	) { }
	ionViewWillLeave() {
		//this.socket.disconnect();
		// console.log('Socket Disconnected')
	}

	ngOnInit() {
		//this.socket.connect();
		// console.log('Socket Connected')
		this.userData = this.userservice.usuario;
		this.imgAvatar = this.userservice.image;
		this.txtType = this.orderservice.newConsultData.meeting ? 'Agendar' : 'Solicitar'

		//console.log(socketConnected)

	}


	async request() {


		if (!this.userSelectedID) {
			this.alsertsservice.showAlert('Debe seleccionar un usuario', 'Usuario')
		} else {

			if (this.userSelectedID === 'isGuest') {
				this.orderservice.newConsultData.patient = this.userData._id
				this.orderservice.newConsultData.guest = true
			} else {
				this.orderservice.newConsultData.patient = this.userSelectedID
				this.orderservice.newConsultData.guest = false
			}

			this.orderservice.genNewOrder().subscribe((orderResp) => {
				this.orderResp = orderResp;
				this.socketListen()
			})

		}

	}

	socketListen() {

		this.loadPresnte('Buscando a tu doctor')

		let socketSubscription = this.socket.fromEvent(this.userservice.usuario._id).subscribe((socketorderResp: any) => {

			console.log('socket resp ', socketorderResp)

			if (socketorderResp.status === false) {
				this.loader.dismiss()
				this.alsertsservice.showAlert(socketorderResp.message, 'Consulta');
				socketSubscription.unsubscribe();
				return;
			}

			this.orderservice.consultResponse = new ConsultResp(
				this.orderResp._id,
				this.orderResp.address,
				this.orderResp.consultReason,
				this.orderResp.consultType,
				this.orderResp.orderStatus,
				this.orderResp.date,
				this.orderResp.meeting,
				this.orderResp.paymentMethod,
				this.orderResp.patientName,
				this.orderResp.patientId,
				socketorderResp.medicalLicense,
				socketorderResp.doctorLocation,
				socketorderResp.doctor,
				socketorderResp.amount,
				socketorderResp.time,
				socketorderResp.filename,
				this.orderResp.patientFile,
				this.orderResp.symptoms,
				this.orderResp.medicalHistory
			)

			this.loader.dismiss();
			socketSubscription.unsubscribe();

			if (this.orderservice.newConsultData.consultType === 1) {
				this.router.navigate(['/app/videocall'])
			} else {
				this.router.navigate(['app/consultas/incoming'])
			}

		});

	}

	async loadPresnte(msg) {

		this.loader = await this.loadingCtrl.create({
			spinner: 'lines-small',
			message: msg,
			backdropDismiss: true
		})

		await this.loader.present();

		// ondDidDismiss();
		const { role, data } = await this.loader.onDidDismiss();
		console.log(role);

		if (role == "backdrop") {
			this.userservice.updateUserData(this.userservice.usuario._id, { isOrder: null }).subscribe();
		}

	}

}
