import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.page.html',
  styleUrls: ['./forgotpwd.page.scss'],
})
export class ForgotpwdPage implements OnInit {

  public email = '';

  constructor( private router: Router,
    private authservice: AuthService ) { }

  ngOnInit() {
  }

  sendEmail(){

    if( this.email != '' ) {

      localStorage.setItem('fpwdEmail', this.email)

      this.authservice.passwordResetRequest( this.email )
        .subscribe( resp => {
          // console.log(resp)
        })



    }
    
  }

}
