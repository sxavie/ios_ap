import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor( private router: Router ) {

  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

    const token = localStorage.getItem('jwttoken');

    if (token){
      // redirecciona a Home ya hay auth token
      this.router.navigate(['/app'])
      return false
    }
      // retorna true al canActivate si el usuario ya le authenitco en la App
    return true;
  }
  
}
