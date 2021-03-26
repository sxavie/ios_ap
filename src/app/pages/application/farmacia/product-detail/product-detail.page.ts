import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';
import { ItemCart } from 'src/app/interfaces/interfaces';
import { Product } from 'src/app/models/product.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { MedicineService } from 'src/app/services/medicine.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit, ViewDidEnter {

  public medicamento:any = '';
  
  public myCarrito = [];
  public cesta = ''

  public quantity:any = '1'

  constructor( private activatedroute: ActivatedRoute,
    private medicineservice: MedicineService,
    private alertsservice: AlertsService,
    private router: Router) { }

  async ngOnInit() {

    let parametros;
    await this.activatedroute.params.subscribe( params => {
      parametros = params
    });
    this.getItem(parametros.name)
  }

  getItem( name ){
    this.medicineservice.getItemName(name).subscribe( (producto:any) => {
      this.medicamento = producto.data[0]
    })
  }

  ionViewDidEnter() {

    if(localStorage.getItem('myCarrito')) {
      this.myCarrito = JSON.parse(localStorage.getItem('myCarrito'));
      this.cesta = "lleno";
    }else{
      this.myCarrito = [];
      this.cesta = "";
    }
 
  }

  addToCart( buySoruce:boolean ){

    this.cesta = "lleno";

    let addItem:ItemCart = {
      _id: this.medicamento._id,
      name: this.medicamento.name,
      description: this.medicamento.description,
      price: this.medicamento.price,
      fileName: this.medicamento.fileName,
      quantity: Number(this.quantity) // handle quantity
    }

    let idx = this.findItemIdx(addItem);

    if(idx > -1){



      this.myCarrito[idx].quantity = (this.myCarrito[idx].quantity + addItem.quantity)
      this.alertsservice.nativeToast(`${this.myCarrito[idx].quantity} ${this.myCarrito[idx].name}(s) en carrito`)
    }else{
      this.alertsservice.nativeToast(`Se agrego ${addItem.quantity } ${addItem.name}(s) al carrito`)
      this.myCarrito.push(addItem);
    }

    this.quantity = '0';
    localStorage.setItem('myCarrito', JSON.stringify(this.myCarrito));

    if(buySoruce) this.router.navigate(['/app/farmacia/cart-checkout'])

  }
  findItemIdx(iFind){
    let index = this.myCarrito.findIndex(function(itm) {
      if(iFind._id === itm._id)
        return true
    });
    return index
  }

}
