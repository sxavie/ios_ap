import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabschedulecovidPageRoutingModule } from './labschedulecovid-routing.module';

import { LabschedulecovidPage } from './labschedulecovid.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabschedulecovidPageRoutingModule,
    ComponentsModule
  ],
  declarations: [LabschedulecovidPage]
})
export class LabschedulecovidPageModule {}
