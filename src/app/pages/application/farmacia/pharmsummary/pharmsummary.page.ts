import { Component, OnInit } from '@angular/core';
import { ItemPharm } from 'src/app/interfaces/interfaces';
import { PharmResponse } from 'src/app/models/PharmResponse.model';
import { MedicineService } from 'src/app/services/medicine.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-pharmsummary',
  templateUrl: './pharmsummary.page.html',
  styleUrls: ['./pharmsummary.page.scss'],
})
export class PharmsummaryPage implements OnInit {

  constructor( private userservice: UserService,
    private medicineservice: MedicineService ) { }

  pharmResponse:PharmResponse = this.medicineservice.pharmResponse;


  ngOnInit() { }

}
