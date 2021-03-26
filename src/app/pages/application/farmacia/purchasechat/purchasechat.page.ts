import { Component, OnDestroy, OnInit } from '@angular/core';



@Component({
  selector: 'app-purchasechat',
  templateUrl: './purchasechat.page.html',
  styleUrls: ['./purchasechat.page.scss'], 
})


export class PurchasechatPage implements OnInit, OnDestroy {

  public messages = [{
    source: 'sender',
    msg: 'Hola'
  },{
    source: 'addressee',
    msg: 'Buenas tardes'
  },{
    source: 'addressee',
    msg: 'Estoy afuera de 512'
  },{
    source: 'sender',
    msg: 'EL diego TTT'
  }]

  constructor() { }

  ngOnDestroy() {

  }

  ngOnInit() {



  }



}
