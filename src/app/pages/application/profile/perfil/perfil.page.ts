import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, MenuController, ViewWillEnter } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.model';
import { UserService } from 'src/app/services/userservice.service';

import { Capacitor, CameraResultType, CameraSource } from '@capacitor/core'
import { AlertsService } from 'src/app/services/alerts.service';
const { Camera } = Capacitor.Plugins;



@Component({
	selector: 'app-perfil',
	templateUrl: './perfil.page.html',
	styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit, ViewWillEnter {


	public userID = localStorage.getItem('user-id');
	//public imgAvatar: string;
	public userData: Usuario;

	public loading;

	constructor(private menuCtrl: MenuController,
		private router: Router,
		private userService: UserService,
		private actionSheetController: ActionSheetController,
		private loadingCtrl: LoadingController,
		private alertsservice: AlertsService) {

		//this.imgAvatar = userService.usuario.imageUrl;

	}
	ionViewWillEnter(): void {
		localStorage.setItem('in-profile', 'in-profile')

	}

	async ngOnInit() {

		this.loading = await this.loadingCtrl.create({
			spinner: 'lines-small',
			message: 'Actualizando'
		})

	}

	async getPhoto(source) {

		let photo = await Camera.getPhoto({
			quality: 70,
			resultType: CameraResultType.DataUrl,
			saveToGallery: true,
			source: source
		})

		var file = await photo;

		this.updatePhoto(file)
	}

	async updatePhoto(file) {

		await this.loading.present();

		const blob = this.b64toBlob(file, 'image/jpg');

		let frmData = new FormData();
		frmData.append('image', blob)

		this.userService.updateUserPhoto(this.userID, frmData).subscribe(
			(photoUpdated) => { },
			(onError) => {
				this.loading.dismiss()
				if (onError.status === 0) {
					this.alertsservice.showAlert('Error al conectarse con el servidor', 'Server Error')
				} else {
					this.alertsservice.nativeToast(onError.error.message)
				}
			},
			() => {
				this.userService.clearUserCache().then(
					(user) => {
						console.log(user.filename)
						//this.imgAvatar = this.userService.transformFilename(user.filename);
					},
					(onError) => {
						// Subscription handle errors
						this.loading.dismiss()
						if (onError.status === 0) {
							this.alertsservice.showAlert('Error al conectarse con el servidor', 'Server Error')
						} else {
							this.alertsservice.nativeToast(onError.error.message)
						}
					}).finally(() => {
						this.userService.imgUpdated.emit(this.userService.image)
						this.loading.dismiss()
					}
					)
			}
		)

	}

	private b64toArrayBff(file) {
		const bytesString = atob(file.dataUrl.split(',')[1]);
		const ab = new ArrayBuffer(bytesString.length);
		const ia = new Uint8Array(ab);

		for (let i = 0; i < bytesString.length; i++) {
			ia[i] = bytesString.charCodeAt(i);
		}

		return ia;
	}

	private b64toBlob(file, mimetype) {
		return new Blob([this.b64toArrayBff(file)], {
			type: mimetype
		})
	}

	async presentActionSheet() {
		const actionSheet = await this.actionSheetController.create({
			
			buttons: [{
				text: 'Camara',
				icon: 'camera-outline',
				handler: () => {
					this.getPhoto(CameraSource.Camera);
				}
			}, {
				text: 'Galeria',
				icon: 'image-outline',
				handler: () => {
					this.getPhoto(CameraSource.Photos);
				}
			}, {
				text: 'Cancelar',
				icon: 'close',
				role: 'cancel'
			}]
		});

		await actionSheet.present();

	}

	toggleMenu() {
		this.menuCtrl.toggle('tdxMenu');
	}

	goHome() {
		this.router.navigate(['/app/home'])
	}

} 
