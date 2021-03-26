import { environment } from '../../environments/environment'

const apiUrl = environment.apiUrl;

export class Usuario {

    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public password: string, 
        public dateCreated: string,    
        public userType: string, 
        public birthday?: string,
        public gender?: string,
        public filename?: string,
        public mobile?: string, 
        public bloodType?: string, 
        public height?: string,
        public weight?: string,
        public paymentID?: string, 
        public terms?: boolean, 
        public verified?: boolean, 
        public verificationCode?: boolean, 
        public active?: boolean,
        public firebaseToken?: string, 
        public isOrder?: string,
        public skills?: [],
        public allergies?: [], 
        public diseases?: [], 
        public family?: any[], 
        public relationship?: string,
    ) {}

    imprimirUsuario(){

    }

    get imageUrl() {
        if (this.filename) {
            const splitImgFormat = this.filename.split('.');
            console.log(`${apiUrl}/images/users/${splitImgFormat[0]}`)
            return `${apiUrl}/images/users/${splitImgFormat[0]}`;
        }

        return null;
    }
    
}

