import { Injectable } from '@angular/core';

// This service is meant to be used to share data when switching components
@Injectable()
export class DataService {

  // When searching for projects by keyword on the home page, the app needs
  // to switch routes while preserving some information about the projects
  // that were searched for. That information should  be stored in this variable
  keyword: string;

}
