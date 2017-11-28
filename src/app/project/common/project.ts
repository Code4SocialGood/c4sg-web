export class Project {
  constructor(
    public id: number,

    public name: string,
    public description: string,
    public organizationId: number,
    public jobTitleId?: number,
    public remoteFlag?: string,
    public address1?: string,
    public address2?: string,
    public city?: string,
    public state?: string,
    public country?: string,
    public zip?: string,
    public imageUrl?: any,

    public status?: string,
    public createdTime?: string,
    public updatedTime?: string,

    public skills?: string[],
    public organizationName?: string,
    public organizationLogoUrl?: string
  ) { }
}
