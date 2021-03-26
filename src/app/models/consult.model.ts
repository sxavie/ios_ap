export class Consult{


    constructor(
        public consultReason: number,   // [1 - 5], tipo de consulta
        public patient?: string,         //Id del paciente
        public consultType?: number,    // [1 - 2], Precencia/Viertual
        public meeting?: boolean,       // Si es agendada
        public guest?: boolean,         // si es para invitado
        public symptoms?: string[],
        public lat?: number,
        public lon?: number,
        public addresId?: any,
        public paymentMethod?: number,   // efectivo / tarjeta
        public coupon?: string,
                // solo si el capo meeteing es true.
        public hour?: any,
        public day?: any,
        public month?: any,
        public year?: any,
        public date?: any
    ){}
}