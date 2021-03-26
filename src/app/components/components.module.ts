import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NgCalendarModule } from 'ionic2-calendar';

import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangepaymentComponent } from './changepayment/changepayment.component';
import { NgxStarsModule } from 'ngx-stars';
import { NewaddressComponent } from './newaddress/newaddress.component';
import { NewcardComponent } from './newcard/newcard.component';
registerLocaleData(localeEs)

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    MapComponent,
    CalendarComponent,
    ChangepaymentComponent,
    NewaddressComponent,
    NewcardComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    RouterModule,
    NgCalendarModule,
    NgxStarsModule,
    ReactiveFormsModule,

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
  exports: [HeaderComponent, MenuComponent, MapComponent, CalendarComponent, ChangepaymentComponent, NewaddressComponent, NewcardComponent]
})
export class ComponentsModule { }
