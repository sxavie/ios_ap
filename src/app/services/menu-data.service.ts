import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

// interface
import { Menu } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class MenuDataService {

  constructor( public http: HttpClient ) { }

  getMenuOpts() {
    return this.http.get<Menu[]>('/assets/data/menu.json');
  }
  
}
