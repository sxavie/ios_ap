import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { UserService } from 'src/app/services/userservice.service';
import { AgregarfamiliarPage } from '../agregarfamiliar/agregarfamiliar.page';

@Component({
	selector: 'app-familiares',
	templateUrl: './familiares.page.html',
	styleUrls: ['./familiares.page.scss'],
})
export class FamiliaresPage implements OnInit, ViewWillEnter {

	public imgAvatar = localStorage.getItem('user-filename');
	public userData: Usuario;

	constructor(
		private router: Router,
		public userservice: UserService,
		private modalCtrl: ModalController,
		private popoverCtrl: PopoverController) { }

	ionViewWillEnter(): void {

		this.userservice.getUserData().then(() => {
			this.userData = this.userservice.usuario
		})
	}


	ngOnInit() {

		this.userData = this.userservice.usuario


	}

	async addMemberModal(ev: any) {
		console.log('FamiliaresPage addMemberModal() ==> Ejecutando el modal ')

		const modal = await this.modalCtrl.create({
			component: AgregarfamiliarPage,
			cssClass: 'addMember-modal',
			backdropDismiss: false

		});

		modal.onWillDismiss().then(() => {

			setTimeout(() => {

				this.userservice.clearUserCache().then(() => {
					this.userData = this.userservice.usuario
				});

			}, 150);

		});

		return await modal.present();

	}



	goFamiliar(id) {
		this.router.navigate([`/app/familiares/familiar/${id}`]);
	}

	goHome() {
		this.router.navigate(['/app/home'])
	}

}
