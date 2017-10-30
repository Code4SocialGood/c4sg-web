import { Project } from '../../project/common/project';

export class Hero {
constructor (
    public userId: number,
    public firstName: string,
    public lastName: string,
    public title: string,
    public avatarUrl: string,
    public state: string,
    public country: string,
    public skill: string[],
    public badgeCount: number,
    public project: Project[],
    public publishFlag: string
  ) { }
}
