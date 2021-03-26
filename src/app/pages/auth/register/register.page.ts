import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	public formSubmitted = false;

	public formData = this.fb.group({
		name: ['', Validators.required],
		email: ['', Validators.required], // , Validators.pattern('^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$') 
		password: ['', Validators.required],
		mobile: ['', [Validators.required, Validators.minLength(10)]],
		userType: '3',
		terminos: false
	});

	constructor(private fb: FormBuilder,
		private router: Router,
		private alertsservice: AlertsService,
		private authservice: AuthService
	) { }

	ngOnInit() {
		// if( localStorage.getItem('user-name') ){
		//   this.router.navigate(['/app/home'])
		// }
	}

	onRegister() {

		if (this.frmValidation()) {
			// registrar usuario en la API

			this.authservice.register(this.formData.value)
				.subscribe(
					(resp) => {
						// subscription response
					},
					(err) => {
						// Subscription handle errors
						if (err.status === 0) {
							this.alertsservice.showAlert('Error al conectarse con el servidor', 'Server Error')
						} else {
							this.alertsservice.nativeToast(err.error.message)
						}
					},
					() => {
						// console.log('SUSBCRIBE: se completo')
						this.router.navigate(['/verifyaccount'])
					}
				);

			localStorage.setItem('email-verify', this.formData.value.email);

		} else {
			// console.log('RegisterPage: onRegister() => Formulario no validado')
		}

	}


	// Validaciones de Formulario
	frmValidation(): boolean {

		if (!this.formData.valid) {
			this.alertsservice.nativeToast('Debe completar los campos')
			return false;
		}

		if (!this.isEmail(this.formData.value.email)) {
			this.alertsservice.nativeToast('El email no es valido')
			return false
		}

		if (!this.validPhone(this.formData.value.mobile)) {
			this.alertsservice.nativeToast('El numero no es valido')
			return false
		}

		if (!this.formData.value.terminos) {
			this.alertsservice.nativeToast('Debe aceptar los términos')
			return false
		}

		return true;
	}

	validPhone(phNumber): boolean {
		let number = phNumber.toString()
		if (number.length < 10) { return false }
		return true
	}

	isEmail(email: string): boolean {
		let emailRgx = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i
		return emailRgx.test(email)
	}

}
