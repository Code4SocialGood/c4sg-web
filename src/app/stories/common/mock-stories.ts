import { Story } from './Story';
import { StoryType } from './StoryType';

export const STORIES: Story[] = [
    new Story(0,
        // tslint:disable-next-line:max-line-length
        'I was only 10 years old when I first got totally addicted to the idea of programming a video game myself. I started with small steps, from things such as Game Maker, to actual coding languages, and discovered a whole world full of amazing things I had never seen before. Now that 6 years have passed, I have kind of shifted my  ...',
        'I was only 10 years old when I first got totally addicted to the idea of programming a video game myself. I started with small steps, from things such as Game Maker, to actual coding languages, and discovered a whole world full of amazing things I had never seen before. Now that 6 years have passed, I have kind of shifted my  ...', StoryType.VOLUNTEER, '../../assets/default_avatar.png'),
        new Story(1, 'Coming soon ...', 'Coming soon ...', StoryType.VOLUNTEER, '../../assets/default_avatar.png'),
        new Story(2, 'Coming soon ...', 'Coming soon ...', StoryType.VOLUNTEER, '../../assets/default_avatar.png'),
        new Story(3,
            // tslint:disable-next-line:max-line-length
            'When new volunteers join a project of mine (or where I am volunteer coordinator) I like to ask them what their goals are for the project, for example: 1. developing their tech skills 2. learning new tech skills 3. learning to work collaboratively (using git for example) 4. meeting friends in their own field/area 5. doing things together with ...',
            'When new volunteers join a project of mine (or where I am volunteer coordinator) I like to ask them what their goals are for the project, for example: 1. developing their tech skills 2. learning new tech skills 3. learning to work collaboratively (using git for example) 4. meeting friends in their own field/area 5. doing things together with ...', StoryType.ORGANIZATION, 'https://s3-us-west-2.amazonaws.com/c4sg.images/662full-size-logo.png'),
            new Story(4,
                // tslint:disable-next-line:max-line-length
                'A couple of years ago i read the book "Producing Open Source Software", one of the ideas in the book is to have different responsibilities for volunteers, so for example someone may want to be the documentation manager, another person can be the issue list manager. One nice thing with this approach is that people ...',
                'A couple of years ago i read the book "Producing Open Source Software", one of the ideas in the book is to have different responsibilities for volunteers, so for example someone may want to be the documentation manager, another person can be the issue list manager. One nice thing with this approach is that people ...', StoryType.ORGANIZATION, 'https://s3-us-west-2.amazonaws.com/c4sg.images/662full-size-logo.png'),
                new Story(5, 'Coming soon ...', 'Coming soon ...', StoryType.ORGANIZATION, '../../assets/default_image.png'),
                new Story(6,
                    // tslint:disable-next-line:max-line-length
                    'Is All About coding and help people!',
                    // tslint:disable-next-line:max-line-length
                    'A couple years ago i start to get involved and fascinated about open source software, people sharing code, collaborating and making new stuff for free.',
                    // tslint:disable-next-line:max-line-length
                    StoryType.VOLUNTEER, 'https://s3-us-west-2.amazonaws.com/c4sg.images/662full-size-logo.png', 'Luis Kimura', 'Software Developer'),
                    new Story(7,
                        // tslint:disable-next-line:max-line-length
                        'A couple of years ago i read the book Producing Open Source Software, one of the ideas in the book is to have different responsibilities for volunteers, so for example someone may want to be the documentation manager, another person can be the issue list manager. One nice thing with this approach is that people ...',
                        // tslint:disable-next-line:max-line-length
                        'A couple of years ago i read the book Producing Open Source Software, one of the ideas in the book is to have different responsibilities for volunteers, so for example someone may want to be the documentation manager, another person can be the issue list manager. One nice thing with this approach is that people ...',
                        // tslint:disable-next-line:max-line-length
                        StoryType.ORGANIZATION, 'https://s3-us-west-2.amazonaws.com/c4sg.images/662full-size-logo.png', 'Luis Kimura', 'Code 4 Social Good')
];
