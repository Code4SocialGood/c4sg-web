export class User {

    constructor(
        public id: number,
        public email: string,
        public role: string,
        public userName?: string,
        public firstName?: string,
        public lastName?: string,
        public phone?: string,
        public city?: string,
        public state?: string,
        public country?: string,
        public zip?: string,
        public introduction?: string,        
        public linkedinUrl?: string,
        public personalUrl?: string,
        public publicProfileFlag?: string,
        public chatFlag?: string,
        public forumFlag?: string,
        public developerFlag?: string,
        public status?: string,
        public createdTime?: string,
        public updatedTime?: string
    ) { }
}
