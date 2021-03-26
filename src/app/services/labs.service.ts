import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, tap } from 'rxjs/operators';
import { AlertsService } from './alerts.service';
import { throwError } from 'rxjs';

import { Laboratory } from '../models/laboratory.model';
import { LaboratoryResp } from '../models/LaboratoryResp.model';

const apiUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class LabsService {

  public selectedLabID: string; // sets variable value on labsservices.page
  // Order Variables Labs
  public newLabData: Laboratory;
  // hardCode consumir dara del socjet respuesta servicio laboratorio
  public labResponse: LaboratoryResp
    = new LaboratoryResp(
      'ordern001', 'doctro001', 'Alejandro Lopez', 'Quimico', 'Quim..', 'VN$REY#5G', 'Prueba Covid-19', 'https://img.freepik.com/vector-gratis/fondo-personaje-doctor_1270-84.jpg?size=338&ext=jpg');

  // nuevas variables 
  // Notas Marzo 2021
  public servicesRequestList: string[]; // variable guarda lista de id's de servicios solicitados por el suuario para mostrar lista de laboratorios
  public serviceRequestSelected: any; // full last service data selected, data del servicio que eligio el paciente;
  public serviceSelectedAvaliableSchedule: any[];
  public serviceFlowJSONData;

  public temp_paymenthod_service;
  public temp_address_service;

  // No en Uso
  public _setServiceDay: Date = new Date(); // var para guardar el dia seleccionado en calendario (fecha) 
  public _esCovid: boolean = false;

  constructor(private http: HttpClient,
    private alertsservice: AlertsService) { }

  get authHeaders() {

    const token = localStorage.getItem('jwttoken')
    const headers = new HttpHeaders({
      'authorization': token
    });
    return headers
  }

  get returnLabService() {
    let labReasons: any = {
      1: "Perfil bioquimico 25",
      2: "Perfil bioquimico 19",
      3: "Perfil lipidos",
      4: "Perfil preoperatorio",
      5: "Perfil prenatal I",
      6: "Perfil tiroideo completo con tsh",
      7: "QUIMICA SANGUINEA",
      8: "Tiempo de protombina tiempo de sangrado tiempo de tromboplastina parcial",
      9: "V.D.R.L.",
      10: "ANTIDOPING",
      11: "Antigeno especifico prostata libre",
      12: "Biometria hematica",
      13: "Coprocultivo",
      14: "Coprologico",
      15: "Electrolitos sericos sodio, potasio y cloro",
      16: "Examen general de orina"
    }
    return labReasons[this.newLabData.labReason];
  }

  // Lista de laboratorios
  getLabs() {

    const url = `${apiUrl}/lab/center`
    const headers = this.authHeaders;

    return this.http.get(url, { headers })
      .pipe(catchError(err => {
        return throwError(err);
      }))

  }

  // lista de servicios del laboratorio
  getLabsServices() {
    const url = `${apiUrl}/list/studios/${this.selectedLabID}`
    const headers = this.authHeaders;
    return this.http.post(url, {}, { headers })
  }

  // listar horarios del servicio seleccionado
  getServiceSchedules(setDay: number) {
    let headers = this.authHeaders;

    const servicesID = this.servicesRequestList.map((serv: any) => serv._id)

    let data = this.serviceRequestSelected;
    data.idServices = servicesID;
    data._id = servicesID[0];
    data.dia = setDay;

    return this.http.post(`${apiUrl}/list/appointments`, { data }, { headers });
    // return this.http.post(`${apiUrl}/check/schedules`, { data }, { headers });
  }

  // asignar un doctor en base a la hora sekeccionado
  sendServiceSchedule(time: any) {
    const headers = this.authHeaders;
    return this.http.post(`${apiUrl}/assign/doctor`, { time }, { headers });
  }

  // Asignar un metodo de pago a la consulta
  setCardIdPaymentMethod() {
    const headers = this.authHeaders;
    return this.http.post(`${apiUrl}/pay/service`, { paymentCardID: this.serviceFlowJSONData.data.paymentCardID }, { headers })
  }

  // send id's services to get resume
  getLabServiceResume() {
    let url = `${apiUrl}/create/resume`
    let headers = this.authHeaders;

    return this.http.post(url, { servicesID: this.serviceFlowJSONData.data }, { headers })
  }

  // guardar la cita en la base de datos;
  saveAppointment() {
    let headers = this.authHeaders;

    return this.http.post(`${apiUrl}/save/appointment`, this.serviceFlowJSONData, { headers })
  }

  cancelarEstudio() {

    let headers = this.authHeaders;
    return this.http.post(`${apiUrl}/delete/appointment`, { apptID: this.serviceFlowJSONData.data.cita }, { headers })
  }

}
