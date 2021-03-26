import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';
import { Platform } from '@ionic/angular';
import {
	StatusBarStyle,
	Plugins,
	PushNotification,
	PushNotificationToken,
	PushNotificationActionPerformed,
} from '@capacitor/core';

const { PushNotifications } = Plugins;

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	public pushAllowed: boolean = false
	public tokenProm: Promise<string> = null

	public formData = this.fb.group({
		email: ['', Validators.required],
		password: ['', Validators.required],
		source: '3',
		firebaseToken: ''
	})

	constructor(private fb: FormBuilder,
		private authservice: AuthService,
		private alertsservice: AlertsService,
		private platform: Platform,

	) { }

	ngOnInit() {


		if (this.platform.is('mobile'))
			PushNotifications.requestPermission().then(result => {
				this.pushAllowed = result.granted
			});
		// if( localStorage.getItem('user-name') ){
		//   this.router.navigate(['app/home'])
		// }

	}

	async updateBackendToken(token) {
		// console.log(token)
	}

	onLogin() {


		if (this.frmValidation()) {
			this.getFirebaseToken().then(firebaseToken => {
				this.formData.value.firebaseToken = firebaseToken
				this.authservice.login(Object.assign({ firebaseToken }, this.formData.value))
					.subscribe(
						() => { },
						(err) => {
							// Subscription handle errors
							if (err.status === 0) {
								this.alertsservice.showAlert('Error al conectarse con el servidor', 'Server Error')
							} else {
								this.alertsservice.nativeToast(err.error.message)
							}
							throw err
						}), () => {

						};
			})
		}

	}

	getFirebaseToken(): Promise<string> {
		if (!this.pushAllowed)
			return new Promise<string>((res) => res(null))
		else {
			this.tokenProm = this.tokenProm || new Promise<string>(res => {
				// On success, we should be able to receive notifications
				PushNotifications.addListener('registration',
					(token: PushNotificationToken) => {
						// console.log("FirebaseToken ", token)
						res(token.value)
					}
				);

				// Some issue with our setup and push will not work
				PushNotifications.addListener('registrationError',
					(error: any) => {
						console.error("FirebaseToken ", error)
						res(null)
					}
				);
			})
			PushNotifications.register();

			this.tokenProm.finally(() => {
				PushNotifications.removeAllListeners()
			})
		}

		return this.tokenProm
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
		return true;

	}
	isEmail(email: string): boolean {
		let emailRgx = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i
		return emailRgx.test(email)
	}


}
