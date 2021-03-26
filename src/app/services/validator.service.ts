import { Injectable } from '@angular/core';

import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }

   // Register new card validations
  cardNumberValidator(Control: FormControl) {

    if (!Control.value) {
      return { invalidCard: true, errorMessage: 'El número es requerido' }
    };

    let cardNumber = Control.value.replace(/-/g, '');

    const regex = new RegExp(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/);
    const valid = regex.test(cardNumber);
    return valid ? null : { invalidCard: true, errorMessage: 'Tarjeta no válida' }

  };

  expiresDateValidator(Control: FormControl) {

    if (!Control.value) {
      return { invalidDate: true, errorMessage: 'La fecha es requerida' }
    };

    const regex = new RegExp(/^((0[1-9])|(1[0-2]))[/]((2[1-9])|(3[0-5]))$/);
    const valid = regex.test(Control.value);
    return valid ? null : { invalidDate: true, errorMessage: 'La fecha no es válida' }

  };

  securityCodeValidator(Control: FormControl){

    if(!Control.value){
      return { invalidCode: true, errorMessage: 'El código es requerido' }
    };

    const regex = new RegExp(/^(([0-9]{1})[1-9]{2})$/);
    const valid = regex.test(Control.value);
    return valid ? null : { invalidCode: true, errorMessage: 'El código no es válido' }
  }
}
