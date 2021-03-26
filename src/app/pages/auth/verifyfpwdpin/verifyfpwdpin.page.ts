import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verifyfpwdpin',
  templateUrl: './verifyfpwdpin.page.html',
  styleUrls: ['./verifyfpwdpin.page.scss'],
})
export class VerifyfpwdpinPage implements OnInit {

  public fEmailAccount = localStorage.getItem('fpwdEmail');
  public pinIsValid = false;
  public pin = '';
  public resend = false;

  constructor( private router: Router,
    private authservice: AuthService ) { }

  ngOnInit() {

  }

  verifyPin(){

    this.authservice.passwordResetVerify( this.fEmailAccount, this.pin )
      .subscribe( resp => {
      })
    
  }
  
  codeResend(){   
    this.authservice.ResetRequestResendCode( this.fEmailAccount ).subscribe( resp => {
      this.resend = true;
    })
  }

  pinValidation( ) {

    if( this.pin.length < 4 ) {
      this.pinIsValid = false
    }else {
      this.pinIsValid = true
    }

  }



}
