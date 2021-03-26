import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alerts.service';
import { LabsService } from 'src/app/services/labs.service';
import { throwError } from 'rxjs';
import { UserService } from 'src/app/services/userservice.service';
@Component({
	selector: 'app-labschedule',
	templateUrl: './labschedule.page.html',
	styleUrls: ['./labschedule.page.scss'],
})
export class LabschedulePage implements OnInit {


	// time variables;
	public time;
	public isDomingo = false;

	// date variables
	public dateSelected;
	public month;
	public day;
	public year;


	public avalidableHours = []; // obtenida de la api en base al dia seleccionado en el calendario
	public dateServiceSelectedValue = {
		date: null,
		day: null,
		time: null
	}; // seleccionado por el usuario

	constructor(private router: Router,
		private alertsservice: AlertsService,
		private labsservices: LabsService,
		private userservice: UserService,
		private loaderCtrl: LoadingController) {
	}

	ngOnInit() {
	}

	// router naviaget paymentMethod
	async labs_next() {

		if (this.dateServiceSelectedValue.time === null) {
			this.alertsservice.showToast('Seleccione una hora para agendar', 2000, 'warning', 'top');
			return;
		}

		const servicesID = this.labsservices.servicesRequestList.map((serv: any) => serv._id)

		const data = {
			clientID: this.userservice.userid,
			medicalCenterID: this.labsservices.serviceRequestSelected.medicalcenter,
			servicesID: this.labsservices.servicesRequestList,
			appointment: this.dateServiceSelectedValue
		}

		this.labsservices.serviceFlowJSONData = { data };

		if (this.labsservices._esCovid) {

			let loading = await this.loaderCtrl.create({
				spinner: 'lines-small',
				message: 'Cargando'
			});

			loading.present()

			this.labsservices.sendServiceSchedule(this.dateServiceSelectedValue.time).toPromise()
				.then((assignServiceDocResponse: any) => {

					if (assignServiceDocResponse.codigo) {
						this.router.navigate(['/app/labs/labpaymethod'])
						this.labsservices.serviceFlowJSONData.data.doctorID = assignServiceDocResponse.doctor;
					} else {
						this.alertsservice.showToast('Error al asignar la hora, intente nuevamente', 2000, 'danger', 'top');
						this.getScheduleTime(this.day)
					};

				})
				.catch(err => throwError(err))
				.finally(() => loading.dismiss());
		}
		else {

			this.router.navigate(['/app/labs/labpaymethod'])
		}
	}


	// on click calendar event
	getSelectedTime(ev) {

		this.dateSelected = ev;

		this.isDomingo = (ev.getDay() === 0) ? true : false

		if (this.isDomingo) {
			this.avalidableHours = [];
			return;
		}

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

		// validacion si selecciona hoy o fecha futura
		if (todayMidnight.getTime() <= selectedDate.getTime()) {

			// 	NOTAS MARZO
			// consumir data para get de horas ====================================
			// la variable de hroas diponibles en servicio no es necesaria | pordia ser eliminada y no afecta el funcionamiento

			// si selecciona el dia de hoy!
			if (todayMidnight.getTime() == selectedDate.getTime()) {

				if (this.labsservices.serviceRequestSelected.covid)
					// obtener lista de disponibilidad (horas) si es covid
					this.getScheduleTime(this.day)
				else
					// si no son cobik, vacia el array de horas
					this.avalidableHours = []

			} else
				this.getScheduleTime(this.day) // este se ejecuta cuando no es kovic pero la fecha seleccionada es paartir de mañana


		} else
			this.avalidableHours = []; // vaciar el arreglo de horas disponibles si se selecciona una fecha menor al dia de hoy,

		this.dateServiceSelectedValue.time = null
		this.dateServiceSelectedValue.date = ev;

	}

	async getScheduleTime(day: number) {

		let loading = await this.loaderCtrl.create({
			spinner: 'lines-small',
			message: 'Cargando'
		});

		loading.present()

		this.dateServiceSelectedValue.day = day;

		this.labsservices.getServiceSchedules(day).toPromise().then(
			(avaliableSchedule: any) =>{ console.log('getService data: ',avaliableSchedule )
				this.avalidableHours = this.prepareAvalaibleHours(day, avaliableSchedule.disponibles)}
		).catch(err => throwError(err))
			.finally(() => loading.dismiss());

	}

	// Alerta de no selecciono nada
	showWarning() {
		this.alertsservice.showToast('Debe seleccionar la hora del servicio', 2000, 'warning', 'top');
	}

	prepareAvalaibleHours(day, availableTimeList) {

		let horasDisponibles = availableTimeList;
		const currentTime = new Date();

		if (day === currentTime.getDate())
			horasDisponibles = availableTimeList.filter(time => time >= (currentTime.getHours() + 3));

		return horasDisponibles;

	}







}
