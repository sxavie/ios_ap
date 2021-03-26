import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-outletapp',
  templateUrl: './outletapp.page.html',
  styleUrls: ['./outletapp.page.scss'],
})
export class OutletappPage implements OnInit {


  constructor( private userservice: UserService ) { }

  ngOnInit() {
  
  }

}
