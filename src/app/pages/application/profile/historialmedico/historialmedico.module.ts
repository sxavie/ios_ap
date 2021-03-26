import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialmedicoPageRoutingModule } from './historialmedico-routing.module';

import { HistorialmedicoPage } from './historialmedico.page';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from 'src/app/interceptors/http-loading.interceptor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialmedicoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [HistorialmedicoPage],
   providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    }
  ]
})
export class HistorialmedicoPageModule {}
