import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwIfEmpty } from 'rxjs/operators';
import { Consult } from 'src/app/models/consult.model';
import { Usuario } from 'src/app/models/usuario.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
	selector: 'app-schedule',
	templateUrl: './schedule.page.html',
	styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

	public userData: Usuario

	dateSelected;
	timeSelected;
	timeNow;
	now: Date = new Date();
	validTime = false;

	hours = new Array(24);
	time: string;
	month: string;
	day: string;
	year: string

	constructor(private router: Router,
		private alertsservice: AlertsService,
		private orderservice: OrderService,
		private userservice: UserService) { }

	ngOnInit() {

		this.userData = this.userservice.usuario

		// fix time 1:05
		let h = this.now.getHours()
		let m = this.now.getMinutes()
		this.timeNow = `${h}:${m}`;
	}

	getSelectedTime(ev) {

		console.log( 'event: ',ev )
		

		this.dateSelected = ev;

		this.month = ev.getUTCMonth(); //months from 1-12
		this.day = ev.getUTCDate();
		this.year = ev.getUTCFullYear();
	}

	timeValid() {

		let dateSel = new Date(this.dateSelected)
		let hnow = this.now.getHours()
		let mnow = this.now.getMinutes()

	}

	schedule() {

		this.validTime = true

		let todayMidd = new Date();
		let timerNow = this.getTime(todayMidd);
		todayMidd.setHours(0, 0, 0, 0)

		let dateSelectedMidd = new Date(this.dateSelected);
		dateSelectedMidd.setHours(0, 0, 0, 0)

		// if( dateSelectedMidd < todayMidd  ) {
		//   this.alertsservice.nativeToast('La fecha seleccionada no es valida')
		//   return;
		// } 

		// if( !this.timeSelected ) {
		//   this.alertsservice.nativeToast('No selecciono hora de disponibilidad')
		//   return;
		// }

		let timerSel = this.getTime(new Date(this.timeSelected))

		// este if valida si la fecha seleccionada es hoy
		if (dateSelectedMidd.toString() === todayMidd.toString()) {

			// dos horas mas
			// if( (timerNow+2) > timerSel ) {
			//   this.alertsservice.showToast('La hora seleccionada no es valida', 3000)
			//   return
			// }

		}
		// else {
		//   console.log('no es hoy')
		// }


		// transformar fecha
		if (Number(this.month) < 10) this.month = `0${this.month}`
		// if( Number(this.day) < 10) this.day = `0${this.day}`

		// padstart

		this.orderservice.newConsultData.patient = this.userservice.usuario._id;
		this.orderservice.newConsultData.guest = false;

		// transformar tiempo
		let times = new Date(this.timeSelected)
		this.time = times.getHours() < 10
			? `0${times.getHours().toString()}:${times.getMinutes().toString()}`
			: `${times.getHours().toString()}:${times.getMinutes().toString()}`


		console.log( 'month: ',this.month )

		this.orderservice.newConsultData.month = this.month.toString();
		this.orderservice.newConsultData.day = this.day.toString();
		this.orderservice.newConsultData.year = this.year.toString();
		this.orderservice.newConsultData.hour = this.time

		let date = new Date(Number(this.year), Number(this.month), Number(this.day), times.getHours(), times.getMinutes())

		console.log('timestamp ', date.getTime())

		/*let nuevafecha = new Date();
		nuevafecha.setHours(15, 46, 0, 0)

		console.log('la fecha full', `${nuevafecha.getUTCDate()}/${nuevafecha.getUTCMonth()}/${nuevafecha.getUTCFullYear()}/${nuevafecha.getUTCHours()}:${nuevafecha.getUTCMinutes()} `)
		console.log('la fecha ----', new Date(nuevafecha))*/

		// test harcode
		this.orderservice.newConsultData.date = date.getTime();
		// this.orderservice.newConsultData.date = nuevafecha.getTime();
		this.orderservice.newConsultData.meeting = true;
		// console.log('la agedna' ,this.orderservice.newConsultData)
		// console.log('from service timestamp',this.orderservice.newConsultData.date)
		// console.log('from service as datess', new Date(this.orderservice.newConsultData.date))
		// console.log('order agendar', this.orderservice.newConsultData )
		this.orderservice.genNewOrder().subscribe((resp) => {
			console.log(resp)
			console.log(`agendada: `, new Date(this.orderservice.newConsultData.date));

		}, (err) => {
		}, () => { this.alertsservice.showAlert('La consulta ha sido agendada', 'Agenda') })

	}

	getTime(date: Date) {
		const hours = date.getHours();
		const minuts = date.getMinutes();
		const full = hours.toString() + "." + minuts.toString();
		return parseFloat(full);
	}


}
