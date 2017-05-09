export class User {

    constructor(
        public id: number,
        public email: string,
        public role: string,
        public userName?: string,
        public firstName?: string,
        public lastName?: string,
        public state?: string,
        public country?: string,
        public latitude?: number,
        public longitude?: number,
        public title?: number,
        public introduction?: string,
        public linkedinUrl?: string,
        public personalUrl?: string,
        public facebookUrl?: string,
        public twitterUrl?: string,
        public avatarUrl?: string,
        public publicProfileFlag?: string,
        public chatFlag?: string,
        public forumFlag?: string,
        public status?: string,
        public createdTime?: string,
        public updatedTime?: string
    ) { }
}
