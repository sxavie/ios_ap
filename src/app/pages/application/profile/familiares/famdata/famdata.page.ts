import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, PickerController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alerts.service';
import { UserService } from 'src/app/services/userservice.service';

import { Capacitor, CameraResultType, CameraSource } from '@capacitor/core'
const { Camera } = Capacitor.Plugins;

@Component({
	selector: 'app-famdata',
	templateUrl: './famdata.page.html',
	styleUrls: ['./famdata.page.scss'],
})
export class FamdataPage implements OnInit {

	public loading;

	public memberData;
	public hrefBack;

	public isEdit = false;
	public edit_save = 'Editar';

	public name;
	public relationship;
	public imgSrc;
	public noImg;

	public newBirth;
	public edad;

	public usergender = 'Seleccione';
	public userweight = 0;
	public userheight = 0;
	public userblood = 'Seleccione';

	constructor(public pickerCtrl: PickerController,
		public userservice: UserService,
		private alertsservice: AlertsService,
		private loadingCtrl: LoadingController,
		private actionSheetCtrl: ActionSheetController) { }

	ngOnInit() {
		this.memberData = this.userservice.userView;
		this.hrefBack = `/app/familaires/familiar/${this.memberData._id}`;
		this.setVariables();
	}

	setVariables() {
		this.relationship = this.memberData.relationship
		this.name = this.memberData.name

		this.imgSrc = this.userservice.transformFamilyFilename(this.memberData.filename);
		this.userweight = this.memberData.weight === null ? 0 : this.memberData.weight;
		this.userheight = this.memberData.height === null ? 0 : this.memberData.height;
		this.usergender = this.memberData.gender === null ? 'Seleccionar' : this.memberData.gender;
		this.userblood = this.memberData.bloodType === null || this.memberData.bloodType === undefined ? 'Seleccionar' : this.memberData.bloodType
		this.edad = this.memberData.birthday === null ? 0 : this.calcularEdad(this.newBirth)
	}

	async edit() {

		if (!this.isEdit) {

			this.userheight = this.memberData.height === null || this.memberData.height === undefined ? 0 : this.memberData.height;
			this.userweight = this.memberData.weight === null || this.memberData.weight === undefined ? 0 : this.memberData.weight
			this.newBirth = this.memberData.birthday === null ? new Date : this.memberData.birthday


			this.edit_save = 'Guardar';
		} else {

			const loader = await this.loadingCtrl.create({
				spinner: 'lines-small'
			})

			await loader.present();


			let body = {
				birthday: this.newBirth,
				gender: this.usergender,
				height: this.userheight,
				weight: this.userweight,
				bloodType: this.userblood,
			}

			await this.userservice.updateUserData(this.memberData._id, body).subscribe(resp => {

				this.edad = this.calcularEdad(this.newBirth);
				this.edad = this.edad;
				this.userheight = this.userheight;
				this.userweight = this.userweight;

				this.alertsservice.nativeToast('Se actualizo la informacion del usuario')

				this.userservice.getMemberData(this.userservice.userView._id).subscribe((user) => {
					this.memberData = user;
					this.setVariables();
				})
			})

			await loader.dismiss();
			this.edit_save = 'Editar'
		}


		this.isEdit = !this.isEdit
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

		this.loading = await this.loadingCtrl.create({
			spinner: 'lines-small',
			message: 'Actualizando imagen'
		})

		await this.loading.present();

		const blob = this.b64toBlob(file, 'image/jpg');

		let frmData = new FormData();
		frmData.append('image', blob)

		this.userservice.updateUserPhoto(this.userservice.userView._id, frmData).subscribe(() => {
			this.userservice.getMemberData(this.userservice.userView._id).subscribe(resp => {
				this.imgSrc = this.userservice.transformFamilyFilename(resp.filename);
				this.loading.dismiss()
			})
		})
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
		const actionSheet = await this.actionSheetCtrl.create({
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

	calcularEdad(fecha = this.memberData.birthday) {

		if (fecha === undefined) return 0;

		var hoy = new Date();
		var cumpleanos = new Date(fecha);
		var edad = hoy.getFullYear() - cumpleanos.getFullYear();
		var m = hoy.getMonth() - cumpleanos.getMonth();

		if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
			edad--;
		}

		return edad;
	}

	async genderPick() {
		const genPicker = await this.pickerCtrl.create({
			buttons: [
				{
					text: "Cancelar",
					role: 'cancel'
				},
				{
					text: 'Ok',
					handler: (v: any) => {
						this.usergender = v.Genero.value;
					}
				}
			],
			columns: [{
				name: 'Genero',
				options: [
					{ text: 'Masculino', value: 'Masculino' },
					{ text: 'Femenino', value: 'Femenino' }
				]
			}]
		});
		await genPicker.present();
	}
	async bloodPick() {
		const bloodPick = await this.pickerCtrl.create({
			buttons: [{
				text: "Cancelar",
				role: "cancel"
			}, {
				text: 'OK',
				handler: (v: any) => {
					this.userblood = v.Peso.value;
				}
			}],
			columns: [{
				name: 'Peso',
				options: [
					{ text: 'A+', value: 'A+' },
					{ text: 'A-', value: 'A-' },
					{ text: 'B+', value: 'B+' },
					{ text: 'B-', value: 'B-' },
					{ text: 'AB+', value: 'AB+' },
					{ text: 'AB-', value: 'AB-' },
					{ text: 'O+', value: 'O+' },
					{ text: 'O-', value: 'O-' },
				]
			}]
		});
		await bloodPick.present();
	}

}
