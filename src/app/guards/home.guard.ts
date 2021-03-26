import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  
  constructor( private router: Router ) {

  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

    const token = localStorage.getItem('jwttoken');
    if (!token){
      // redirecciona a Login si no se ha authenticado
      this.router.navigate(['/login'])
      return false
    }
      // retorna true al canActivate si el usuario ya le authenitco en la App
    return true;
  }
  
}
