export class Project {

    constructor(
        public id: number, 
        public name: string,
        public organization: number,
        public description: string,  
        public image: string,  
        public city: string,  
        public country: string,
        public zip: string,
        public organizationName: string,
    ){}
}