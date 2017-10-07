export class Application {
  constructor(
    public projectId: number,
    public userId: number,
    public status: string,
    public resumeFlag: boolean,
    public comment?: string,
    public appliedTime?: Date,
    public acceptedTime?: Date,
    public declinedTime?: Date
  ) { }
}
