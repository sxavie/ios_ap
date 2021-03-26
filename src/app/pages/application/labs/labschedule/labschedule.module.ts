import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LabschedulePageRoutingModule } from './labschedule-routing.module';

import { LabschedulePage } from './labschedule.page';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabschedulePageRoutingModule,
    ComponentsModule
  ],
  declarations: [LabschedulePage]
})
export class LabschedulePageModule {}
