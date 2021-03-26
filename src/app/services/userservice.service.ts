import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { tap, map, catchError } from 'rxjs/operators'
import { JwtHelperService } from '@auth0/angular-jwt'

import { Diseases, LoginForm, PayMethod, RegisterForm, UpdateForm } from '../interfaces/interfaces';
import { Usuario } from '../models/usuario.model';
import { Observable, of, Subject, throwError } from 'rxjs';
import { AlertsService } from './alerts.service';
import { HomePage } from '../pages/application/home/home.page';

// variables
const apiUrl = environment.apiUrl;
const helper = new JwtHelperService;


@Injectable({
	providedIn: 'root'
})
export class UserService {


	public get userid(): string {
		if (!this._userid) {

			if (this.token)
				this._userid = helper.decodeToken(this.token).id;

			// if (this._userid)
				// console.log('UserService -> userid:', this.userid)
		}
		return this._userid;
	}
	public get token(): string {
		if (!this._token) {
			this._token = localStorage.getItem('jwttoken');
			// if (this._token)
				// console.log('UserService -> token:', this._token);
		}
		return this._token;
	}

	private _token: string = null;
	private _userid: string = null;

	public userFoto = '/assets/userNoImg.png';
	public usuario: Usuario;
	public userView: Usuario;

	//variables variables
	public imgUpdated: EventEmitter<string> = new EventEmitter<string>();
	public defaultMethod: PayMethod = { brand: 'cash', cardID: 'cash', default_source: 'cash', last4: '' }
	public defaultAddressID: string;

	constructor(
		private http: HttpClient,
		private router: Router,
		private alertsservice: AlertsService) {
		this.clearUserCache();
	}

	get authHeaders() {
		return {
			headers: new HttpHeaders({
				authorization: this.token
			})
		};
	}

	public imageDefault = '/assets/default-user.jpg';
	public get image(): string {
		return this.transformFilename(this.usuario?.filename);
	}
	// mover a auth service.
	transformFilename(u: any) {
		if (!!u) {
			const splitImgFormat = u.split('.');
			return `${apiUrl}/images/users/${splitImgFormat[0]}`;
		}
		return '/assets/default-user.jpg';
	}

	transformFamilyFilename(u: any) {
		let imgPath = null;
		if (u === null || u === undefined) {
			imgPath = '/assets/userNoImg.png'
		} else {
			let splitImgFormat = u.split('.');
			imgPath = `${apiUrl}/images/users/${splitImgFormat[0]}`
		}
		return imgPath
	}

	decodeToken(token) {

		const u = helper.decodeToken(token)
		this.transformFilename(u.filename)
		localStorage.setItem('user-name', u.name)
		localStorage.setItem('user-email', u.email)
		localStorage.setItem('user-id', u.id)
		this.router.navigate(['/app'])

	}

	public getUserData(): Promise<Usuario> {
		return new Promise<Usuario>(async (res) => {
			//Conseguimos el usuario de memoria
			if (!!this.usuario) {
				return res(this.usuario);
			}

			//Conseguimos de el api
			const apiUser = await this._getUserData();
			if (apiUser) {
				this._saveUserData(apiUser);
				return res(apiUser);
			}

			//Conseguimos de el localstorage
			const userJson = localStorage.getItem('tidux-patient-user');
			if (userJson != null) {
				try {
					this.usuario = JSON.parse(userJson);
					// console.log('UserService -> data:storage');
					return res(this.usuario);
				} catch (err) {
					localStorage.removeItem('tidux-patient-user')
					// console.log('UserService -> data:storage failed');
				}
			} else {
				// console.log('UserService -> data:none');
				return res(null);
			}
		});
	}

	private async _getUserData(): Promise<Usuario> {
		if (!this.userid) return;

		const url = `${apiUrl}/users/${this.userid}`;
		try {
			this.usuario = await this.http.get<Usuario>(url, this.authHeaders).toPromise();
			return this.usuario;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	public clearUserData() {
		let keys = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (!key.startsWith('mapbox'))
				keys.push(key);
		}

		keys.forEach(key => localStorage.removeItem(key));

		this._token = null;
		this._userid = null;
		this.usuario = null;

	}

	public clearUserCache(refill: boolean = true): Promise<Usuario> {
		localStorage.removeItem('tidux-doctor-user');
		this.usuario = null;
		// console.log('UserService -> data:clear-cache');
		if (refill)
			return this.getUserData();
	}

	private _saveUserData(user: Usuario) {
		localStorage.setItem('tidux-patient-user', JSON.stringify(user));
	}

	getMemberData(memberid: string) {
		let url = `${apiUrl}/users/${memberid}`

		return this.http.get<Usuario>(url, this.authHeaders)
			.pipe(tap((x: any) => {

				const { _id, name, email, password,
					dateCreated, userType, birthday, gender, filename, mobile, bloodType,
					height, weight, paymentID, terms, verified, verificationCode, active, firebaseToken,
					isOrder, skills, allergies, diseases, family, relationship } = x

				this.userView = new Usuario(_id, name, email, password,
					dateCreated, userType, birthday, gender, filename, mobile, bloodType,
					height, weight, paymentID, terms, verified, verificationCode, active, firebaseToken,
					isOrder, skills, allergies, diseases, family, relationship);

				this.usuario.family[this.usuario.family.findIndex((x: any) => x._id === memberid)] = this.userView;
				this._saveUserData(this.usuario);
			}))
			.pipe(catchError(err => {
				return throwError(err)
			}));

	}

	updateUserData(id, body) {
		let url = `${apiUrl}/users/${id}`
		return this.http.put(url, body, this.authHeaders)
			.pipe(tap(() => {

			}))
			.pipe(catchError(err => {
				return throwError(err)
			}));
	}

	updateUserDataAllergies(id, allergies) {
		let url = `${apiUrl}/users/${id}`
		return this.http.put(url, allergies, this.authHeaders)
			.pipe(catchError(err => {
				return throwError(err)
			}))
	}

	updateUserDataDiseases(id, data: Diseases) {
		let url = `${apiUrl}/user/medicalhistory/${id}`

		const httpParamsData = new HttpParams()
			.set("diabetes", data.diabetes.toString())
			.set("epilepsy", data.epilepsy.toString())
			.set("heartDisease", data.heartDisease.toString())
			.set("hypertension", data.hypertension.toString())
			.set("prevSurgeries", data.prevSurgeries.toString())
			.set("others", "true");

		return this.http.post(url, httpParamsData, this.authHeaders)
			.pipe(tap(() => {
			}))
			.pipe(catchError(err => {
				return throwError(err)
			}))
	}

	addMember(data) {
		let token = localStorage.getItem('jwttoken');
		let uid = localStorage.getItem('user-id')
		let url = `${apiUrl}/user/addmember/${uid}`;

		return this.http.post(url, data, this.authHeaders)
			.pipe(tap(() => {
				setTimeout(() => {
					this.getUserData();
				}, 150);
			}))
			.pipe(catchError(err => {
				return throwError(err);
			}))

	}

	getAddressList() {
		let url = `${apiUrl}/addresses/${this.usuario._id}/list`
		return this.http.get(url, this.authHeaders)
			.pipe(tap(addressList => {
			}))
			.pipe(catchError(err => {
				return throwError(err);
			}))
	}

	updateUserPhoto(id, form) {
		// https://api.cavimex.vasster.com/user/photo/5f91caa9ed5b402c0370f227
		let url = `${apiUrl}/user/photo/${id}`;

		return this.http.put(url, form, this.authHeaders)
			.pipe(catchError(err => { return throwError(err) }));

	}
}
