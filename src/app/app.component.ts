import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, StatusBarStyle } from '@capacitor/core'
import { Socket } from 'ngx-socket-io';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})

export class AppComponent {

	constructor(
		private platform: Platform,
		private socket: Socket
	) {
		this.initializeApp();
	}

	async initializeApp() {

		const { SplashScreen, StatusBar } = Plugins;
		try {
			await SplashScreen.show();
			await StatusBar.setStyle({ style: StatusBarStyle.Light });
			if (this.platform.is('android')) {
				StatusBar.setBackgroundColor({ color: '#CDCDCD' });
			}
		} catch (err) {
			console.log('This is normal in a browser platform', err)
		}
		this.socket.connect();

	}

}
