import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UserService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-historialmedico',
  templateUrl: './historialmedico.page.html',
  styleUrls: ['./historialmedico.page.scss'],
})
export class HistorialmedicoPage implements OnInit {

  public userData: Usuario;

  public diseasesFormData = this.fb.group({
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    epilepsy: false,
    prevSurgeries: false,
    others: 'false'
})
  
  constructor( private router: Router,
    private userservice: UserService,
    private fb: FormBuilder) {     }
  
  ngOnInit() {
    this.userservice.getUserData().then( (resp:any) => {
      this.userData = resp;
        this.diseasesFormData = this.fb.group({
          diabetes: (resp.diseases.diabetes) ? resp.diseases.diabetes : false,
          hypertension: (resp.diseases.hypertension) ? resp.diseases.hypertension : false,
          heartDisease: (resp.diseases.heartDisease) ? resp.diseases.heartDisease : false,
          epilepsy: (resp.diseases.epilepsy) ? resp.diseases.epilepsy: false,
          prevSurgeries: (resp.diseases.prevSurgeries) ? resp.diseases.prevSurgeries: false,
          others: (resp.diseases.others) ? resp.diseases.others : 'true'
      })
    })   
  }

  hMedicalSave(){
    setTimeout(() => {
      this.userservice.updateUserDataDiseases( this.userservice.usuario._id, this.diseasesFormData.value ).subscribe();
    }, 200);
  }

  goHome(){
    this.router.navigate(['/app/home'])
  }

} 
