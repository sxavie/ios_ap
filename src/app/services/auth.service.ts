import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


import { LoginForm, RegisterForm } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UserService } from './userservice.service';
import { OrderService } from './order.service';
import { LabsService } from './labs.service';


const apiUrl = environment.apiUrl;

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private http: HttpClient,
		private router: Router,
		private userService: UserService,
		private orderservice: OrderService,
		private labsservices: LabsService) { }

	register(formData: RegisterForm) {
		let url = `${apiUrl}/user/register`

		return this.http.post(url, formData)
			.pipe(tap((resp: any) => {
				localStorage.setItem('email-verify', formData.email);
				this.router.navigate(['/verifyaccount'])
			}))
			.pipe(catchError(err => {
				return throwError(err)
			}));

	}

	verifyAcccount(email: string, pin: string) {
		return this.http.post(`${apiUrl}/users/verifyAccount`, { email, pin })
			.pipe(tap((resp: any) => {
			}))
			.pipe(catchError(err => {
				return throwError(err);
			}))

	}

	verifyResendCode(email) {
		// https://api.cavimex.vasster.com/users/resendcode?verify=true
		let url = `${apiUrl}/users/resendcode?verify=true`;

		return this.http.post(url, { email })
			.pipe(map((res) => console.log(res)));
	}

	login(formData: LoginForm) {
		return this.http.post(`${apiUrl}/user/login`, formData)
			.pipe(map((resp: any) => {
				localStorage.setItem('jwttoken', resp.token)
				this.userService.decodeToken(resp.token);
			}))
			.pipe(catchError(err => {
				return throwError(err)
			}));
	}

	passwordResetRequest(email) {
		let url = `${apiUrl}/users/password-reset-request`
		return this.http.post(url, { email })
			.pipe(map(resp => {
				this.router.navigate(['/verifyfpwdpin'])
			}))
			.pipe(catchError(err => {
				return throwError(err);
			}))

	}

	passwordResetVerify(email, pin) {
		let url = `${apiUrl}/users/password-reset-verify`

		return this.http.post(url, { email, pin })
			.pipe(tap(resp => {
				localStorage.setItem('pin', pin)
				this.router.navigate(['/changepwdreq'])
			}))
			.pipe(catchError(err => {
				return throwError(err);
			}))
	}

	ResetRequestResendCode(email) {
		let url = `${apiUrl}/users/resendcode?password=true`

		return this.http.post(url, { email })
			.pipe(map(resp => {
			}))
			.pipe(catchError(err => {
				return throwError(err)
			}))
	}

	changePasswordRequest(email, pin, password) {
		let url = `${apiUrl}/users/password-reset`

		return this.http.post(url, { email, pin, password })
			.pipe(map(resp => {
				localStorage.removeItem('fpwdEmail')
				localStorage.removeItem('pin')
				this.router.navigate(['/login']);
			}))
			.pipe(catchError(err => {
				return throwError(err);
			}))
	}

	logout() {
		localStorage.clear()
		this.userService.usuario = null;
		this.orderservice.newConsultData = null;
		this.orderservice.consultResponse = null;
		this.labsservices.newLabData = null;
		this.labsservices.labResponse = null;

		this.userService.clearUserData();
		this.router.navigate(['/']);
	}


}
