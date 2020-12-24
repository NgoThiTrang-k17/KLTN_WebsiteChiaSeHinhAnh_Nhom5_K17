/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { _authService } from './_auth.service';

describe('Service: _auth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [_authService]
    });
  });

  it('should ...', inject([_authService], (service: _authService) => {
    expect(service).toBeTruthy();
  }));
});
