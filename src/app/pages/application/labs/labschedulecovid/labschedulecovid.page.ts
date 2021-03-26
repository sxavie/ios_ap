import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alerts.service';
import { LabsService } from 'src/app/services/labs.service';

@Component({
	selector: 'app-labschedulecovid',
	templateUrl: './labschedulecovid.page.html',
	styleUrls: ['./labschedulecovid.page.scss'],
})
export class LabschedulecovidPage implements OnInit {

	// time variables;
	public timeSelected;
	public time;
	public timeNow;
	public timeDisabled: boolean = false;
	public isDomingo = false;

	// date variables
	public dateSelected;
	public month;
	public day;
	public year;


	constructor(private alertsservice: AlertsService,
		private alertCtrl: AlertController,
		private labsservices: LabsService,
		private router: Router) { }

	ngOnInit() {
		let time = this.time = this.timeTransform(new Date());
		let timearr = time.split(':')
		let hh = Number(timearr[0]);
		this.timeNow = `${hh + 3}:${timearr[1]}`;



		this.alertsservice.showAlert(`Los servicios de COVID son programados 3 horas posterior a la hora actual`, 'Laboratorios')
	}

	labs_next() {

		// return si selecciona domingo
		if (this.isDomingo) {
			this.alertsservice.showAlert('No hay servicio de laboratorio para el dia seleccionado', 'Laboratorios')
			return
		}

		let selectedDate = new Date(this.year, (this.month - 1), this.day);
		let todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
		let rightNow = new Date();

		// if (!this.timeDisabled) {
		//   if (!!!this.timeSelected) {
		//     this.alertsservice.nativeToast('No se ha seleccionado la hora')
		//     return
		//   }
		// }

		// return selecciona una fecha pasada
		if (this.dateSelected < todayMidnight) {
			this.alertsservice.nativeToast('La fecha seleccionada no es valida')
			return;
		}

		if (!this.timeSelected) {
			this.alertsservice.nativeToast('No se ha seleccionado la hora')
			return
		}

		// obtenemos hora/minutos relacion a la hora seleccionada- formato (00:00)
		this.time = this.timeTransform(new Date(this.timeSelected));


		let nowDoubledTime = this.getTime(new Date());
		let selectedDoubledTime = this.getTime(new Date(this.timeSelected));

		let plus3 = nowDoubledTime + 3;

		if (todayMidnight.getTime() == selectedDate.getTime()) {

			// este fi es para validar que seleccione 3 horas mas adelante
			console.log(plus3, ' <= ', selectedDoubledTime)
			if (plus3 <= selectedDoubledTime) {

				this.showOrderMessage(0, selectedDate, 0, this.time)

			} else {
				let splite = nowDoubledTime.toString().split('.')
				let hour = splite[0];
				hour = (Number(hour) + 3).toString()
				let minute = new Date().getMinutes()
				let mm = '';
				if (minute < 10) {
					mm = `0${minute}`
				} else {
					mm = minute.toString();
				}


				// si selecciona un horario no permitidi el mismo dia (menor a 3 horas)
				this.alertsservice.showAlert(`Seleccione un horario a partir de las ${hour}:${mm}`, 'COVID')
			}

		} else {


			this.showOrderMessage(0, selectedDate, 0, this.time)


		}


	}

	async showOrderMessage(meetDays, date, meeting, time) {

		let d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		d.setDate(d.getDate() + meetDays)

		// validar si el sistema reagenda para domigno, añadir un dia mas
		if (d.getDay() === 0) {
			d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
			d.setDate(d.getDate() + meetDays + 1)
			meetDays++
		}

		let message = `El servicio se programara para el
    ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`

		const alert = await this.alertCtrl.create({
			cssClass: 'alerts-css-custom',
			header: 'Laboratorios',
			message,
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					cssClass: 'secondary'
				}, {
					text: 'Entendido',
					handler: () => {
						this.saveOrderVariables(meetDays, date, meeting, time);
					}
				}
			]
		});

		await alert.present();
	}

	saveOrderVariables(meetDays, date, meeting, time) {

		// this.labsservices.newLabData.hour = time;
		// this.labsservices.newLabData.day = (date.getDate() + meetDays).toString();
		// this.labsservices.newLabData.month = (date.getMonth() + 1).toString();
		// this.labsservices.newLabData.year = (date.getFullYear()).toString();

		let year = (date.getFullYear()).toString();
		let month = (date.getMonth() + 1).toString();
		let day = (date.getDate() + meetDays).toString();
		let array = time.split(':');
		let fecha = new Date(year, month, day, Number(array[0]), Number(array[1]))
		// console.log('che perrrrrrrrrrrrrrrrito wwwaaa woff: ', fecha.getTime())
		this.labsservices.newLabData.date = fecha.getTime();

		this.router.navigate(['app/labs/labaddresses']);

	}

	timeTransform(x: Date) {

		// transformar tiempo

		let HH: any = x.getHours();
		let MM: any = x.getMinutes();

		HH = (HH < 10) ? `0${HH}` : HH.toString();
		MM = (MM < 10) ? `0${MM}` : MM.toString();

		let time = `${HH}:${MM}`

		return time

	}

	getSelectedTime(ev) {

		this.dateSelected = ev;

		if (ev.getDay() === 0) {
			this.isDomingo = true;
		} else { this.isDomingo = false }

		this.month = ev.getUTCMonth() + 1; //months from 1-12
		this.day = ev.getUTCDate();
		this.year = ev.getUTCFullYear();

		// transformar fechas meses y dias < 10
		if (Number(this.month) < 10) this.month = `0${this.month}`
		if (Number(this.day) < 10) this.day = `0${this.day}`

		//valida horarios se valido
		let selectedDate = new Date(this.year, (this.month - 1), this.day)
		let todayMidnight = new Date()
		todayMidnight.setHours(0, 0, 0, 0)

		if (todayMidnight.getTime() <= selectedDate.getTime()) {

			// if (selectedDate.getTime() === todayMidnight.getTime()) {
			//   this.alertsservice.showAelrt(`Los servicios de laboratorio solicitados antes de las 17:30 horas seran programados para el  
			//     ${Number(this.day)}/${this.month}/${this.year} a primeras horas del dia`, "Laboratorios")
			//   this.timeDisabled = true
			// } else {
			//   this.timeDisabled = false
			// }

			this.timeDisabled = false

		} else {
			this.alertsservice.showAlert('La fecha seleccionada no es valida', 'Laboratorios')
			this.timeDisabled = true
		}

	}

	getTime(date: Date) {
		const hours = date.getHours();
		const minuts = date.getMinutes();
		const full = hours.toString() + "." + minuts.toString();
		return parseFloat(full);
	}


}
