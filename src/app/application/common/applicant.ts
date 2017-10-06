export class Applicant {

constructor (
    public userId: number,
    public projectId: number,
    public applicationStatus: string,
    public resumeFlag: boolean,
    public firstName?: string,
    public lastName?: string,
    public title?: string,
    public comment?: string,
    public appliedTime?: Date,
    public acceptedTime?: Date,
    public declinedTime?: Date
  ) { }
}
