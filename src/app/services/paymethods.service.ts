import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Card } from '../interfaces/interfaces';

const apiUrl = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class PayMethodsService {

  constructor(private http: HttpClient,
    private router: Router) { }



  get UserData() {
    return JSON.parse(localStorage.getItem('tidux-patient-user'));
  }


  getPayMethods() {

    let uid = localStorage.getItem('user-id');
    let token = localStorage.getItem('jwttoken');
    let url = `${apiUrl}/payment/card/${uid}`;

    let headers = new HttpHeaders({
      'authorization': token
    });

    return this.http.get(url, { headers })
      .pipe(tap(resp => {
      }))
      .pipe(catchError(err => {
        return throwError(err);
      }))

  }

  getPayMethods_remx(labsFlowData) {

    let userData = this.UserData;
    let token = localStorage.getItem('jwttoken');
    let url = `${apiUrl}/list/cards/`;

    let headers = new HttpHeaders({
      'authorization': token
    });

    const { appointment, medicalCenterID } = labsFlowData.data;

    console.log('send Data...', { customerID: userData.paymentID, appointment, medicalCenterID });

    return this.http.post(url, { customerID: userData.paymentID, appointment, medicalCenterID }, { headers });

  }

  addPayMethod(cardData: Card) {
    let token = localStorage.getItem('jwttoken')
    let url = `${apiUrl}/payment/card`
    let headers = new HttpHeaders({
      'authorization': token
    })

    return this.http.post(url, cardData, { headers });
    //   .pipe(tap(resp => {
    //     this.router.navigate(['/app/metodopago'])
    //   }))
    //   .pipe(catchError(err => {
    //     return throwError(err)
    //   }))
  }

  setPayMethod(cardId: string) {
    // https://api.cavimex.vasster.com/payment/card/default	definir tarjeta como predeterminada
    let uid = localStorage.getItem('user-id');
    let token = localStorage.getItem('jwttoken');
    let url = `${apiUrl}/payment/card/default`

    let headers = new HttpHeaders({
      'authorization': token
    });

    return this.http.post(url, { "user": uid, "card": cardId }, { headers })
      .pipe(tap(resp => { }))
      .pipe(catchError(err => {
        return throwError(err);
      }))
  }

  deletePayMethod(userId: string, cardId: string) {
    // https://api.cavimex.vasster.com/payment/card
    let url = `${apiUrl}/payment/card`
    let token = localStorage.getItem('jwttoken');

    let Options = {
      headers: new HttpHeaders({
        'authorization': token
      }),
      body: {
        user: userId,
        card: cardId
      },
    }

    return this.http.delete(url, Options)
      .pipe(catchError(err => {
        return throwError(err)
      }))

  }

  getPendingOrders(uid: string) {
    // http://192.168.72.52:3090/payment/customer/6021bb4fff0d9f34b8e74ba3/orders
    const url = `${apiUrl}/payment/customer/${uid}/orders`
    const token = localStorage.getItem('jwttoken');

    const headers = new HttpHeaders({
      'authorization': token
    });

    return this.http.get(url, { headers })

  };

}
