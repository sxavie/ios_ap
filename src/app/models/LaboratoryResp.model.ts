export class LaboratoryResp{

    constructor(
        public id: string, 
        public doctorId: string,
        public doctroName: string,
        public doctroTitle: string,
        public doctroRollment: string,
        public licence: string,
        public labReason : string,
        public doctroFilename: string
    ){}
}