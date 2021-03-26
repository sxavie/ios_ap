import { OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber } from 'openvidu-browser';
import { Platform, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError as observableThrowError } from 'rxjs';
import { UserService } from 'src/app/services/userservice.service';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';

declare var cordova;

@Component({
	selector: 'app-videocall',
	templateUrl: './videocall.page.html',
	styleUrls: ['./videocall.page.scss'],
})
export class VideocallPage implements OnDestroy {

	ANDROID_PERMISSIONS = [
		this.androidPermissions.PERMISSION.CAMERA,
		this.androidPermissions.PERMISSION.RECORD_AUDIO,
		this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS
	];

	// OpenVidu objects
	OV: OpenVidu;
	session: Session;
	publisher: StreamManager; // Local
	subscribers: StreamManager[] = []; // Remotes

	userData: any = {}

	constructor(
		private platform: Platform,
		private userservice: UserService,
		private httpClient: HttpClient,
		private androidPermissions: AndroidPermissions,
		public alertController: AlertController,
		public ordrServ: OrderService,
		public router: Router
	) {
		if (localStorage.getItem('UserData')) {
			this.userData = JSON.parse(localStorage.getItem('UserData'))
			console.log('Perfil: Constructor() => UserData obtenido del localStorage JSON.parse()')
		} else {
			this.userservice.getUserData().then((resp: any) => {
				localStorage.setItem('UserData', JSON.stringify(resp))
				this.userData = resp;
				console.log('Perfil: Constructor() => UserData obtenido del userservice.getUserData().subscribe()')
			})
		}
		this.joinSession(this.ordrServ.consultResponse._id)
	}

	@HostListener('window:beforeunload')
	beforeunloadHandler() {
		this.leaveSession();
	}


	ngOnDestroy() {
		this.leaveSession(); // On component destroyed leave session
	}

	joinSession(sessionId = "tidux") {
		this.OV = new OpenVidu();				// --- 1) Get an OpenVidu object ---
		this.session = this.OV.initSession();	// --- 2) Init a session ---


		// --- 3) Specify the actions when events take place in the session ---
		// On every new Stream received...
		this.session.on('streamCreated', (event: StreamEvent) => {
			// Subscribe to the Stream to receive it. Second parameter is undefined
			// so OpenVidu doesn't create an HTML video on its own
			const subscriber: Subscriber = this.session.subscribe(event.stream, undefined);
			this.subscribers.push(subscriber);
		});

		// On every Stream destroyed...
		this.session.on('streamDestroyed', (event: StreamEvent) => {
			// Remove the stream from 'subscribers' array
			this.deleteSubscriber(event.stream.streamManager);
		});

		// --- 4) Connect to the session with a valid user token ---

		// 'getToken' method is simulating what your server-side should do.
		// 'token' parameter should be retrieved and returned by your own backend
		this.getToken(sessionId).then((token) => {
			// First param is the token got from OpenVidu Server. Second param will be used by every user on event
			// 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
			this.session
				.connect(token, { clientData: this.userData.name })
				.then(() => {
					// --- 5) Requesting and Checking Android Permissions
					if (this.platform.is('cordova')) {
						// Ionic platform
						if (this.platform.is('android')) {
							console.log('Android platform');
							this.checkAndroidPermissions()
								.then(() => this.initPublisher())
								.catch(err => console.error(err));
						} else if (this.platform.is('ios')) {
							console.log('iOS platform');
							this.initPublisher();
						}
					} else {
						this.initPublisher();
					}
				})
				.catch(error => {
					console.log('There was an error connecting to the session:', error.code, error.message);
				});
		});
	}

	initPublisher() {
		// Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
		// element: we will manage it on our own) and with the desired properties
		const publisher: Publisher = this.OV.initPublisher(undefined, {
			audioSource: undefined, // The source of audio. If undefined default microphone
			videoSource: undefined, // The source of video. If undefined default webcam
			publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
			publishVideo: true, // Whether you want to start publishing with your video enabled or not
			resolution: '640x480', // The resolution of your video
			frameRate: 30, // The frame rate of your video
			insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
			mirror: true // Whether to mirror your local video or not
		});

		// --- 6) Publish your stream ---

		this.session.publish(publisher).then(() => {
			// Store our Publisher
			this.publisher = publisher;
		});
	}

