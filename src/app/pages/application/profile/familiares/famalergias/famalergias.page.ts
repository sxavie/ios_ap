import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
	selector: 'app-famalergias',
	templateUrl: './famalergias.page.html',
	styleUrls: ['./famalergias.page.scss'],
})
export class FamalergiasPage implements OnInit {

	//User-acc-filename
	public imgAvatar: string;

	//Member-data
	public memberData: Usuario;
	public alergias: Array<any> = [];

	// variables edicion alergias
	public nuevasAlergias: Array<any> = [];
	public strAlergia: string = "";
	public isAdding = false;

	constructor(private alertsservice: AlertsService,
		private router: Router,
		private alertCtrl: AlertController,
		private userservice: UserService) { }

	ngOnInit() {
		this.memberData = this.userservice.userView;
		this.alergias = this.memberData.allergies;
		this.validarAlergias(this.alergias);
	}

	genAllergiesJSON() {

		let templateUpdateAlergias = `{"allergies":"`

		if (this.nuevasAlergias.length > 0) {

			let alergiasString = JSON.stringify(this.alergias);
			alergiasString = alergiasString.replace("[", "");
			alergiasString = alergiasString.replace("]", "");

			const comma = '"';
			const replace = ''

			let result = alergiasString.split(comma).join(replace);
			templateUpdateAlergias += `${result}"}`;

			let alergiasToJSON = JSON.parse(templateUpdateAlergias)
			this.updateAllergies(alergiasToJSON);
			this.nuevasAlergias = [];

		}

		this.adding();

	}

	validarAlergias(allergies) {
		if (allergies.length === 1) {
			if (allergies[0] === "") this.alergias = [];
		}
	}

	adding() {
		this.isAdding = !this.isAdding
	}

	addAllergies() {

		if (this.strAlergia != "") {

			let index = this.alergias.indexOf(this.strAlergia);
			if (index === -1) {
				this.alergias.push(this.strAlergia);
				this.nuevasAlergias.push(this.strAlergia);
			}
		}

		this.strAlergia = '';
	}

	removeAllergies(alergia) {
		let index = this.alergias.indexOf(alergia);
		this.alergias.splice(index, 1);
		this.nuevasAlergias.push(alergia);
	}

	backProfile() {
		if (this.nuevasAlergias.length || this.strAlergia != '') {
			let title = 'Datos sin guardar';
			let msg = 'Existen datos sin guardar, ¿desea continuar?';
			this.showAlert(msg, title)
		} else {
			this.isAdding = false;
			this.router.navigate([`/app/familiares/familiar/${this.memberData._id}`])
		}
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
						this.router.navigate([`/app/familiares/familiar/${this.memberData._id}`])
						this.isAdding = false;
						this.nuevasAlergias = [];
					}
				}
			]
		});
		await alert.present();
	}

	updateAllergies(JSONData) {

		let id = this.memberData._id;
		console.log('Update alergias', JSONData)

		this.userservice.updateUserDataAllergies(id, JSONData).subscribe(() => {
			this.userservice.clearUserCache().then(() => {
				this.memberData = this.userservice.usuario.family.find((member: any) => this.memberData._id === member._id);
			})
		})

	}

}
