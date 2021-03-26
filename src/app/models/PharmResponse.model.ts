import { ItemPharm } from '../interfaces/interfaces';

export class PharmResponse {

    constructor(
        public amount: number,
        public items: ItemPharm[],
        public orderId: string,
        public patient: string,
        public patient_address: any,
        public provider_address: any
    )  {}
}