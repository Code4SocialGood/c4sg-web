import {
  Component,
  OnInit,
  Input,
  trigger,
  state,
  style,
  transition,
  animate,
  OnDestroy
} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Project} from '../project/common/project';
import {ProjectService} from '../project/common/project.service';
import {DataService} from '../_services/data.service';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs/Rx';
import {User} from '../user/common/user';
import {UserService} from '../user/common/user.service';
import {OrganizationService} from '../organization/common/organization.service';
import {Organization} from '../organization/common/organization';
import {FormConstantsService} from '../_services/form-constants.service';

require('./agmMarkerProto.js');

enum Status {
  Active = 'A',
  Volunteer = 'V',
  Yes = 'Y',
}

@Component({
  selector: 'my-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  animations: [
    trigger('buttonState', [
      state('inactive', style({
        transform: 'scale(1)'
      })),
      state('active', style({
        transform: 'scale(1.05)'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ]),
    trigger('toggleColor', [
      state('1', style({
        color: '#4285f4'
      })),
      state('2', style({
        color: '#f49222'
      })),
      state('3', style({
        color: '#711df7'
      })),
      state('4', style({
        color: '#fc2561'
      })),
      transition('1 => 2', animate('600ms ease-in')),
      transition('2 => 3', animate('600ms ease-in')),
      transition('3 => 4', animate('600ms ease-in')),
      transition('4 => 1', animate('600ms ease-in')),
    ]),
    trigger('cursorFlash', [
      state('inactive', style({
        opacity: 1,
      })),
      state('active', style({
        opacity: 0,
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]
})
export class HomeComponent implements OnInit {

  // search button
  state = 'inactive';
  projects: Project[] = [];

  // Featured projects
  topThreeProjects: Project[] = [];

  // cursor and aniSlogan
  tempWord = '';
  clear = true;
  typeAniIndex = -1;
  typeAniPeriod = 100;
  cursorState = 'inactive';
  wordColorIndex = 0;

  aniWordGroup = ['interest !', 'fun~', 'a better world.', 'social good !'];
  aniWord = '';
  aniWordGroupOrg = ['social good !', 'better future~', 'a better world.'];
  aniWordOrg = '';

  // Google maps
  usersSubscription: Subscription;
  developers: User[];
  organizations: Organization[];
  countries: any[];
  allProjects: Project[];
  numberOfOrganization: number;
  numberOfVolunteers: number;
  numberOfPublicProfiles: number;
  numberOfProjects: number;
  numberOfCountries: number;
  zoom = 2;
  // initial center position for the map
  lat = 0;
  lng = 0;
  activeInfoWindow = null;

  constructor(private projectService: ProjectService,
              private router: Router,
              private dataService: DataService,
              public authSvc: AuthService,
              private uService: UserService,
              private oService: OrganizationService,
              public constantsService: FormConstantsService) {
  }

  // onload animation timer
  ngOnInit(): void {

    // cursor and aniSlogan
    const wordTimer = Observable.timer(0, 35 * this.typeAniPeriod);
    const typeTimer = Observable.timer(0, this.typeAniPeriod);
    const cursorTimer = Observable.timer(0, 400);

    wordTimer.subscribe(t => this.tempWord = this.switchWord(t));
    typeTimer.subscribe(v => this.aniWord = this.typeWord(v, this.tempWord));
    cursorTimer.subscribe(u => this.cursorFlash(u));

    // Google maps
    // this.numberOfVolunteers = this.constantsService.getDevelopersCount();
    // this.numberOfPublicProfiles = this.constantsService.getDevelopersPublicProfileCount();
    // this.numberOfOrganization = this.constantsService.getOrganizationsCount();
    this.countries = this.constantsService.getCountriesForMap();
    // this.numberOfCountries = this.constantsService.getCountriesCount();
    // this.numberOfProjects = this.constantsService.getProjectsCount();

    this.getDevelopers();
    this.getOrganizations();
    this.getProjects();
    this.getTotalCountries();

    // Featured projects
    this.getTopThreeProjects();
  }

  // search button
  toggleState() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }

  getProjectsByKeyword(keyword: string) {
    keyword = keyword.trim();
    // if (!keyword) { return; }
    this.router.navigate(['/project/list/projects'], {
      queryParams: {
        keyword: keyword
      }
    });
  }

  private getTopThreeProjects(): void {
    this.projectService.searchProjects(null, null, null, Status.Active, null, 1, 10)
    .subscribe(
      res => {
        this.projects = res.data;
        this.topThreeProjects = this.projects.slice(0, 3);
      },
      error => console.log(error)
    );
  }

  // cursor and aniSlogan
  // animation word
  switchWord(time) {
    const index = time % this.aniWordGroup.length;
    this.aniWord = '';
    this.typeAniIndex = -1;
    if (this.wordColorIndex < this.aniWordGroup.length) {
      this.wordColorIndex++;
    } else {
      this.wordColorIndex = 1;
    }
    return this.aniWordGroup[index];
  }

  typeWord(time, word: string) {
    const wordArray = word.split('');
    this.typeAniIndex++;
    if (this.aniWord === word) {
      return this.aniWord.concat('');
    } else {
      return this.aniWord.concat(wordArray[this.typeAniIndex]);
    }
  }

  cursorFlash(time) {
    this.cursorState = (this.cursorState === 'inactive' ? 'active' : 'inactive');
  }

  // Google maps
  private getDevelopers(): void {
    this.usersSubscription = this.uService.getAllUsers()
    .subscribe(
      res => {
        this.developers = res.filter(vol => vol.role === Status.Volunteer);
        this.numberOfVolunteers = this.developers.length;
        this.numberOfPublicProfiles = res.filter(vol => vol.status === Status.Active &&
          vol.role === Status.Volunteer && vol.publishFlag === Status.Yes).length;
      },
      error => console.error(error)
    );
  }

  // Google maps
  private getOrganizations(): void {
    this.usersSubscription = this.oService.getOrganizations()
    .subscribe(
      res => {
        this.organizations = res.filter(org => org.status === Status.Active);
        this.numberOfOrganization = this.organizations.length;
      },
      error => console.error(error)
    );
  }

  private getProjects(): void {
    this.usersSubscription = this.projectService.getAllProjects()
    .subscribe(
      res => {
        this.allProjects = res.filter(vol => vol.status === Status.Active);
        this.numberOfProjects = this.allProjects.length;
      },
      error => console.error(error)
    );
  }

  private getTotalCountries(): void {
    this.usersSubscription = this.oService.getTotalCountries()
    .subscribe(
      res => {
        this.numberOfCountries = res.total;
      },
      error => console.error(error)
    );
  }

  public getCountryName(countryCode): string {
    const countries = this.constantsService.getCountries();
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      return country.name;
    } else {
      return '';
    }
  }

  handleMarkerMouseOver(event): void {
    if (this.activeInfoWindow) {
      this.activeInfoWindow.forEach(function (infoWindow) {
        return infoWindow.close();
      });
    }

    const window = event.target.infoWindow;
    this.activeInfoWindow = window;
    window.forEach(function (infoWindow) {
      return infoWindow.open();
    });
  }

  loadProjects(): void {
    // This URL is used as dummy URL
    this.router.navigate(['/project/list', 'reload'], {skipLocationChange: true});
    setTimeout(() => this.router.navigate(['/project/list/projects']));
  }

  loadVolunteers(): void {
    // This URL is used as dummy URL
    this.router.navigate(['/user/list', { from: 'reload' }], {skipLocationChange: true});
    setTimeout(() => this.router.navigate(['/user/list']));
  }

}
