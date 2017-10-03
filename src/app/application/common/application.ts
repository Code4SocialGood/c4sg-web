export class Application {
  constructor(
    public projectId: number,
    public userId: number,
    public status: string,   
    public resumeFlag: boolean,   
    public comment?: string,
    public appliedTime?: string,
    public acceptedTime?: string,
    public declinedTime?: string
  ) { }
}