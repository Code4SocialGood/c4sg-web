export class User {

constructor (
    public id: number,

    public email: string,
    public role: string,
    public jobTitleId?: number,
    public userName?: string,
    public firstName?: string,
    public lastName?: string,
    public state?: string,
    public country?: string,
    public latitude?: number,
    public longitude?: number,
    public phone?: string,
    public title?: string,
    public introduction?: string,
    public linkedinUrl?: string,
    public personalUrl?: string,
    public githubUrl?: string,
    public chatUsername?: string,
    public avatarUrl?: string,
    public publishFlag?: string,
    public notifyFlag?: string,

    public status?: string,
    public createdTime?: string,
    public updatedTime?: string,
    public skills?: string[],
    public projects?: string[]
  ) { }
}
