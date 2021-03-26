import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verifyaccount',
  templateUrl: './verifyaccount.page.html',
  styleUrls: ['./verifyaccount.page.scss'],
})
export class VerifyaccountPage implements OnInit {

  public pinIsValid = false;
  public pin = '';
  
  constructor( private authservice: AuthService,
    private alertsservice: AlertsService,
    private router: Router ) { }

  ngOnInit() {
  }

  verifyAccount(){

    let email = localStorage.getItem('email-verify')
    // console.log( 'VerifyaccountPage: verifyAccount() => Susbcribe al servicio de verifycar cuenta' )
    // console.log(email)
    this.authservice.verifyAcccount(email, this.pin).subscribe( (resp:any) => {

      // console.log( resp )

      if (resp.message === 'Usuario no encontrado.'){
        this.alertsservice.nativeToast( resp.message );
      }else {
        this.alertsservice.nativeToast( resp.message );
        this.router.navigate(['/login'])
      }

    })
  
  }

  pinValidation() {

    if( this.pin.length < 4 ) {
      this.pinIsValid = false
    }else {
      this.pinIsValid = true
    }

  }

  codeResend(){
    // console.log( 'VerifyaccountPage: codeResend() => click reenvio de codigo' )

    let email = localStorage.getItem('email-verify')
    // console.log(email)

    this.authservice.verifyResendCode( email).subscribe( resp => console.log(resp))
  }


}
