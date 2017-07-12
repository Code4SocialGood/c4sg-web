export class Applicant {

constructor (
    public userId: number,
    public projectId: number,
    public firstName?: string,
    public lastName?: string,
    public title?: string,
    public applicationStatus?: string,
    public appliedTime?: string,
    public acceptedTime?: string,
    public declined?: string
  ) { }
}
