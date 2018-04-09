import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { User } from '../../user/common/user';
import { UserService } from '../../user/common/user.service';
import { JobTitle } from './job-title';

@Component({
  selector: 'my-job-title',
  templateUrl: './job-title.component.html',
  styleUrls: ['./job-title.component.css']
})

export class JobTitleComponent implements OnInit {
  @Input() titleHolder: any;

  jobTitles: JobTitle[];
  jobTitleName: string;
  jobTitleIcon: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.titleHolder.jobTitleId) {
      this.getJobTitles();
      this.getJobTitleIcon();
    }
  }

  getJobTitles(): void {
    this.userService.getAllJobTitles().subscribe(res => {
      this.jobTitles = res;
      this.getJobTitleById();
    },
      error => console.error(error)
    );
  }

  getJobTitleById(): void {
    this.jobTitles.forEach(jt => {
      if (jt.id === this.titleHolder.jobTitleId) {
        this.jobTitleName =  jt.jobTitle;
      }
    });
  }

  getJobTitleIcon(): void {
    // icons from material.io/icons
    if (this.titleHolder.jobTitleId) {
      switch (this.titleHolder.jobTitleId) {
        case 1:
          // Software Development
          this.jobTitleIcon = 'code';
          break;
        case 2:
          // UI/UX Design
          this.jobTitleIcon = 'mouse';
          break;
        case 6:
          // Business Analysis
          this.jobTitleIcon = 'insert_chart';
          break;
        case 7:
          // Project Management
          this.jobTitleIcon = 'supervisor_account';
          break;
        case 8:
          // Marketing & Communications
          this.jobTitleIcon = 'phone_in_talk';
          break;
        case 9:
          // Technical/Blog Writing
          this.jobTitleIcon = 'keyboard';
          break;
        case 10:
          // Graphic Design/Video Production
          this.jobTitleIcon = 'color_lens';
          break;
        case 11:
          // Other
          this.jobTitleIcon = 'all_inclusive';
          break;
      }
    }
  }
}
