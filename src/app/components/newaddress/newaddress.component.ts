import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address.service';
import { AlertsService } from 'src/app/services/alerts.service';
@Component({
  selector: 'app-newaddress',
  templateUrl: './newaddress.component.html',
  styleUrls: ['./newaddress.component.scss'],
})
export class NewaddressComponent implements OnInit {

  public autocomplete;
  public formAddressData = this.fb.group({
    name: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    neighborhood: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    country: "Mexico",
    zipcode: ['', Validators.required],
    references: '',
    latitude: '',
    longitude: '',
    clientId: ''
  });

  constructor(private fb: FormBuilder,
    private addressservice: AddressService,
    private loadingCtrl: LoadingController,
    private alertsservice: AlertsService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.googleAutocompletefield();
  }


  googleAutocompletefield() {

    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(25.705171, -100.335615),
      new google.maps.LatLng(25.704157, -100.342403)
    )

    var input: any = document.getElementById('autoCompleteField');
    var options = {
      bounds: defaultBounds,
      types: ['geocode']
    };

    this.autocomplete = new google.maps.places.Autocomplete(input, options);

    this.autocomplete.addListener('place_changed', resp => {
      this.getPlace();
    })

  }

  getPlace() {
    this.formAddressData.patchValue({ street: '' });
    this.formAddressData.patchValue({ number: '' });
    this.formAddressData.patchValue({ neighborhood: '' });
    this.formAddressData.patchValue({ state: '' });
    this.formAddressData.patchValue({ city: '' });
    this.formAddressData.patchValue({ country: '' });
    this.formAddressData.patchValue({ zipcode: '' });
    this.formAddressData.patchValue({ latitude: '' });
    this.formAddressData.patchValue({ longitude: '' });

    let place = this.autocomplete.getPlace()

    this.formAddressData.patchValue({ latitude: place.geometry.location.lat() })
    this.formAddressData.patchValue({ longitude: place.geometry.location.lng() })

    place.address_components.forEach(x => {

      switch (x.types[0]) {
        case 'street_number': {
          this.formAddressData.patchValue({ number: x.long_name });
          break;
        }
        case 'route': {
          this.formAddressData.patchValue({ street: x.long_name });
          break;
        }
        case 'sublocality_level_1': {
          this.formAddressData.patchValue({ neighborhood: x.long_name });
          break;
        }
        case 'locality': {
          this.formAddressData.patchValue({ city: x.long_name });
          break;
        }
        case 'administrative_area_level_1': {
          this.formAddressData.patchValue({ state: x.long_name });
          break;
        }
        case 'country': {
          this.formAddressData.patchValue({ country: x.long_name });
          break;
        }
        case 'postal_code': {
          this.formAddressData.patchValue({ zipcode: x.long_name });
          break;
        }
      }
    })

  }

  async onAddAddress() {

    let id = localStorage.getItem('user-id')
    this.formAddressData.patchValue({ clientId: id });

    let formHandler = await this.fieldsValidation()

    if (formHandler != 'OK') {
      this.alertsservice.nativeToast(formHandler)
      return
    }

    this.addressservice.addAddress(this.formAddressData.value)
      .subscribe((newAddress: any) => {

        this.formAddressData.patchValue({ name: '' })
        this.formAddressData.patchValue({ street: '' })
        this.formAddressData.patchValue({ number: '' })
        this.formAddressData.patchValue({ neighborhood: '' })
        this.formAddressData.patchValue({ state: '' })
        this.formAddressData.patchValue({ city: '' })
        this.formAddressData.patchValue({ country: '' })
        this.formAddressData.patchValue({ zipcode: '' })
        this.formAddressData.patchValue({ references: '' })
        this.formAddressData.patchValue({ latitude: '' })
        this.formAddressData.patchValue({ longitude: '' })
        this.formAddressData.patchValue({ clientId: '' })

        var input: any = document.getElementById('autoCompleteField');
        input.value = '';

        // cerra modal afirmando que se alamceno nueva data de direcciones
        this.modalCtrl.dismiss({ newdata: true });

      }, (err) => {

        // this.loader.dismiss();

      })
  }


  fieldsValidation() {

    if (!this.formAddressData.get('name').value) { return 'Introduzca un nombre para esta dirección' }
    if (!this.formAddressData.get('street').value) { return 'Seleccione la calle de su domicilio' }
    if (!this.formAddressData.get('zipcode').value) { return ' Introduzca el codigo postal para esta dirección' }
    if (!this.formAddressData.get('state').value) { return ' Introduzca el estado para esta dirección' }
    if (!this.formAddressData.get('city').value) { return ' Introduzca la ciudad de esta dirección' }
    if (!this.formAddressData.get('neighborhood').value) { return ' Introduzca el colonia para esta dirección' }
    if (!this.formAddressData.get('number').value) { return 'Introduzca el numero interior de su domicilio' }

    return 'OK'

  }

}
