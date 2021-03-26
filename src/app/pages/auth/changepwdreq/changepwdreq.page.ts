import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-changepwdreq',
  templateUrl: './changepwdreq.page.html',
  styleUrls: ['./changepwdreq.page.scss'],
})
export class ChangepwdreqPage implements OnInit {

  public passwordValidation;
  public password;
  public email = localStorage.getItem('fpwdEmail')
  public pin = localStorage.getItem('pin')

  constructor( private authservice: AuthService ) { }

  ngOnInit() {
  }

  changePassword(){


    if ( this.passwordValidation === this.password) {

      console.log( 'what fart')

      
      this.authservice.changePasswordRequest( this.email, this.pin, this.password )
        .subscribe( resp => {
          console.log( resp );
        })

      

    }else{
      console.log( 'la contraseña no coincide' )
    }
  }

}
