import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController, ModalController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { NewcardComponent } from 'src/app/components/newcard/newcard.component';
import { AlertsService } from 'src/app/services/alerts.service';
import { LabsService } from 'src/app/services/labs.service';
import { PayMethodsService } from 'src/app/services/paymethods.service';
import { UserService } from 'src/app/services/userservice.service';


@Component({
  selector: 'app-labpaymethod',
  templateUrl: './labpaymethod.page.html',
  styleUrls: ['./labpaymethod.page.scss'],
})
export class LabpaymethodPage implements OnInit {

  // public cards: any[] = [];
  public cards: any;
  public idCard;

  constructor(private menuCtrl: MenuController,
    private router: Router,
    private payservice: PayMethodsService,
    private loaderCtrl: LoadingController,
    private labsservices: LabsService,
    private alertsservice: AlertsService,
    private userservice: UserService,
    private modalCtrl: ModalController) { }

  ngOnInit() {

    this.getPayCards();
  }

  async getPayCards() {

    let loading = await this.loaderCtrl.create({
      spinner: 'lines-small',
      message: 'Obteniendo información'
    });

    loading.present()

    const data = this.labsservices.serviceFlowJSONData

    this.payservice.getPayMethods_remx(data).toPromise()
      .then((cardsResponse: any) => {
        
        if (cardsResponse.codigo) {
          this.labsservices.serviceFlowJSONData.data.cita = cardsResponse.cita
          this.cards = cardsResponse.data
        }
        else
          this.alertsservice.showToast(cardsResponse.message, 2000, 'danger', 'top')
      })
      .catch(err => throwError(err))
      .finally(() => loading.dismiss())

  }

  // aux functions
  async changeMethod(card, htmlRef) {

    let slots = document.getElementsByClassName('slotCard')

    for (let i = 0; i < slots.length; i++)
      slots[i].classList.remove('default')

    htmlRef.classList.add('default')
    this.idCard = card.id
    this.labsservices.temp_paymenthod_service = card;

  };

  goHome() {
    this.router.navigate(['/app/home'])
  }

  async showNewCardModal() {

    const cardModal = await this.modalCtrl.create({
      cssClass: 'addCard-modal',
      component: NewcardComponent
    })

    cardModal.present();

    const { data } = await cardModal.onDidDismiss();
    if (data.newCard)
      this.getPayCards()

  }

  async next() {
    this.labsservices.serviceFlowJSONData.data.paymentCardID = this.idCard;
    this.router.navigate(['/app/labs/labaddresses']);
  }



}
