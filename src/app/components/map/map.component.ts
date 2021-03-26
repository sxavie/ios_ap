import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Capacitor, Plugins, GeolocationPosition } from '@capacitor/core';
import { Observable, of, from as fromPromise } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

import { ViewDidLeave, ViewWillLeave } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy, ViewDidLeave, ViewWillLeave {

  public coordinates$: Observable<GeolocationPosition>;

  @Input() coords: { latitude: number, longitude: number }

  @Input() latitud:number;
  @Input() logitud:number;


  public lati:number = 0;
  public longi:number = 0;

  constructor( 
    private geo: Geolocation 
    ) { }
  ionViewWillLeave() {
    console.log(  'ionViewWillLeave')
  }

  ionViewDidLeave() {
    console.log(  'ionViewDidLeave')
  }

  ngOnDestroy() {
    console.log(  'onDestroy')
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap(){

    let POSITION;

    if (!this.coords){
      POSITION = { lat: this.coords.latitude, lng: this.coords.longitude }
      console.log( 'Si hay posiciones ' )
    }else {
      POSITION = new google.maps.LatLng( this.lati, this.longi );
      console.log( 'watching positions ' )
    }
    
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: POSITION || { lat: 22, lng: 22},
      disableDefaultUI: false,
      // styles: COLORSMAPS,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false
    });

    // const locationButton = document.createElement("button");
    // locationButton.textContent = "Pan to Current Location";
    // locationButton.classList.add("custom-map-control-button");

    // map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton)

    // locationButton.addEventListener("click", () => {
    //   // Try HTML5 geolocation.
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(
    //       (position: Position) => {
    //         const pos = {
    //           lat: position.coords.latitude,
    //           lng: position.coords.longitude,
    //         };
  
          
    //         map.setCenter(pos);
    //       },
    //       () => {
    //         console.log( 'error' )
    //       }
    //     );
    //   } else {
    //     // Browser doesn't support Geolocation
    //     console.log( 'dons supoorted' )
    //   }
    // });

    const marker = new google.maps.Marker({
      position: POSITION,
      map: map,
      draggable: true       
    })

    google.maps.event.addListener( marker, 'dragend', ( event )=> {
      console.log( event )
    })

  }

  ngOnInit(){


    // let watcher = this.geo.watchPosition()
    // watcher.subscribe( (position:any) => {
    //   console.log( position, ' en el oninit' )
    //   this.lati = position.coords.latitude
    //   this.longi = position.coords.longitude

    //   this.initMap();
    // })
    
  }

  

  // getPosition(): Promise<any> {

  //   const POSITION = Plugins.Geolocation.getCurrentPosition()
  //   .catch( err => {
  //     return new Error( err )
  //   })
    
  
  //   this.coordinates$ = fromPromise(POSITION).pipe(
  //     switchMap((data: any) => of(data.coords)),
  //     tap(data => 
  //      console.log(data)
  //      )
  //   );
  //   return POSITION;
    
  // }
  

}
