import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ViewWillEnter } from '@ionic/angular';
import { ItemCart } from 'src/app/interfaces/interfaces';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressService } from 'src/app/services/address.service';
import { PayMethodsService } from 'src/app/services/paymethods.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { ChangepaymentComponent } from 'src/app/components/changepayment/changepayment.component';
import { AlertsService } from 'src/app/services/alerts.service';
import { UserService } from 'src/app/services/userservice.service';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({ 
  selector: 'app-cart-checkout',
  templateUrl: './cart-checkout.page.html',
  styleUrls: ['./cart-checkout.page.scss'],
})
export class CartCheckoutPage implements OnInit, ViewWillEnter {

  public myCarrito:ItemCart[] = JSON.parse(localStorage.getItem('myCarrito'));
  public myAddresses:any[] = [];
  public defMethod;

  public shiping = 65;
  public itemsTotal = 0;
  public itemsQty = 0;
  public ordTotal = 0;

  public defaulAddresid;
  public defaulAddres;

  constructor( private loadCtrl: LoadingController,
    private addressservice: AddressService,
    private router: Router,
    private medicineservice: MedicineService,
    private modalCtrl: ModalController,
    private alertsservie: AlertsService,
    public userservice: UserService) { 
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {


    this.defaulAddresid = this.userservice.defaultAddressID;

    let loader = await this.loadCtrl.create({
      spinner: 'lines-small'
    })
    await loader.present();
    this.myCarrito = JSON.parse(localStorage.getItem('myCarrito'))
    this.totalCalculator()

    await this.addressservice.getAddress().subscribe((addresses: any) => {

      addresses.forEach(element => {
        if (element._id === this.defaulAddresid) {
          this.defaulAddres = element;
        }

        if( this.defaulAddres === undefined ){
          this.defaulAddres = addresses[0]; 
        }

      });
      
    });
    
    loader.dismiss();
  }

  async changeMethod(){

    const modal = await this.modalCtrl.create({
      component: ChangepaymentComponent,
      cssClass: 'changePay-modal',
      backdropDismiss: false
    });
    modal.onWillDismiss().then(() => {
 
    });
    return await modal.present();

  }

  totalCalculator(){
    
    let itemsPrice$:Observable<any> = from(this.myCarrito);
      itemsPrice$.pipe(map((item:any) => {
        let itemTotal;
        itemTotal = ( item.price * item.quantity )

        this.itemsTotal = this.itemsTotal + itemTotal;
        this.itemsQty = this.itemsQty + item.quantity
      })).subscribe( () => {
        this.ordTotal = this.itemsTotal + this.shiping
      })

  

  }

  buttonCheckout(){

    interface OrderItems{
      medicine: string,
      quantity: string,
    }

    interface PharmOrder{
      user: string,
      items: OrderItems[],
      addressId: string,
      paymentMethod: string,
      // coupon?: string,
    }

    if(!this.defaulAddres){
      this.alertsservie.nativeToast('No se selecciono una dirección de domicilio')
      return; 
    }

    var carrito = JSON.parse(localStorage.getItem('myCarrito'));
    let orditems: OrderItems[] = [];
    
    carrito.forEach((element:ItemCart) => {

      let pushing:OrderItems = { medicine: '', quantity: ''}
      pushing.medicine = element._id;
      pushing.quantity = element.quantity.toString();
      orditems.push(pushing)

    }); 

    let defaultPayid = ( this.userservice.defaultMethod.cardID === 'cash' ) ? '2' : '1';

    var newOrden:PharmOrder = ({
      user: this.userservice.usuario._id,
      items: orditems,
      addressId: this.defaulAddresid,
      paymentMethod: defaultPayid,
      // coupon: ''
    })

    console.log( 'new order ',newOrden )

    this.medicineservice.newOrder(newOrden).subscribe( () => {
      
      this.shiping = 65;
      this.itemsTotal = 0;
      this.itemsQty = 0;
      this.ordTotal = 0;
    } ,(err) => { console.log( err )},
    () => {
      this.router.navigate(['app/farmacia/pharmsummary'])
    })

  }


 



}
