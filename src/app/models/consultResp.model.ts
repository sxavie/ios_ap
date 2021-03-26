import { Address } from '../interfaces/interfaces';

export class ConsultResp{


    constructor(

        
        public _id: string,
        public address: any,
        public consultReason: string,
        public consultType: number,
        public orderStatus: number,
        public date: string,
        public meeting: any,
        public paymentMethod: string,
        public patientName: string,
        public patientId: string,
        // - Socket variables
        public medicalLicense: string,
        public doctorLocation: any,
        public doctor: string,
        public amount: number,
        public time: string,
        public km_fare: number,
        // - Socket variables
        public filename?: any,
        public patientFile?: any,
        public symptoms?: any,
        public medicalHistory?: any,
        public consultAmount?: number,
        public shippingAmount?: number,
        
    ){}


}