	leaveSession() {
		// --- 7) Leave the session by calling 'disconnect' method over the Session object ---

		if (this.session) {
			this.session.disconnect();
		}

		// Empty all properties...
		this.subscribers = [];
		delete this.publisher;
		delete this.session;
		delete this.OV;

		this.router.navigate(['app/consultas/waiting']);
	}

	refreshVideos() {
		if (this.platform.is('ios') && this.platform.is('cordova')) {
			cordova.plugins.iosrtc.refreshVideos();
		}
	}

	private checkAndroidPermissions(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.platform.ready().then(() => {
				this.androidPermissions
					.requestPermissions(this.ANDROID_PERMISSIONS)
					.then(() => {
						this.androidPermissions
							.checkPermission(this.androidPermissions.PERMISSION.CAMERA)
							.then(camera => {
								this.androidPermissions
									.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
									.then(audio => {
										this.androidPermissions
											.checkPermission(this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS)
											.then(modifyAudio => {
												if (camera.hasPermission && audio.hasPermission && modifyAudio.hasPermission) {
													resolve(true);
												} else {
													reject(
														new Error(
															'Permissions denied: ' +
															'\n' +
															' CAMERA = ' +
															camera.hasPermission +
															'\n' +
															' AUDIO = ' +
															audio.hasPermission +
															'\n' +
															' AUDIO_SETTINGS = ' +
															modifyAudio.hasPermission,
														),
													);
												}
											})
											.catch(err => {
												console.error(
													'Checking permission ' +
													this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS +
													' failed',
												);
												reject(err);
											});
									})
									.catch(err => {
										console.error(
											'Checking permission ' + this.androidPermissions.PERMISSION.RECORD_AUDIO + ' failed',
										);
										reject(err);
									});
							})
							.catch(err => {
								console.error('Checking permission ' + this.androidPermissions.PERMISSION.CAMERA + ' failed');
								reject(err);
							});
					})
					.catch(err => console.error('Error requesting permissions: ', err));
			});
		});
	}

	private deleteSubscriber(streamManager: StreamManager): void {
		const index = this.subscribers.indexOf(streamManager, 0);
		if (index > -1) {
			this.subscribers.splice(index, 1);
		}
	}

	/*
	 * --------------------------
	 * SERVER-SIDE RESPONSIBILITY
	 * --------------------------
	 * This method retrieve the mandatory user token from OpenVidu Server,
	 * in this case making use Angular http API.
	 * This behaviour MUST BE IN YOUR SERVER-SIDE IN PRODUCTION. In this case:
	 *   1) Initialize a session in OpenVidu Server	 (POST /api/sessions)
	 *   2) Generate a token in OpenVidu Server		   (POST /api/tokens)
	 *   3) The token must be consumed in Session.connect() method of OpenVidu Browser
	 */

	getToken(sessionId): Promise<string> {
		return this.createSession(sessionId).then((sessionId) => {
			return this.createToken(sessionId);
		});
	}

	createSession(sessionId) {
		return new Promise((resolve, reject) => {
			const body = JSON.stringify({ customSessionId: sessionId });
			const options = {
				headers: new HttpHeaders({
					Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + environment.openvidu_secret),
					'Content-Type': 'application/json',
				}),
			};
			return this.httpClient
				.post(environment.openvidu_url + '/api/sessions', body, options)
				.pipe(
					catchError((error) => {
						if (error.status === 409) {
							resolve(sessionId);
						} else {
							console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + environment.openvidu_url,);
						}
						return observableThrowError(error);
					}),
				)
				.subscribe((response) => {
					console.log(response);
					resolve(response['id']);
				});
		});
	}

	createToken(sessionId): Promise<string> {
		return new Promise((resolve, reject) => {
			const body = JSON.stringify({ session: sessionId });
			const options = {
				headers: new HttpHeaders({
					Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + environment.openvidu_secret),
					'Content-Type': 'application/json',
				}),
			};
			return this.httpClient
				.post(environment.openvidu_url + '/api/tokens', body, options)
				.pipe(
					catchError((error) => {
						reject(error);
						return observableThrowError(error);
					}),
				)
				.subscribe((response) => {
					console.log(response);
					resolve(response['token']);
				});
		});
	}
}