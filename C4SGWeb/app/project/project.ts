export class Project {

  constructor(public id: number,
              public name: string,
              public organizationName: string,
              public shortDescription: string,
              public description: string,
              public image?: string,
              public line1?: string,
              public line2?: string,
              public city?: string,
              public country?: string,
              public zip?: string) {
  }
}
