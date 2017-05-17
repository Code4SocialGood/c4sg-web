export class Project {

  constructor(public id: number,
              public name: string,
              public organizationId: number,
              public description: string,
              public image?: any,
              public line1?: string,
              public line2?: string,
              public city?: string,
              public country?: string,
              public zip?: string,
              public organizationName?: string,
              public address1?: string,
              public address2?: string,
              public state?: string,
              public createdTime?: any,
              public updatedTime?: any,
              public remoteFlag?: string,
              public skills?: string[]) {
  }
}
