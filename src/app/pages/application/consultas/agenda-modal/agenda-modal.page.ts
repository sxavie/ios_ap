import { Component, Input, OnInit } from '@angular/core';
import { ScheduledEvent } from 'src/app/interfaces/interfaces';
import { UserService } from 'src/app/services/userservice.service';
import moment from 'moment-timezone';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-agenda-modal',
  templateUrl: './agenda-modal.page.html',
  styleUrls: ['./agenda-modal.page.scss'],
})
export class AgendaModalPage implements OnInit {

  
  @Input() date: string;
  @Input() events:any [];
  
  public forEvents:any[] = [];
  public time;
  public numberDay;
  public nameDay
  
  public image;

  constructor( public userservice: UserService) { }

  ngOnInit() {

    this.image = this.userservice.image;
    moment.locale('es-mx');
    moment.tz("America/Monterrey");

   this.setDateVariables(); 

  }

  setDateVariables(){

    let date: Date = new Date( this.date );

    this.nameDay = this.getNameDay( date.getDay() )
    this.numberDay = date.getDate();

    for (let i = 0; i < this.events.length; i++) {
      const ev:ScheduledEvent = this.events[i];
      console.log(ev);
      this.forEvents.push({
        title: ev.title,
        startTime: ev.startTime,
        endTime: ev.endTime,
        allDay: ev.allDay,
        // time: moment(ev.hour).format('LT')
        time: ev.hour
      })
    }
  }


  getNameDay( day ):string {

    let name

    switch (day) {
      case 0:
        name = 'Domingo'
        break;
      case 1:
        name = 'Lunes'
        break;
      case 2:
        name = 'Martes'
        break;
      case 3:
        name = 'Miércoles'
        break;
      case 4:
        name = 'Jueves'
        break;
      case 5:
        name = 'Viernes'
        break;
      case 6:
        name = 'Sábado'
        break;
      default:
        name = 'NA'
        break;
    }

    return name
  }

}
