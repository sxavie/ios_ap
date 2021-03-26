import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core'

const { Toast } = Capacitor.Plugins

@Injectable({
	providedIn: 'root'
})
export class AlertsService {


	public loader_;

	constructor(private alertCtrl: AlertController,
		private toastCtrl: ToastController,
		private loadingCtrl: LoadingController) { }

	async showAlert(message: string, header: string) {
		const alert = await this.alertCtrl.create({
			cssClass: 'alerts-css-custom',
			message,
			header,
			buttons: [{
				text: 'Aceptar',
				cssClass: 'primary'
			}]
		})
		await alert.present();
	}

	async showToast(message: string, duration: number, color: any = "success", position: any = "bottom") {
		const toast = await this.toastCtrl.create({
			cssClass: 'custom-toast',
			message,
			duration,
			color,
			position
		})
		await toast.present();
	}

	async showLoader() {
		const loader = await this.loadingCtrl.getTop().then(loading => {
			console.log(loading)
		});
		// return loader
	}

	async nativeToast(text) {
		Toast.show({
			text
		})

	}

	async createLoader(message: string) {
		const loader_ = await this.loadingCtrl.create({
			spinner: 'lines-small',
			message
		});

		return loader_;
	}


}
