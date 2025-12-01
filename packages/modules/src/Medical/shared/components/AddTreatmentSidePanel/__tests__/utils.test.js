import moment from 'moment-timezone';

import {
  getInitialTimezoneValue,
  removeTreatment,
  selectReason,
  updateTreatmentAttribute,
  selectBodyArea,
  createTreatmentTemplate,
  updateIsBillable,
} from '../utils';

import mockDuplicateTreatment from '../mocks/mockDuplicateTreatment';

describe('AddTreatmentSidePanel utils', () => {
  beforeEach(() => {
    document.body.dataset.timezone = 'Europe/Dublin';
    moment.tz.setDefault('Europe/Dublin');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('returns the correct timezone', () => {
    const result = getInitialTimezoneValue();
    expect(result).toBe('Europe/Dublin');
  });

  it('returns the correct reason values', () => {
    const result = selectReason([...mockDuplicateTreatment.treatments], 0, {
      reason: 'so reason',
      issue_type: null,
      issue_id: null,
    });
    expect(result[0].reason).toStrictEqual('so reason');
  });

  it('updates the correct attribute', () => {
    const result = updateTreatmentAttribute(
      [...mockDuplicateTreatment.treatments],
      0,
      'duration',
      50
    );
    expect(result[0].duration).toStrictEqual(50);
  });

  it('selects the correct body area', () => {
    const mockBodyArea = {
      id: 1,
      treatable_area_type: 'Emr::Private::Models::OsicsBrainArea',
      treatable_area: {
        id: 1,
        name: 'Brain',
      },
      side: {
        id: 1,
        name: 'Left',
      },
      name: 'Left Brain',
    };
    const result = selectBodyArea(
      [...mockDuplicateTreatment.treatments],
      0,
      mockBodyArea
    );
    expect(result[0].treatment_body_areas).toStrictEqual(mockBodyArea);
  });

  it('removes a treatment', () => {
    const result = removeTreatment(
      [
        mockDuplicateTreatment.treatments[0],
        mockDuplicateTreatment.treatments[0],
        mockDuplicateTreatment.treatments[0],
      ],
      0
    );
    expect(result.length).toBe(2);
  });

  it('creates a treatment template', () => {
    const result = createTreatmentTemplate([
      mockDuplicateTreatment.treatments[0],
      mockDuplicateTreatment.treatments[0],
    ]);
    expect(result.length).toBe(3);
  });

  it('updates the billable state', () => {
    const result = updateIsBillable(
      [
        mockDuplicateTreatment.treatments[0],
        mockDuplicateTreatment.treatments[0],
      ],
      0,
      true
    );
    expect(result[0].is_billable).toBe(true);
  });
});
