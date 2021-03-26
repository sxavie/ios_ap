import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ComponentsModule } from './components/components.module';

import { HttpClientModule } from '@angular/common/http';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

//SocketoIO
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

defineCustomElements(window);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    SocketIoModule.forRoot({ url: environment.apiUrl, options: { origin: '*', transport : ['websocket'] } })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpRequestInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
  
})



export class AppModule {}
