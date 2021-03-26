
export class Product{

    constructor(
        public _id: string,
        public sku: string,
        public name: string,
        public price: number,
        public stock: number,
        public description?: string,
        public fileName?: string,
        public provider?: string
        
    ){}
}