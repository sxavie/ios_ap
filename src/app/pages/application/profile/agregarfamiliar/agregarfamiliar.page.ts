import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alerts.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-agregarfamiliar',
  templateUrl: './agregarfamiliar.page.html',
  styleUrls: ['./agregarfamiliar.page.scss'],
})
export class AgregarfamiliarPage implements OnInit {

  public FormFamiliar = this.fb.group({
    name: ['', Validators.required],
    relationship: ['', Validators.required],
    source: '3'
  })

  constructor( private fb: FormBuilder,
    private modalCtrl: ModalController,
    private userservice: UserService,
    private alertservice: AlertsService ) { }

  ngOnInit() {
  }
 
  addFamiliar(){  

    if ( this.FormFamiliar.valid ){ 
      this.userservice.addMember( this.FormFamiliar.value ).subscribe( resp =>{
        this.close();
      })
    }else { this.alertservice.nativeToast(' Seleccione los datos del familiar ') }
  }

  close(){
    
      this.modalCtrl.dismiss({
        'dismissed': true
      });

  }
  

}
