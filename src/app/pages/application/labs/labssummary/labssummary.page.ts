import { Component, OnInit } from '@angular/core';
import { ViewWillLeave } from '@ionic/angular';
import { LabschatPage } from '../labschat/labschat.page';

@Component({
  selector: 'app-labssummary',
  templateUrl: './labssummary.page.html',
  styleUrls: ['./labssummary.page.scss'],
})
export class LabssummaryPage implements OnInit, ViewWillLeave {

  constructor( private chatPage: LabschatPage ) { }
  ionViewWillLeave() {
    this.chatPage.killSocketSubscription();
  }

  ngOnInit(  ) { 
  }

 

}
