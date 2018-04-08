/*
 Organization service tests.
 The Organization service uses http to retrieve data from the server.  We'll mock the http service,
 since we don't want to go to the server in unit tests, and we're not here to test the http service itself.

 We expect that the service will return a list of organizations as an array of organization objects.
 */

import { TestBed, inject } from '@angular/core/testing';
import {
  BaseRequestOptions,
  HttpModule,
  JsonpModule,
  Http,
  Response,
  ResponseOptions
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { OrganizationService } from './organization.service';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

describe('OrganizationService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, JsonpModule],
      providers: [
        OrganizationService,
        {
          provide: Http,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
                provide: AuthHttp,
                useFactory: (http) => {
                    return new AuthHttp(new AuthConfig(), http);
                },
                deps: [Http]
            },
        MockBackend,
        BaseRequestOptions
      ]
    });
  });

  it('getOrganizations should return an observable',
    inject([OrganizationService, MockBackend], (organizationService, mockBackend) => {

      // our API returns data as an array of organizations, so mock that structure
      const mockResponse = [
        {id: 1, name: 'Org 1', logo: 'logo_1', briefDescription: 'bd 1', detailedDescription: null},
        {id: 2, name: 'Org 2', logo: 'logo_2', briefDescription: 'bd 2', detailedDescription: null},
        {id: 3, name: 'Org 3', logo: 'logo_3', briefDescription: 'bd 3', detailedDescription: null}
      ];

      // fake the http response.  we're not testing http here, just testing the organization service
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      // Call our service.  It should return an observable that we can subscribe to and get data
      organizationService.getOrganizations()
                         .subscribe(res => {
                             const orgs = res;
                             expect(orgs.length).toBe(3);
                             expect(orgs[0].detailedDescription).toEqual(null);
                             expect(orgs[1].name).toEqual('Org 2');
                           }
                         );
    })
  );

  it('getOrganization should return an observable',
    inject([OrganizationService, MockBackend], (organizationService, mockBackend) => {

      // our API returns data as an array of organizations, so mock that structure
      const mockResponse = {
        id: 2,
        name: 'Org 2',
        logo: 'logo_2',
        briefDescription: 'bd 2',
        detailedDescription: null
      };

      // fake the http response.  we're not testing http here, just testing the organization service
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      // Call our service.  It should return an observable that we can subscribe to and get data
      organizationService.getOrganization(2)
                         .subscribe(res => {
                             const org = res;
                             expect(org.detailedDescription).toEqual(null);
                             expect(org.name).toEqual('Org 2');
                           }
                         );
    })
  );
  /*
  it('searchOrganizations should return an observable',
    inject([OrganizationService, MockBackend], (organizationService, mockBackend) => {

      // our API returns data as an array of organizations, so mock that structure
      const mockResponse = [
        {id: 1, name: 'Org 1', logo: 'logo_1', briefDescription: 'bd 1', detailedDescription: null},
        {id: 2, name: 'Org 2', logo: 'logo_2', briefDescription: 'bd 2', detailedDescription: null},
        {id: 3, name: 'Org 3', logo: 'logo_3', briefDescription: 'bd 3', detailedDescription: null}
      ];

      // fake the http response.  we're not testing http here, just testing the organization service
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      // Call our service.  It should return an observable that we can subscribe to and get data
      organizationService.searchOrganizations('Org')
                         .subscribe(res => {
                             const orgs = res;
                             expect(orgs.length).toBe(3);
                             expect(orgs[0].detailedDescription).toEqual(null);
                             expect(orgs[1].name).toEqual('Org 2');
                           }
                         );
    })
  );*/
});
