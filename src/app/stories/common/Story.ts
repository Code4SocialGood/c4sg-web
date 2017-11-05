import { StoryType } from './StoryType';
export class Story {
  constructor(
    public id: number,

    public title: string,
    public description: string,
    public type: StoryType,
    public imageUrl?: string,
    public author?: string,


    public status?: string,
    public createdTime?: string,
    public updatedTime?: string
  ) { }
}
