export class ApplicationProject {

constructor (
    public userId: number,
    public projectId: number,
    public applicationStatus: string,
    public resumeFlag: boolean,
    public projectName?: string,
    public comment?: string,
    public appliedTime?: Date,
    public acceptedTime?: Date,
    public declinedTime?: Date
  ) { }
}
