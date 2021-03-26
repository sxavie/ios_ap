import { Component, OnDestroy, OnInit, ɵConsole } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { MedicineService } from 'src/app/services/medicine.service';

import { ItemCart } from 'src/app/interfaces/interfaces'
import { AlertsService } from 'src/app/services/alerts.service';
import { ViewDidEnter } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, ViewDidEnter, OnDestroy {

  public loader;

  public cesta: string = "";
  public productItems:Product[];
  public myCarrito:ItemCart[] = [];

  // fakeItems
  public fakeItems:any[] = [
    {_id: '312', sku:'1s9uj1d', name:'Fosofosda', price:150.00, stock: 23, description: 'Antidiarreico Via Oral',fileName: 'https://resources.claroshop.com/medios-plazavip/s2/12225/1474378/5ef6423a8a9bb-1140603-1600x1600.jpg', provider:'Farmacias plus'}
   ,{_id: '142', sku:'xhqiush', name:'Ranitidina', price:92.00, stock: 53, description: '456 capsulas',fileName: 'https://www.chistestuiteros.com/wp-content/uploads/2018/12/IMG-20180421-WA0019.jpg', provider:'Farmacias plus'}
   ,{_id: '938', sku:'1s1wnod', name:'Raspeldal', price:220.00, stock: 73, description: 'Antidiarreico Via',fileName: 'https://s1.eestatic.com/2018/12/30/ciencia/salud/Salud_364725967_111264667_1706x960.jpg', provider:'Farmacias plus'}
   ,{_id: '000', sku:'1s1akhd', name:'Ibuporfeno', price:50.00, stock: 13, description: '800mg capsulas',fileName: 'https://www.moncloa.com/wp-content/uploads/2020/07/ibuprofeno.jpg', provider:'Farmacias plus'}
 ]

  constructor( private medicineservice: MedicineService,
    private alertsservice: AlertsService,
    private router: Router
    ) { }

  ngOnDestroy() {

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
  ngOnInit() {

    localStorage.removeItem('orderDetail')

    this.getMedicine();
  }
  getMedicine(){
    this.medicineservice.getMedicine().subscribe( (resp:any) => {
      this.productItems = resp.data;
      console.log( resp )
    });
  }
  addToCart( item:Product ){

    this.cesta = "lleno";

    let addItem:ItemCart = {
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      fileName: item.fileName,
      quantity: 1 // handle quantity
    }

    let idx = this.findItemIdx(addItem);

    if(idx > -1){
      this.myCarrito[idx].quantity ++;
      this.alertsservice.nativeToast(`${this.myCarrito[idx].quantity} ${this.myCarrito[idx].name} en carrito`)
    }else{
      this.alertsservice.nativeToast(`Se agrego ${addItem.name} al carrito`)
      this.myCarrito.push(addItem);
    }

    localStorage.setItem('myCarrito', JSON.stringify(this.myCarrito));

  }
  findItemIdx(iFind){
    let index = this.myCarrito.findIndex(function(itm) {
      if(iFind._id === itm._id)
        return true
    });
    return index
  }
  
  search( termino ){

    if( termino === ''){
      this.getMedicine();
    }else{
      let filteredItms = this.productItems.filter( (itm) => { 
        if(itm.name.toUpperCase().includes(termino.toUpperCase())){
          return itm
        }
      });
  
      this.productItems = filteredItms;
  
    }
  }

  viewItemDetail( item:Product ){

    this.router.navigate([`/app/farmacia/product-detail/${item.name}`])

  }







  // Chevron Icons Up/Down
  add_quantity( ){
  }
  remove_quantity(){

  }

 
    

}
