import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.model';
import { UserService } from 'src/app/services/userservice.service';


@Component({
	selector: 'app-familiar',
	templateUrl: './familiar.page.html',
	styleUrls: ['./familiar.page.scss'],
})
export class FamiliarPage implements OnInit {

	public imgAvatar;
	public familiarList: any[];
	public memberImgSrc;

	public familiarId: string;
	public familiar: Usuario;
	public filename: any;

	constructor(private activatedroute: ActivatedRoute,
		private loadingCtrl: LoadingController,
		private userservice: UserService) {
	}

	async ngOnInit() {

		await this.userservice.getUserData();
		this.familiarList = this.userservice.usuario.family;

		let spinner = await this.loadingCtrl.create({
			spinner: 'lines-small'
		})

		await spinner.present();

		this.activatedroute.params.subscribe(param => {
			this.familiarId = param.id;

			this.familiar = this.familiarList.find((member: Usuario) => this.familiarId === member._id);

			const { _id, name, email, password, dateCreated, userType, birthday, gender, filename, mobile, bloodType, height, weight,
				paymentID, terms, verified, verificationCode, active, firebaseToken, isOrder, skills, allergies
				, diseases, family } = this.familiar;

			this.userservice.userView = new Usuario(_id, name, email, password, dateCreated, userType, birthday, gender, filename, mobile, bloodType, height, weight,
				paymentID, terms, verified, verificationCode, active, firebaseToken, isOrder, skills, allergies
				, diseases, family)

			this.loadingCtrl.dismiss();
		});

	}

}
