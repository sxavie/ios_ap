import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.model';
import { UserService } from 'src/app/services/userservice.service';

@Component({
	selector: 'app-alergias',
	templateUrl: './alergias.page.html',
	styleUrls: ['./alergias.page.scss'],
})
export class AlergiasPage implements OnInit {

	public imgAvatar: string;
	public userData: any = '';
	public alergias: Array<any> = [];
	public nuevasAlergias: Array<any> = [];

	public strAlergia: string = "";

	public isAdding = false;

	constructor(private menuCtrl: MenuController,
		private router: Router,
		private userservice: UserService,
		private alertCtrl: AlertController) { }

	ngOnInit() {

		this.imgAvatar = this.userservice.usuario.filename;

		if (localStorage.getItem('UserData')) {

			console.log('LolcaStorage Data')
			this.userData = JSON.parse(localStorage.getItem('UserData'))
			this.alergias = this.userData.allergies;
			this.validarAlergias(this.alergias);

		} else {

			console.log('UserService Data');
			this.userservice.getUserData().then((resp: any) => {
				localStorage.setItem('UserData', JSON.stringify(resp))
				this.userData = resp;
				this.alergias = this.userData.allergies;
				this.validarAlergias(this.alergias);
			})

		}

	}

	backProfile() {

		// validar si hay daos pendientes por alamcenar
		if (this.nuevasAlergias.length || this.strAlergia != '') {

			let title = 'Datos sin guardar';
			let msg = 'Existen datos sin guardar, ¿desea continuar?';
			this.showAlert(title, msg)

		} else {
			this.isAdding = false;
			this.router.navigate(['/app/perfil'])
		}

	}

	validarAlergias(allergies) {

		console.log(' NgOnIt alergias => ', allergies)
		console.log(' NgOnIt alergias length => ', allergies.length)

		if (allergies.length === 1) {

			if (allergies[0] === "") {
				console.log("Esta vacio")
				this.alergias = [];
			} else { // este else{} podemos removerlo
				console.log(allergies[0])
			}
		}

	}

	genAllergiesJSON() {

		let templateUpdateAlergias = `{"allergies":"` // cerrar el }

		console.log('Alergias del Usuario', this.alergias)
		console.log('nuevas Alergias =>', this.nuevasAlergias)

		if (this.nuevasAlergias.length > 0) {

			let alergiasString = JSON.stringify(this.alergias);
			console.log('Conviertiendo nuevas alergias Array to String => ', alergiasString)
			alergiasString = alergiasString.replace("[", "");
			alergiasString = alergiasString.replace("]", "");
			console.log('removiendo "[]" del String alergias => ', alergiasString)

			const comma = '"';
			const replace = ''

			let result = alergiasString.split(comma).join(replace);
			console.log('removiendo " del String alergias => ', result)

			templateUpdateAlergias += `${result}"}`;

			let alergiasToJSON = JSON.parse(templateUpdateAlergias)

			console.log('templateUpdateAlergias =>', templateUpdateAlergias)
			console.log('templateUpdateAlergias Parsed =>', alergiasToJSON)

			this.updateAllergies(alergiasToJSON);

			this.nuevasAlergias = [];
			localStorage.removeItem('UserData')

		} else {
			console.log('No se agregaron nuevas alegias')
		}

		this.adding();

	}

	addAllergies() {

		if (this.strAlergia === "") {
			console.log("No se agrega")
		} else {

			let index = this.alergias.indexOf(this.strAlergia);
			if (index === -1) {
				this.alergias.push(this.strAlergia);
				this.nuevasAlergias.push(this.strAlergia);
			} else {
				console.log("la alergia ya existe")
			}

		}
		this.strAlergia = '';
	}

	adding() {

		this.isAdding = !this.isAdding

	}

	removeAllergies(alergia) {

		let index = this.alergias.indexOf(alergia);
		this.alergias.splice(index, 1);
		this.nuevasAlergias.push(alergia);

	}

	updateAllergies(JSONData) {

		let id = this.userData._id;

		this.userservice.updateUserDataAllergies(id, JSONData).subscribe((resp: any) => {
			console.log('ConsultasPage: updateAllergies() => Susbcribe al PUT del servicio actualizar alergias', resp)
		})

	}

	goHome() {
		this.router.navigate(['/app/home'])
	}

	async showAlert(header, message) {
		const alert = await this.alertCtrl.create({
			cssClass: 'alerts-css-custom',
			header,
			message,
			buttons: [
				{
					text: 'Permanecer',
					role: 'cancel',
					cssClass: 'secondary'
				}, {
					text: 'Continuar',
					handler: () => {
						this.router.navigate(['/app/perfil'])
						this.isAdding = false;
						this.nuevasAlergias = [];
					}
				}
			]
		});

		await alert.present();
	}

}
