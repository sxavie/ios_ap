import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { OrderService } from './order.service';
import { UserService } from './userservice.service';

@Injectable({
	providedIn: 'root'
})
export class SocketsService implements OnInit {

	public socketSub: Subscription;

	constructor(public socket: Socket,
		private userservice: UserService,
		private orderservice: OrderService,
		private router: Router) { }

	ngOnInit() {
		this.socket.connect()
	}


	socketOrderListener() {
		if (this.socketSub) { this.socketUnsubscribe(); }
		console.log(`Susbcription Socket USERID: ${this.userservice.usuario._id} socketsservice.ts`)
		//this.socket.connect();
		this.socketSub = this.socket.fromEvent(this.userservice.usuario._id).subscribe((subs: any) => {

			this.orderservice.getOrderId(subs.orderId).subscribe(
				(order: any) => {
					console.log('incomming ', order)
					this.orderservice.consultResponse = order;
					this.socketUnsubscribe();
					this.router.navigate(['/app/consultas/incoming'])
				}, (err) => {
					console.log("ERROR:", err)
				}
			)

		});

		// this.functionIntervas();
	}

	socketUnsubscribe() {
		console.log(`Unsisbcription Socket USERID: ${this.userservice.usuario._id} socketsservice.ts`)
		this.socketSub.unsubscribe();
		//this.socket.disconnect();
	}

	// functionIntervas(){
	//   setInterval( () => {
	//     console.log( this.socketSub )
	//   }, 10000)

	// }



}
