export class Laboratory{


    constructor(
        public labReason : number,       // [1 - 5], tipo de consulta
        public patient?: string,         //Id del paciente
        public address?: string,
        public paymentMethod?: number,   // efectivo / tarjeta
        public date?: any,
        public hour?: string,
        public day?: string,
        public month?: string,
        public year?: string
    ){}
}