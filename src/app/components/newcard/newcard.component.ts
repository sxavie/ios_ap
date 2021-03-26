import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alerts.service';
import { PayMethodsService } from 'src/app/services/paymethods.service';
import { ValidatorsService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-newcard',
  templateUrl: './newcard.component.html',
  styleUrls: ['./newcard.component.scss'],
})
export class NewcardComponent implements OnInit {

  public paymentMethodFrm: FormGroup;
  public cardControlErrors;
  public dateControlErrors;
  public codeControlErrors;

  constructor(private fb: FormBuilder,
    private payservice: PayMethodsService,
    private alertsservice: AlertsService,
    private loadingCtrl: LoadingController,
    private validations: ValidatorsService,
    private modalCtrl: ModalController) { }

  ngOnInit() {

    this.paymentMethodFrm = this.createPaymentMethodForm();

  }

  //  PaymentMethod Form Functions
  createPaymentMethodForm(): FormGroup {

    return this.fb.group({
      cardNumber: ['', this.validations.cardNumberValidator],
      expiresDate: ['', [this.validations.expiresDateValidator, Validators.maxLength(5)]],
      securityCode: ['', [this.validations.securityCodeValidator, Validators.maxLength(3)]]
    });
  };

  numberGropuSeparator(): void {

    let stringNumber = this.paymentMethodFrm.controls['cardNumber'].value;
    if (!stringNumber) return

    const separator = '-'
    const result = stringNumber.match(/\d{4}(?=\d{2,3})|\d+/g).join(separator);

    this.paymentMethodFrm.patchValue({
      cardNumber: result
    });

  };

  expiresDateSeparator(): void {

    let stringDate = this.paymentMethodFrm.controls['expiresDate'].value;
    if (!stringDate) return

    const separator = '/'
    const result = stringDate.match(/\d{2}(?=\d{2,3})|\d+/g).join(separator);

    this.paymentMethodFrm.patchValue({
      expiresDate: result
    });

  };

  securityCodeViewValidator(): void {

    let securityCode = this.paymentMethodFrm.controls['securityCode'].value;

    if (securityCode.length > 3) {
      let x = securityCode.substring(0, 3)

      this.paymentMethodFrm.patchValue({
        securityCode: x
      });
    }

  };

  getPaymentMethodControlsErrors(): void {

    this.cardControlErrors = !this.paymentMethodFrm.controls['cardNumber'].errors
      ? null : this.paymentMethodFrm.controls['cardNumber'].errors

    this.dateControlErrors = !this.paymentMethodFrm.controls['expiresDate'].errors
      ? null : this.paymentMethodFrm.controls['expiresDate'].errors

    this.codeControlErrors = !this.paymentMethodFrm.controls['securityCode'].errors
      ? null : this.paymentMethodFrm.controls['securityCode'].errors

  };

  processRequest() {

    this.getPaymentMethodControlsErrors()

    if (this.paymentMethodFrm.valid) {

      const number = this.paymentMethodFrm.controls['cardNumber'].value.replace(/-/g, '');
      const cvv = this.paymentMethodFrm.controls['securityCode'].value;


      const expiresDate = this.paymentMethodFrm.controls['expiresDate'].value.split('/');
      const month = expiresDate[0];
      const year = expiresDate[1];

      const user = localStorage.getItem('user-id')

      const dataForm: FormGroup = this.fb.group({ number, month, year, cvv, user });

      this.addPaymentMethod(dataForm.value)

      return;

    }

  }

  async addPaymentMethod(cardData) {

    let loading = await this.loadingCtrl.create({
      spinner: 'lines-small',
      message: 'Espere un momento'
    });

    await loading.present()

    let responseMessage: any;

    console.log( 'cardta: ',cardData )

    await this.payservice.addPayMethod(cardData).subscribe(
      (resp: any) => {
        
        
        responseMessage = resp.message
        this.alertsservice.showToast(responseMessage, 2500, 'success', 'top');
        this.paymentMethodFrm.setValue({ cardNumber: '', expiresDate: '', securityCode: '' });
        

        this.modalCtrl.dismiss({
          'newCard':true
        })

      },
      (err: any) => {

        const code = err.error.error.code;

        switch (code) {
          case 'card_declined':
            this.alertsservice.showToast('Tarjeta rechazada', 2500, 'danger', 'top');
            break;
          default:
            responseMessage = err.error.message
            this.alertsservice.showToast(responseMessage, 2500, 'danger', 'top');
            break
        }
      }
      , () => {
          loading.dismiss();
        });

  }


  closeModal(){

    this.modalCtrl.dismiss({'newCard':true})

  }

}
