/*
 Organization service tests.
 The Organization service uses http to retrieve data from the server.  We'll mock the http service,
 since we don't want to go to the server in unit tests, and we're not here to test the http service itself.

 We expect that the service will return a list of organizations as an array of organization objects.
 */

import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrganizationService } from './organization.service';
import { AuthService } from '../../auth.service';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrganizationService,
        AuthService
      ]
    });
    service = TestBed.get(OrganizationService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getOrganizations should return an observable', () => {
    // our API returns data as an array of organizations, so mock that structure
    const mockResponse = [
      { id: 1, name: 'Org 1', logo: 'logo_1', briefDescription: 'bd 1', description: null },
      { id: 2, name: 'Org 2', logo: 'logo_2', briefDescription: 'bd 2', description: null },
      { id: 3, name: 'Org 3', logo: 'logo_3', briefDescription: 'bd 3', description: null }
    ];
    service.getOrganizations().subscribe(
      res => {
        const orgs = res;
        expect(orgs.length).toBe(3);
        expect(orgs[0].description).toEqual(null);
        expect(orgs[1].name).toEqual('Org 2');
      });
    const req = httpMock.expectOne({ method: 'GET' });
    expect(req.request.url).toMatch('/api/organizations');
    req.flush(mockResponse);

  });

  it('getOrganization should return an observable', () => {

    // our API returns data as an array of organizations, so mock that structure
    const mockResponse = {
      id: 2,
      name: 'Org 2',
      logo: 'logo_2',
      briefDescription: 'bd 2',
      description: null
    };
    // Call our service.  It should return an observable that we can subscribe to and get data
    service.getOrganization(2).subscribe((res) => {
      const org = res;
      expect(org.description).toEqual(null);
      expect(org.name).toEqual('Org 2');
    });
    const req = httpMock.expectOne({ method: 'GET' });
    expect(req.request.url).toMatch('/api/organizations/2');
    req.flush(mockResponse);

  });
});
