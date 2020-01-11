import { TestBed } from '@angular/core/testing';

import { VehicleListQueryService } from './vehicle-list-query.service';

describe('VehicleListQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VehicleListQueryService = TestBed.get(VehicleListQueryService);
    expect(service).toBeTruthy();
  });
});
