import { Component, OnInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.page.html',
  styleUrls: ['./mapbox.page.scss'],
})
export class MapboxPage implements OnInit {

  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  style = `mapbox://styles/sxavie/ckgjne68502d119lg44cs8poa`;

  lat = 51.50698244117723;
  lng = -0.12839044359108698;
  zoom = 15;

  //51.50698244117723
  //-0.12839044359108698

  draggMarker = new mapboxgl.Marker({
    draggable: true
  });

  geoLat;
  geoLng;

  geolocation = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  })

  constructor() {

    this.mapbox.accessToken = environment.mapBoxToken;
  }

  buildMap(){
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lat, this.lng]
    });

    
    // Geolocation Control
    this.map.addControl(this.geolocation);

    this.geolocation.on('geolocate', ( resp:any ) => {
      this.geoLat = resp.coords.latitude
      this.geoLng = resp.coords.longitude
    })
    
   


    // this.marker
    //   .setLngLat([this.lat, this.lng])
    //   .addTo(this.map);
      
  }

  ngOnInit() {

    this.buildMap()
  }

  getGeoCoords(){
    console.log( 'geoCoords, Latitude: ', this.geoLat, ' Longitude: ' ,this.geoLng )
  }

  getMarkerCoords(){
    let pinedCoords = this.draggMarker.getLngLat()
    console.log( 'coords: ', pinedCoords );
  }

  setCoords(){


    // Marker Control
    this.draggMarker.setLngLat([this.geoLat, this.geoLng]).addTo(this.map)
    console.log( 'GEOlocatin latitude: ', this.geoLat, ' Logitude: ',this.geoLng )

    this.draggMarker.on('dragend', resp => {
      console.log( 'cooords marker dragend: ', resp  )
    })

  
  }



}
