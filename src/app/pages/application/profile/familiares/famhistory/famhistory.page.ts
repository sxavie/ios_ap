import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { UserService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-famhistory',
  templateUrl: './famhistory.page.html',
  styleUrls: ['./famhistory.page.scss'],
})
export class FamhistoryPage implements OnInit {


  public diseasesFormData = this.fb.group({
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    epilepsy: false,
    prevSurgeries: false,
    others: 'false'
})

  constructor( public userservice: UserService,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController ) {  }

  ngOnInit() {

    this.userservice.getMemberData( this.userservice.userView._id ).subscribe( (member:any) =>{
        this.diseasesFormData = this.fb.group({
          diabetes: (member.diseases.diabetes)? member.diseases.diabetes : false,
          hypertension: (member.diseases.hypertension)?  member.diseases.hypertension : false,
          heartDisease: (member.diseases.heartDisease)? member.diseases.heartDisease : false,
          epilepsy: (member.diseases.epilepsy)? member.diseases.epilepsy : false,
          prevSurgeries: (member.diseases.prevSurgeries)? member.diseases.prevSurgeries : false,
          others: (member.diseases.others)? member.diseases.others : false
        })
    })
  }

 async hMedicalSave(){

   let loading = await this.loadingCtrl.create({
     spinner: 'lines-small',
     message: 'Actualizando'
   }) 

   await loading.present()

    setTimeout(() => { 
      this.userservice.updateUserDataDiseases( this.userservice.userView._id, this.diseasesFormData.value ).subscribe( () => {

        loading.dismiss();

      });
    }, 500);

  }


}
