export class Organization {
  constructor (
    public id: number,

    public name: string,
    public logoUrl: string,
    public websiteUrl: string,
    public description: string,
    public category: string,
    public address1: string,
    public address2: string,
    public city: string,
    public zip: string,
    public state: string,
    public country: string,
    public ein: string,
    public projects: number,

    public latitude?: number,
    public longitude?: number,
    public status?: string,
    public createdTime?: string,
    public updatedTime?: string
  ) { }
}
