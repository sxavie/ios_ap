import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';


import { Capacitor, Plugins, GeolocationPosition } from '@capacitor/core';
import { Observable, of, from as fromPromise, throwError } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

const { Geolocation } = Capacitor.Plugins;


declare var google;

@Component({
  selector: 'app-view-test',
  templateUrl: './view-test.page.html',
  styleUrls: ['./view-test.page.scss'],
})
export class ViewTestPage implements OnInit {

  @ViewChild('map', {static: true}) mapElement: ElementRef

  // map: GoogleMap;

  map : any;

  constructor() { }



  ngOnInit() {
  }
  

  initMpa( lat = '0', lng = '0' ){
  // initMpa(){

    // var map = new google.maps.Map( this.mapElement.nativeElement, {
      const uluru = { lat: parseFloat(lat), lng: parseFloat(lng) };
      // The map, centered at Uluru
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: new google.maps.LatLng( uluru ) ,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        scaleControl: false
      });
      // The marker, positioned at Uluru
      const marker = new google.maps.Marker({
        position: uluru,
        map: map,
      });

    

   
   

    return map;



  }


  watchPos(){

    Plugins.Geolocation.watchPosition({}, (resp:Position) => {
      this.map = this.initMpa( resp.coords.latitude.toString(), resp.coords.longitude.toString() )
    })
  }

  currentPos(){

    let pos = Plugins.Geolocation.getCurrentPosition()

    pos.then( (pos: Position) => {

      this.initMpa( pos.coords.latitude.toString(), pos.coords.altitude.toString() )
      console.log( pos.coords.latitude )
      console.log( pos.coords.longitude )

    }).catch( err => {
      return throwError( err )
    })

  }

  
  // loadMapNative(){

  //   Environment.setEnv({
  //     'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyAqQAyBBDQ7ovDbXpWPj-fczai01MepyQg',
  //     'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyAqQAyBBDQ7ovDbXpWPj-fczai01MepyQg'
  //   });

  //   let mapOptions: GoogleMapOptions = {
  //     camera:{
  //       target: {
  //         lat: 43.0741904,
  //         lng: -89.3809802
  //       },
  //       zoom: 15,
  //       tilt: 30
  //     }
  //   };

  //   this.map = GoogleMaps.create('map', mapOptions)

  // }

}
 