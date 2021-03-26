import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangepwdreqPageRoutingModule } from './changepwdreq-routing.module';

import { ChangepwdreqPage } from './changepwdreq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangepwdreqPageRoutingModule
  ],
  declarations: [ChangepwdreqPage]
})
export class ChangepwdreqPageModule {}
