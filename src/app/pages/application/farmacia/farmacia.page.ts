import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, PickerController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-farmacia',
  templateUrl: './farmacia.page.html',
  styleUrls: ['./farmacia.page.scss'],
})
export class FarmaciaPage implements OnInit {

  public loading;
  public showSkeleton:boolean = true;
  public avaliableData;

  public addresess:any = [];
  public addresValidation;
  public noAddresses = false;

  constructor( private loadingCtrl: LoadingController,
    private medicineservice: MedicineService,
    private addressservice: AddressService,
    private router: Router,
    private pickerCtrl: PickerController,
    private userservice: UserService,) { }

  async ngOnInit() {
    
    // Servicio de farmacia OFF
    // this.addresess =  await this.addressservice.getAddress().toPromise()
    // this.getColumns(this.addresess)
    // if( this.addresess.length === 0) {
    //   this.noAddresses = true;
    //   this.showSkeleton = false;
    //   return;
    // }
    // this.addresValidation = this.addresess[0];
    // if( this.userservice.defaultAddressID ){
    //   this.addresess.forEach(x => {
    //     if(x._id === this.userservice.defaultAddressID){
    //       this.addresValidation = x;
    //     }
    //   });
    // }
    // await this.avaliableService(this.addresValidation);
    // Servicio de farmacia OFF
  
  }

  async avaliableService( address ){

    this.avaliableData = await  this.medicineservice.frmAvaliable( 
      address.latitude,
      address.longitude
    ).toPromise();

    if(this.avaliableData.service) {
      this.userservice.defaultAddressID = address._id;
      this.router.navigate(['/app/farmacia/products'])
    }

    this.showSkeleton = false;

  }

  addAddress(){
    localStorage.setItem('addaddss', '/app/farmacia');
    this.router.navigate(['/app/farmacia/addaddress'])
  }

  async addressPicker(){
    const genPicker = await this.pickerCtrl.create({
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text:'Ok',
          handler:(v:any) => {


            if(v.address.value === '0'){ this.addAddress() } else{

              this.showSkeleton = true;
            this.addresess.forEach(addr => {
              if(addr._id === v.address.value){

                this.addresValidation = addr
                this.avaliableService(addr)
              }
            });
            }
          }
        }
      ],
      columns:[{
        name:'address',
        options: this.getColumns(this.addresess)
    }]

    });
    await genPicker.present();
  }

 getColumns(columnOptions) {
    let columns = [];
    for (let i = 0; i < columnOptions.length; i++) {
      columns.push({
        text: columnOptions[i].name,
        value: columnOptions[i]._id
      });
    }
    columns.push({text: 'Nueva', value: '0'})
    return columns;
  }

  async loadingPresent(){

    this.loading = await this.loadingCtrl.create({
      spinner: 'lines-small',
      message: 'Validando disponibilidad'
    });

    await this.loading.present();
    

  }

}
