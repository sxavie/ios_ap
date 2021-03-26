import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendaPageRoutingModule } from './agenda-routing.module';
import { NgCalendarModule } from 'ionic2-calendar';

import { AgendaPage } from './agenda.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaPageRoutingModule,
    ComponentsModule,
    NgCalendarModule
  ],
  declarations: [AgendaPage]
})
export class AgendaPageModule {}
