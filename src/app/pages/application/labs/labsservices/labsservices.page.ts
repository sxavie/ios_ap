import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { Laboratory } from 'src/app/models/laboratory.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { LabsService } from 'src/app/services/labs.service';

@Component({
  selector: 'app-labsservices',
  templateUrl: './labsservices.page.html',
  styleUrls: ['./labsservices.page.scss'],
})
export class LabsservicesPage implements OnInit {

  public labServicesList; // variable dode se almacena la data obtenida;
  public numero; // en caso de obtener un length en la data, esta variable se usa para mostrar el tempalte;

  public servicesRequestList: string[] = [];
  public covidAlert;

  constructor(private router: Router,
    private alertsservice: AlertsService,
    private labsservices: LabsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.loadServicesList();
  }

  loadServicesList() {

    this.loadingCtrl.create({
      spinner: 'lines-small'
    }).then((spinner) => {
      spinner.present();
    })

    this.labsservices.getLabsServices()
      .toPromise()
      .then((response: any) => {

        if (response.codigo) {
          this.numero = response.data.length;
          this.labServicesList = response.data;
        }

        else
          this.alertsservice.showToast(response.message, 2000, 'danger', 'top')

      })
      .catch((err) => {
        console.log(err)
        this.alertsservice.showToast('Hubo un error al cargar la informacion', 2000, 'danger', 'top')
      })
      .finally(() => this.loadingCtrl.dismiss())

  }

  addService(service: any) {

    const idx = this.servicesRequestList.indexOf(service);

    if (idx === -1)
      this.servicesRequestList.push(service);
    else
      this.servicesRequestList.splice(idx, 1);

    console.log(' lista ', this.servicesRequestList)
  }

  async serviceRequest() {

    if (this.servicesRequestList.length > 0) {

      const isCovid = this.someIsCovidValidations();
      const areCovid = this.everyIsCovidValidations();
      let newDate = new Date();

      if (isCovid && this.servicesRequestList.length > 1) {

        if (areCovid) {
          // no se hace nada, la fecha se establece al dia actual, esta se asigna al final de la estrucutra if
          this.labsservices._esCovid = true; // esta bandera se agrego de ultimo momento para validar en la proxima pantalla si es covid
        } else {
          // preguntar al cliente si quere juntar la orden, se definen y establecen variables ne la funcion de la Alerta, en base a la seleccion del usuario.
          await this.warningCovidAlert();
          return;
        }

      } else if (isCovid) {
        // no se hace nada, la fecha se establece al dia actual, esta se asigna al final de la estrucutra if
        this.labsservices._esCovid = true; // esta bandera se agrego de ultimo momento para validar en la proxima pantalla si es covid
      } else {
        // a la fecha definida se le suma un dia, y esta se asigna al final de la estrucutra if
        newDate.setDate(newDate.getDate() + 1);
      }

      const arrCovid = this.getCovidService();

      if (arrCovid.length > 0)
        this.labsservices.serviceRequestSelected = arrCovid[0];
      else
        this.labsservices.serviceRequestSelected = this.servicesRequestList[0];

      this.labsservices._setServiceDay = newDate;
      this.labsservices.servicesRequestList = this.servicesRequestList;
      this.router.navigate(['/app/labs/labschedule']);

    }

  }

  getCovidService() {
    const covidsArr = this.servicesRequestList.filter((covidService: any) => covidService.covid)
    return covidsArr;
  }

  someIsCovidValidations(): boolean {

    const covs = this.servicesRequestList.map((serv: any) => serv.covid)
    const someIsCovid = covs.some(boolElem => boolElem === true)

    // this.labsservices.serviceFlowJSONData.data.someCovid = someIsCovid;

    return someIsCovid;
  };

  everyIsCovidValidations(): boolean {

    const covs = this.servicesRequestList.map((serv: any) => serv.covid)
    const everyAreCovid = covs.every(boolElem => boolElem === true)

    return everyAreCovid;
  };

  showWarning() {
    this.alertsservice.showToast('Debe seleccionar por lo menos un servicio', 2000, 'warning', 'top');
  }

  async warningCovidAlert() {

    this.covidAlert = await this.alertCtrl.create({
      message: 'Has seleccionado almenos un servicio de COVID, Deseas agendar los servicios en la misma orden?',
      header: 'Confirmar servicios!',
      buttons: [
        {
          text: 'NO',
          handler: () => {

            // si el man dice que NO, se establece para hoy (dando preoridad la orden de covid), y debe realizar el proceso nuevamente para el segundo servicio.
            let newDate = new Date();

            this.labsservices._setServiceDay = newDate;

            const covidService = this.servicesRequestList.filter((service: any) => service.covid);
            this.labsservices.servicesRequestList = covidService;
            this.labsservices._esCovid = true;// esta bandera se agrego de ultimo momento para validar en la proxima pantalla si es covid

            const arrCovid = this.getCovidService();

            if (arrCovid.length > 0)
              this.labsservices.serviceRequestSelected = arrCovid[0];

            // redireccionar
            this.router.navigate(['/app/labs/labschedule']);

          }
        }, {
          text: 'SI',
          handler: () => {

            // si el dude dice que si, entonces se establece la fecha para el dia de mañana

            let newDate = new Date();
            newDate.setDate(newDate.getDate() + 1);

            this.labsservices._setServiceDay = newDate;
            this.labsservices.servicesRequestList = this.servicesRequestList;

            this.labsservices.serviceRequestSelected = this.servicesRequestList[0];

            // redireccionar
            this.router.navigate(['/app/labs/labschedule']);

          }
        }
      ]
    });

    this.covidAlert.present();

  }


}
