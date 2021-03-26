import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Consult } from 'src/app/models/consult.model';
import { OrderService } from 'src/app/services/order.service';
import { SocketsService } from 'src/app/services/sockets.service';

@Component({
  selector: 'app-motivos',
  templateUrl: './motivos.page.html',
  styleUrls: ['./motivos.page.scss'],
})
export class MotivosPage implements OnInit {

  public motivos:any[] = [];

  constructor( private router: Router,
    public orderservice: OrderService,
    public socketsservice: SocketsService ) { }

  ngOnInit() {

    this.socketsservice.socketUnsubscribe();

  }

  addMotivo( value ) {
    let index = this.motivos.indexOf(value);
    if(index === -1) { this.motivos.push( value )
    }else{ this.motivos.splice( index, 1 ) }
  }
  reqNewOrder(){

    this.orderservice.newConsultData.symptoms = this.motivos

    this.router.navigate(['app/consultas/selectuser'])

  }



}
 