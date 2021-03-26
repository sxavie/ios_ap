import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { CalendarComponent as CompCalendar } from 'ionic2-calendar'
import { LoadingController, ModalController } from '@ionic/angular';
import { AgendaModalPage } from '../agenda-modal/agenda-modal.page';
import { UserService } from 'src/app/services/userservice.service';
import { ScheduledEvent } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {

  // public events :any= [];

  // configuracion de calendario
  @ViewChild(CompCalendar) myCal: CompCalendar;
  
  viewTilte: string;

  calendar = {
    mode: 'month',
    currentDate : new Date()
  };

  public eventSource:ScheduledEvent[] = [];

  
  constructor( private orderservice: OrderService,
    private modalCtrl: ModalController,
    private userservice: UserService,
    private loadingCtrl: LoadingController ) { }


  async ngOnInit() {

  let loading = await this.loadingCtrl.create({
    spinner: 'lines-small',
    message: 'Cargando'
  })
  await loading.present();  

  this.eventSource = this.orderservice.eventsSoruce;
  loading.dismiss();
  } 

  async onTimeSelected(ev){
    
    if(ev.events.length>0){
      let evSc = await this.modalCtrl.create({
        component: AgendaModalPage,
        cssClass: 'agendaModal-modal',
        componentProps: {
          events: ev.events,
          date: ev.selectedTime 
        },
        swipeToClose: true,
        presentingElement: await this.modalCtrl.getTop(),
        showBackdrop: false
      })

      await evSc.present();

    }
  }


  next(){
    this.myCal.slideNext();
  }

  back(){
    this.myCal.slidePrev()
  }

  onViewTitleChanged(title){
    this.viewTilte = title
  }

}
