import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ScheduledEvent } from 'src/app/interfaces/interfaces';
import { Consult } from 'src/app/models/consult.model';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/userservice.service';

import moment from 'moment-timezone';

@Component({
	selector: 'app-consultas',
	templateUrl: './consultas.page.html',
	styleUrls: ['./consultas.page.scss'],
})
export class ConsultasPage implements OnInit {

	public eventSource: ScheduledEvent[] = [];

	constructor(public userService: UserService,
		private router: Router,
		private menuCtrl: MenuController,
		private orderservice: OrderService
	) { }

	async ngOnInit() {
		moment.locale('es-mx');
		moment.tz("America/Monterrey");
		// eventos Source
		await this.userService.getUserData();

		let events: any = await this.orderservice.scheduled(this.userService.usuario._id).toPromise();
		let labEvents: any = await this.orderservice.scheduleLabs().toPromise();

		this.pushToEventSoruce( events.data , false )
		this.pushToEventSoruce( labEvents.data, true )

		this.orderservice.eventsSoruce = this.eventSource;
		localStorage.removeItem('eventSource');
		localStorage.setItem('eventSource', JSON.stringify(this.eventSource))

	}

	pushToEventSoruce(events, labs) {
		events.forEach(ev => {
			let newEvent: ScheduledEvent = {
				title: ev.consultReason,
				endTime:  ( labs ) ? new Date(moment(ev.Date).format()) : new Date(moment(ev.date).format()),
				startTime: ( labs ) ? new Date(moment(ev.Date).format()) : new Date(moment(ev.date).format()),
				hour: ev.hour,
				allDay: false
			}
			this.eventSource.push( newEvent )
		});
	}

	toggleMenu() {
		this.menuCtrl.toggle('tdxMenu');
	}

	reqNewOrder(reason) {
		let navigate = (reason === 6) ? '/app/consultas/agenda' : '/app/consultas/request'
		this.orderservice.newConsultData = new Consult(reason)
		this.router.navigate([navigate])
	}
}
