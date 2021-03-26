import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AlertsService } from './alerts.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PharmResponse } from '../models/PharmResponse.model';

const apiUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  public token = localStorage.getItem('jwttoken')

  // Orden Farmacia Variables
  public pharmResponse: PharmResponse;

  constructor( private http: HttpClient,
    private alertsservice: AlertsService,
    private router: Router,
    private loadingCtrl: LoadingController ) { 
  }

  get authHeaders(){
    const x = new HttpHeaders({
      'authorization': this.token
    });
    return x
  }

  getMedicine() {

    const url = `${apiUrl}/medicine`
    const headers = this.authHeaders;

    return this.http.get( url, { headers} )
      // .pipe(tap( medicine => {
      //   // console.log( medicine )
      // }))
      .pipe(catchError( err => {
        return throwError( err );
      }))
  }

  getItemName( name: string ) {
    // https://api.cavimex.vasster.com/medicine?key=name&value=Mejoralito
    const url = `${apiUrl}/medicine`
    const headers = this.authHeaders;

    let params = new HttpParams({
      fromObject : {
        'key':'name',
        'value':name
      }
    })

    return this.http.get(url, {headers, params})
      .pipe(catchError ( err => {
        return throwError( err )
      }))

  }

  newOrder( data ){
    const url = `${apiUrl}/store/order`
    const headers = this.authHeaders;

    return this.http.post<PharmResponse>( url, data, { headers } ).
      pipe(map( (response:any) => {
        let orderPharmResp = response.data
        localStorage.removeItem('myCarrito');
        localStorage.setItem('pharm-order', JSON.stringify(orderPharmResp) );
        this.alertsservice.nativeToast( 'Se generó el pedido de farmacia exitosamente. ' )
        const { amount, items, orderId, patient, patient_address, provider_address } = orderPharmResp
        this.pharmResponse = new PharmResponse( amount, items, orderId, patient, patient_address, provider_address )
      
      })).pipe(catchError( err => {
        this.alertsservice.nativeToast( err.error.error )
        return throwError( err );
      }))
  }

  frmAvaliable( lat, lon){
    // https://api.cavimex.vasster.com/store/available
    let url = `${apiUrl}/store/available`;

    let body = {
      params : {
       'lat' : lat,
       'lon' : lon
      } 
   }
   return this.http.get(url, {params: body.params})
    .pipe(catchError( err => {
      return throwError( err )
    }))
  }

}
