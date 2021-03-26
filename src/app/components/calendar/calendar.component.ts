import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CalendarComponent as CompCalendar } from 'ionic2-calendar'
import { LabsService } from 'src/app/services/labs.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  
  @Output() timeSelected_emmiter = new EventEmitter<string>();
  @Input() SelectedDay:string;

  viewTilte: string;

  calendar = {
    mode: 'month',
    currentDate : new Date()
    // startingDayMonth: 1,
    // startingDayWeek: 1 
  };

  selectedDate: Date; 

  @ViewChild(CompCalendar) myCal: CompCalendar;

  constructor( private labsServices: LabsService ) {
     
  }

  ngOnInit() {
    this.calendar.currentDate = this.labsServices._setServiceDay;
  }
  
  onTimeSelected(ev){

    console.log( 'time selected' )
    this.timeSelected_emmiter.emit(ev.selectedTime)
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

  // ngOnChanges(changes: { [propName: string]: SimpleChange }) {
  //   console.log( changes )
  //   if( changes['aa'] && changes['aa'].previousValue != changes['aa'].currentValue ) {
  //     // aa prop changed
  //   }
  // }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes ',changes)
  }



}
