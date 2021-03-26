import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillLeave } from '@ionic/angular';
import { ConsultResp } from 'src/app/models/consultResp.model';
import { OrderService } from 'src/app/services/order.service';
import { PayMethodsService } from 'src/app/services/paymethods.service';
import { UserService } from 'src/app/services/userservice.service';
import { ChatPage } from '../chat/chat.page';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit, ViewWillLeave {

  public consultResponse;

  public dateTime = '';
  public defMethod:any;

  constructor( private orderservice: OrderService,
    private payservice: PayMethodsService,
    private userservice: UserService,
    private router: Router,
    // private chatPage: ChatPage
    ) {

      this.consultResponse = this.orderservice.consultResponse; 
      // this.consultResponse = new ConsultResp('123','123','consulta general', 1,2, new Date().toString(), false, 'cash', 'Xavier Hernandez','123','tv72tvbusx','asd','Varonica',145,'25 Min', null, null,null,null,555,65)

    }
  ionViewWillLeave() {
    this.End_consultSummary();
  }

  async ngOnInit() {
    this.dateTime = this.transformDateTime(this.consultResponse.date)
    this.getPayment(this.consultResponse.paymentMethod);
  }

  getPayment(x){

    if(x === 'Tarjeta Debito o Credito'){
      this.payservice.getPayMethods().subscribe( (x:any) => {
        this.defMethod =  x.cards[0];
      });
    } else {
      let cash = { brand: 'cash', cardID: 'cash', default_source: 'cash', last4: '' }
      this.defMethod =  cash;
    }
}

  transformDateTime( z ):string{

    let x = z.split('T');

    let xDate = x[0];
    let xTime = x[1];

    const middleDash = '-';
    const slash = '/';
    let SlashedDate = xDate.split(middleDash).join(slash);

    const dot = '.';
    let splitedTime = xTime.split(dot);

    return `${SlashedDate} ${splitedTime[0]}`;
  }

  End_consultSummary(){
    this.orderservice.newConsultData = null;
    this.orderservice.consultResponse = null;
    this.orderservice.consultMessages = [];
    // this.chatPage.killSocketSubscription();
    this.router.navigate(['app/'])
  }

}
 