import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertsService } from './alerts.service';


const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AddressService {


  public token = localStorage.getItem('jwttoken')
  public userID = localStorage.getItem('user-id')

  constructor( private http: HttpClient,
    private alertsservice: AlertsService ) { }

  get authHeaders(){
    const x = new HttpHeaders({
      'authorization': this.token
    });
    return x
  }

  getAddress(){
    // https://api.cavimex.vasster.com/addresses/:id/list
    const url = `${apiUrl}/addresses/${this.userID}/list`
    const headers = this.authHeaders;


    return this.http.get( url , { headers } )
    .pipe(tap( resp => { resp} ))
    .pipe(catchError( err => { return throwError( err )}));

  }

  addAddress( address ) {
    // https://api.cavimex.vasster.com/address

    const url = `${apiUrl}/address`
    const headers = this.authHeaders;

    return this.http.post( url , address, { headers } ).pipe(catchError( err => {
      this.alertsservice.nativeToast( err.error.error );
      return throwError( err )
    }) )

  }

  removeAddress( address ){
    // https://api.cavimex.vasster.com/address/5fb5cc37c70a992d4643b378
    let url = `${apiUrl}/address/${address._id}`
    let headers = this.authHeaders;

    return this.http.delete( url, {headers }).pipe(catchError( err => {return throwError( err )}));
  }

}
