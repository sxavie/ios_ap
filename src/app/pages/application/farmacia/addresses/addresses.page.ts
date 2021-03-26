import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ViewWillEnter } from '@ionic/angular';
import { AddressService } from 'src/app/services/address.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit, ViewWillEnter {

  public myAddresses:any[] = [];
  public selectedIDAddress;

  public loading;

  constructor( private addressservice: AddressService,
    private router: Router,
    private alertsservice: AlertsService,
    private loadingCtrl: LoadingController,
    public userservice: UserService ) { }

  ionViewWillEnter() {

    this.selectedIDAddress = this.userservice.defaultAddressID;

    this.addressservice.getAddress().subscribe( (addresses:any) => {
      this.myAddresses = addresses;
    })
  }

  ngOnInit() {
  }

  changeAddress(){
    this.userservice.defaultAddressID = this.selectedIDAddress
  }

  addAddress(){
    localStorage.setItem('addaddss', '/app/farmacia/addresses');
    this.router.navigate(['/app/farmacia/addresses/add'])
  }

  deleteAddress( address ){
    
    this.loadingPresent();

      this.addressservice.removeAddress( address ).subscribe( () => {

        let index = this.myAddresses.indexOf(address);
        this.myAddresses.splice(index, 1);

        this.loading.dismiss();
        this.alertsservice.nativeToast(` Se ha eliminado la dirección ${ address.name }`)

      })

  }

  dragingRemove(v, address){ 
    let ratio = v.detail.ratio;
    if( ratio > 3.5 ) { this.deleteAddress(address) }
  }

  async loadingPresent(){

    this.loading = await this.loadingCtrl.create({
      spinner: 'lines-small',
      message: 'Espere un momento'
    })

    await this.loading.present();

  }

}
