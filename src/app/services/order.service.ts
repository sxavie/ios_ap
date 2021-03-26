import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AlertsService } from './alerts.service';
import { LoadingController } from '@ionic/angular';
import { Consult } from '../models/consult.model';
import { ConsultResp } from 'src/app/models/consultResp.model';
import { ScheduledEvent } from '../interfaces/interfaces';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class OrderService { 


  // Order Variables Consulta
  public newConsultData: Consult;
  public consultResponse: ConsultResp; 
  public consultMessages = []

  public eventsSoruce:ScheduledEvent[];
  public loader;

  constructor( private http: HttpClient,
    private router: Router,
    private alertsservice: AlertsService,
    private loadingCtrl: LoadingController) { }


  public get token() : string {
    return localStorage.getItem('jwttoken')
  }

  public get userid() : string {
    return localStorage.getItem('user-id')
  }

  get authHeaders(){
    let h = new HttpHeaders({
      'authorization': this.token 
    })
    return h;
  }

  genNewOrder(){
    this.loadPresnte('Generando la orden')
    let url = `${apiUrl}/order`
    let headers = this.authHeaders;


    console.log('esta nueva consultas: ', this.newConsultData )

    return this.http.post( url, this.newConsultData, {headers} )
      .pipe(tap( (newOrderResp:any) => {
        if(newOrderResp.meeting){
          this.router.navigate(['app/'])
        }
        this.loader.dismiss()
      }))
      .pipe(catchError( e => {
        this.alertsservice.nativeToast(e.error.message)
        this.loader.dismiss();
        return throwError( e.error )
      }));

  }

  getOrderId( orderId ){
    // https://api.cavimex.vasster.com/order/:id
    let url = `${apiUrl}/order/${orderId}`
    let headers = this.authHeaders;

    return this.http.get( url, {headers} )
      .pipe(tap( (order:any) => {
        console.log( order )
      }))
  }

  // obtener lista de citas de conultas
  scheduled( id ){

    let url = `${apiUrl}/order/${id}/meeting`
    let headers = this.authHeaders

    return this.http.get(url, {headers})
      .pipe(catchError( err =>
        {return throwError( err )}
      ))
  }

  // obtener lista de citas de laboratoiro
  scheduleLabs(){

    const url = `${apiUrl}/schedule/appointments`
    const headers = this.authHeaders;
    const id = this.userid;

    return this.http.post(url, { id }, {headers})

  }
  
  cancellOrder( id :string ){

    this.loadPresnte('Cancelando orden');
    
    let url = `${apiUrl}/order/${id}/cancel`
    let headers = this.authHeaders;

    return this.http.post(url, '', {headers})
      .pipe(tap( (orderCancell:any) => {
        this.loader.dismiss()
      }))
      .pipe(catchError( ( e ) => {
        this.loader.dismiss()
        return throwError( e.error )
      }))

  }
  // Cupones
  cuponValidation( user: string, code: string) {
     let url = `${apiUrl}/coupons/verify`
     let headers = this.authHeaders

     let body = {
       code,
       user
     }

     return this.http.post(url, body, { headers })
       .pipe(catchError( err =>
         {return throwError( err )}
       ))

  }

  async loadPresnte( msg ){

    this.loader = await this.loadingCtrl.create({
      spinner: 'lines-small',
      message: msg
    })

    await this.loader.present();

  }

  



}
