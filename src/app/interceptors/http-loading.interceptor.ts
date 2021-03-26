
import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { LoadingController, } from '@ionic/angular';
import { catchError, delay, finalize, map, retryWhen, take } from 'rxjs/operators';

import { Plugins, Capacitor } from '@capacitor/core'

const { Toast } = Capacitor.Plugins;


@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    constructor( private loadingCtrl: LoadingController ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            
        // if( request.url === '/assets/data/menu.json' ) {
        //     console.log( 'INTERCEPTOR:::::::::', request.url )
        //     const fakeUrl = `/assets/data/menu.json`;
        //     const fakeRequest = request.clone({url: fakeUrl});
        //     console.log( 'URL INTERCEPTADA' )
        //     return next.handle(request);
        // }

        this.loadingCtrl.getTop().then(hasLoading => {
            if (!hasLoading) {
                this.loadingCtrl.create({
                    spinner: 'lines-small',
                    translucent: true
                }).then(loading => loading.present());
            }
        })
        
        return next.handle(request).pipe(
            retryWhen(err => {
                return err.pipe(
                    delay(1000),
                    take(3),
                    map(error => {
                        
                        throw error
                    })
                )
            }),
            catchError(err => {
                console.log('error: ', err);
                // this.showToast("Error al intentar conectar con el servidor")
                this.showToast(err.error.message)
                return EMPTY;
            }),
            finalize( () => {
                this.loadingCtrl.getTop().then(hasLoading => {
                    if (hasLoading) {
                        this.loadingCtrl.dismiss();
                    }
                })
            })
        );
        // }
    }

    async showToast( text ){
        
        Toast.show({
          text
        });
    }

}