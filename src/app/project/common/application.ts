export class Application {
  constructor(
    public projectId: int,
    public userId: int,
    public status: string,   
    public resumeFlag: boolean,   
    public comment?: string
  ) { }
}