import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, PickerController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { UserService } from 'src/app/services/userservice.service';


@Component({
	selector: 'app-datosgenerales',
	templateUrl: './datosgenerales.page.html',
	styleUrls: ['./datosgenerales.page.scss'],
})
export class DatosgeneralesPage implements OnInit {

	public imgAvatar: string;
	public userData: Usuario;

	public username: string;
	public usergender: string;
	public userheight: string;
	public userweight: string;
	public userAge: number;
	public userblood: string;

	public edad: any;

	public edit_save: string = 'Editar'
	public isEdit = false;
	public newBirth;


	constructor(private menuCtrl: MenuController,
		private router: Router,
		private userService: UserService,
		private pickerCtrl: PickerController,
		private alertsservice: AlertsService,
		private loadingCtrl: LoadingController) { }

	ngOnInit() {
		this.userService.getUserData().then((data) => {
			this.setVariables();
		})
	}

	setVariables() {

		this.userData = this.userService.usuario;
		this.imgAvatar = this.userService.image;

		this.username = this.userData.name;
		this.usergender = (!this.userData.gender) ? 'Seleccionar' : this.userData.gender;
		this.userblood = (!this.userData.bloodType) ? 'Seleccionar' : this.userData.bloodType;
		this.userweight = this.userData.weight;
		this.userheight = this.userData.height;

		if (this.userData.birthday === null) {
			this.edad = '0';
		} else {
			this.userAge = this.calcularEdad(this.userData.birthday)
			this.edad = this.userAge;
		}

	}

	async edit() {

		if (!this.isEdit) {
			this.edit_save = 'Guardar'

			this.userheight = this.userData.height
			this.userweight = this.userData.weight
			this.newBirth = this.userData.birthday === null ? new Date : this.userData.birthday

		} else {

			let loader = await this.loadingCtrl.create({
				spinner: 'lines-small',
				message: 'Actualizando la informacion'
			});

			await loader.present();

			let body = {
				name: this.username,
				birthday: this.newBirth,
				gender: this.usergender,
				height: this.userheight,
				weight: this.userweight,
				bloodType: this.userblood,
			}

			this.userService.updateUserData(this.userData._id, body).subscribe(resp => {
				this.userService.clearUserCache().then((user) => {
					this.userData = user;
					this.alertsservice.nativeToast('Se actualizo la informacion del usuario')
					loader.dismiss();
					this.setVariables();
				});
			})

			this.edit_save = "Editar"
		}

		this.isEdit = !this.isEdit
	}

	calcularEdad(fecha = this.userData.birthday) {

		if (fecha === undefined) {
			return 0;
		}

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
					text: "Cancel",
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

	goHome() {
		this.router.navigate(['/app/home'])
	}
}
