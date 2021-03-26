import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { IonicModule } from '@ionic/angular';

import { VideocallPageRoutingModule } from './videocall-routing.module';

import { VideocallPage } from './videocall.page';
import { OpenViduVideoComponent } from '../../../components/openvidu/ov-video.component';
import { UserVideoComponent } from 'src/app/components/openvidu/user-video.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideocallPageRoutingModule
  ],
  declarations: [VideocallPage, UserVideoComponent, OpenViduVideoComponent],
  providers: [
    AndroidPermissions
  ]
})
export class VideocallPageModule {}
