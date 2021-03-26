import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ViewDidEnter, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemCart } from 'src/app/interfaces/interfaces';
import { AlertsService } from 'src/app/services/alerts.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/userservice.service';


@Component({
	selector: 'app-cart',
	templateUrl: './cart.page.html',
	styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, ViewWillEnter {

	public myCarrito: ItemCart[] = [];
	public isEmptyCart: boolean = true;

	public cuponCode: string;
	public cuponValidationClass;

	public shiping = 65;
	public itemsTotal = 0;
	public itemsQty = 0;
	public ordTotal = 0;

	constructor(private alertCtrl: AlertController,
		private router: Router,
		private loadCtrl: LoadingController,
		private actionSheeCtrl: ActionSheetController,
		private alertsservice: AlertsService,
		public orderservice: OrderService,
		public userservice: UserService) { }

	async ionViewWillEnter() {

		let loader = await this.loadCtrl.create({
			spinner: 'lines-small'
		})

		await loader.present();

		if (localStorage.getItem('myCarrito')) {
			this.myCarrito = JSON.parse(localStorage.getItem('myCarrito'))
			this.isEmptyCart = false
		}

		this.totalCalculator()

		loader.dismiss();

	}

	ngOnInit() { }

	totalCalculator() {

		if (!this.isEmptyCart) {

			let itemsPrice$: Observable<any> = from(this.myCarrito);
			itemsPrice$.pipe(map((item: any) => {
				let itemTotal;
				itemTotal = (item.price * item.quantity)

				this.itemsTotal = this.itemsTotal + itemTotal;
				this.itemsQty = this.itemsQty + item.quantity
			})).subscribe(resp => {
				this.ordTotal = this.itemsTotal + this.shiping
			})
		}

	}

	findItemIdx(iFind) {
		let index = this.myCarrito.findIndex(function (itm) {
			if (iFind._id === itm._id)
				return true
		});
		return index
	}


	removeToCart(item: ItemCart) {

		this.itemsTotal = 0;
		this.itemsQty = 0;
		this.ordTotal = 0;

		let newItem: ItemCart = {
			_id: item._id,
			name: item.name,
			description: item.description,
			price: item.price,
			fileName: item.fileName,
			quantity: 1
		}

		let idx = this.findItemIdx(newItem);

		if (idx > -1) {

			this.myCarrito.splice(idx, 1)

			this.alertsservice.nativeToast(`Se a eliminado ${item.name} del carrito`)

			if (this.myCarrito.length === 0) {
				this.emptyCart();
				// this.router.navigate(['/app/farmacia'])
			} else {
				this.totalCalculator();
				localStorage.setItem('myCarrito', JSON.stringify(this.myCarrito))
			}

		}

	}

	async itemContextual(item: ItemCart) {

		const actionSheet = await this.actionSheeCtrl.create({
			header: item.name,
			buttons: [{
				text: `Eliminar ${item.quantity} ${item.name}(s) del carrito`,
				icon: 'trash-outline',
				role: 'destructive',
				cssClass: 'primary',
				handler: () => {
					this.removeToCart(item)
				}
			}, {
				text: 'Cancelar',
				icon: 'close',
				role: 'cancel'
			}]
		});

		await actionSheet.present();

	}

	async emptyAlert() {

		const alert = await this.alertCtrl.create({
			cssClass: 'alerts-css-custom',
			header: '¡Confirmar!',
			message: '¿Esta seguro que desea limpiar el carrito de compras?',
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					cssClass: 'primary',
					handler: () => { }
				}, {
					text: 'Vaciar',
					handler: () => {
						this.emptyCart();
						this.router.navigate(['/app/farmacia']);
					}
				}
			]
		});

		await alert.present();

	}

	emptyCart() {
		localStorage.removeItem('myCarrito');
		this.myCarrito = [];
		this.shiping = 0;
		this.itemsTotal = 0;
		this.itemsQty = 0;
		this.ordTotal = 0;
		this.isEmptyCart = true;
		this.alertsservice.nativeToast(`Su carrito de compras esta vacio`)
	}


	validarCupon() {

		if (!this.cuponCode) { return }

		this.orderservice.cuponValidation(this.userservice.usuario._id,
			this.cuponCode).subscribe(
				(couponResp: any) => {

					if (couponResp.status) {

						this.alertsservice.nativeToast('El cupón es valido')
						console.log('El cupón es valido')
						// this.orderservice.newConsultData.coupon = this.cuponCode;
						this.cuponValidationClass = 'codeIsValid';
					} else {
						this.alertsservice.nativeToast('El cupón ya no es valido')
						console.log('El cupón ya no es valido')
						// this.orderservice.newConsultData.coupon = null;
						this.cuponValidationClass = 'codeIsInvalid';
					}

				}, (err) => {

					if (!err.error.status) {
						this.cuponValidationClass = 'codeIsInvalid';
						console.log(err.error.message)
						this.alertsservice.nativeToast(err.error.message)
						// this.orderservice.newConsultData.coupon = null;
					}
					if (err.status === 0) {
						this.alertsservice.showAlert('Error al conectarse con el servidor', 'Server Error')
					}
				}
			)
	}





}
