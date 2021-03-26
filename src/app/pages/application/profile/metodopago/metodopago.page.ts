import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, MenuController, ViewWillEnter } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alerts.service';
import { PayMethodsService } from 'src/app/services/paymethods.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-metodopago',
  templateUrl: './metodopago.page.html',
  styleUrls: ['./metodopago.page.scss'],
})
export class MetodopagoPage implements OnInit, ViewWillEnter { 

  public imgAvatar:string;
  // public cards: any[] = [];
  public cards: any;
  public loading;

  constructor(private menuCtrl: MenuController,
    private router: Router,
    private payservice: PayMethodsService,
    private loaderCtrl: LoadingController,
    private actionsheetCtrl: ActionSheetController,
    private userservice: UserService,
    private alertsservice: AlertsService) { }

  ionViewWillEnter(): void {
     
    this.getPayCards();

  }

  ngOnInit() { 

    this.imgAvatar =  this.userservice.transformFilename(this.userservice.usuario.filename)
  }

  async getPayCards(){

    this.loading = await this.loaderCtrl.create({
      spinner: 'lines-small'
    })

    await this.loading.present();

    this.payservice.getPayMethods().toPromise().then( (data:any) => {
      this.cards = data.cards;
      this.loading.dismiss();
    })

  }

  async changeMethod( idCard ){

    let loader = await this.loaderCtrl.create({
      spinner: 'lines-small'
    })

    loader.present();
    
    this.payservice.setPayMethod( idCard ).subscribe( resp => {
      this.getPayCards()
      loader.dismiss();
    })

  }

  deleteMethod( idCard ){

    this.payservice.deletePayMethod( this.userservice.usuario._id, idCard )
      .subscribe( (card:any) => {
        this.getPayCards();
        this.alertsservice.nativeToast( card.message )
      })
  }

  async presentActionSheet( card ) {
    const actionSheet = await this.actionsheetCtrl.create({
      
      buttons: [{
        text: 'Seleccionar',
        icon: 'card-outline',
        handler: () => {
          this.changeMethod( card.cardID );
        }
      },{
        text: 'Eliminar',
        icon: 'trash-outline',
        role: 'delete',
        handler: () => {
          this.deleteMethod( card.cardID );
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }]
    });

    await actionSheet.present();

  }

  goHome(){
    this.router.navigate(['/app/home'])
  }



}
