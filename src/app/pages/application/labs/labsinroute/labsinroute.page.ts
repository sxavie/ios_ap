import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LaboratoryResp } from 'src/app/models/LaboratoryResp.model';
import { LabsService } from 'src/app/services/labs.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-labsinroute',
  templateUrl: './labsinroute.page.html',
  styleUrls: ['./labsinroute.page.scss'],
})
export class LabsinroutePage implements OnInit {

  public labResponse:LaboratoryResp;

  constructor( private labservices: LabsService,
    private router: Router ) { }

  ngOnInit() { 
    this.labResponse = this.labservices.labResponse;
  } 

  chating(){

    this.router.navigate(['/app/labs/labschat'])
  }

}
