import { Point } from './point';
export class User {

    constructor(
        public id: number,
        public email: string,
        public phone: string,
        public state: string,
        public country: string,
        public zip: string,
        public status: string,
        public role: string,
        public github: string,
        public displayFlag: string,
        public longitude: string,
        public latitude: string,
        public userName: string,
        public firstName: string,
        public lastName: string
    ) { }
}
