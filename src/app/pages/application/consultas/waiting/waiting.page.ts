import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillLeave } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.page.html',
  styleUrls: ['./waiting.page.scss'],
})
export class WaitingPage implements OnInit, ViewWillLeave {

  public socketSubscription: Subscription

  constructor( private socket: Socket,
    private userservice: UserService,
    private orderservice: OrderService,
    private alertservice: AlertsService,
    private router: Router ) { }
  ionViewWillLeave(): void {
    this.socketSubscription.unsubscribe();
    //this.socket.disconnect();
  }

  ngOnInit() { 

    //this.socket.connect();
    this.socketSubscription = this.socket.fromEvent(this.userservice.usuario._id).subscribe((skResp: any) => {

      console.log('socket resp ', skResp)

      if (skResp.order.orderStatus === 3) {
        this.alertservice.nativeToast(skResp.order.message)
      }

      if (skResp.order.orderStatus === 4) {
        // this.orderservice.consultResponse.consultAmount = skResp.order.amount.consult;
        // this.orderservice.consultResponse.shippingAmount = 0;
        // this.orderservice.consultResponse.amount = skResp.order.amount.consult;
        // this.socketSubscription.unsubscribe();

        this.orderservice.consultResponse.consultAmount = skResp.order.amount.consult;
        this.orderservice.consultResponse.shippingAmount = skResp.order.amount.km;
        this.orderservice.consultResponse.amount = skResp.order.amount.total;
        this.socketSubscription.unsubscribe();

        this.router.navigate(['app/consultas/summary'])
      }
    })

  }

}
