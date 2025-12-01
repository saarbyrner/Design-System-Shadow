import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  calculateWorkload,
  getFormErrors,
  getInitialAthleteFilters,
} from '../utils';

setI18n(i18n);

describe('calculateWorkload', () => {
  it('returns the workload when the duration and rpe exist', () => {
    expect(calculateWorkload('10', '2')).toBe(20);
  });

  it('returns 0 when the duration is null', () => {
    expect(calculateWorkload('10', null)).toBe(0);
  });

  it('returns 0 when the rpe is null', () => {
    expect(calculateWorkload(null, '5')).toBe(0);
  });
});

describe('getFormErrors', () => {
  it('returns isValid: true and an empty list of errors when the form is valid', () => {
    const { errors, isFormValid } = getFormErrors([
      {
        athlete_id: '1',
        rpe: 5,
        duration: 30,
      },
      {
        athlete_id: '2',
        rpe: 5,
        duration: 30,
      },
    ]);
    expect(isFormValid).toBe(true);
    expect(errors['1']).toEqual([]);
    expect(errors['2']).toEqual([]);
  });

  it('returns an error when the RPE is not an integer', () => {
    const { errors, isFormValid } = getFormErrors([
      {
        athlete_id: '1',
        rpe: 9.5,
        duration: 30,
      },
    ]);

    expect(isFormValid).toBe(false);
    expect(errors['1']).toEqual(['RPE must be an integer']);
  });

  it('returns an error when the RPE is not between 0 to 10', () => {
    const { errors, isFormValid } = getFormErrors([
      {
        athlete_id: '1',
        rpe: 11,
        duration: 30,
      },
    ]);

    expect(isFormValid).toBe(false);
    expect(errors['1']).toEqual(['RPE must be between 0 and 10 (inclusive)']);
  });

  it('returns an error when the duration is negative', () => {
    const { errors, isFormValid } = getFormErrors([
      {
        athlete_id: '1',
        rpe: 9,
        duration: -30,
      },
    ]);

    expect(isFormValid).toBe(false);
    expect(errors['1']).toEqual([
      'Duration must be greater than or equal to 0',
    ]);
  });

  describe('when rpe-0-12-w-fractions is enabled', () => {
    beforeEach(() => {
      window.getFlag = jest.fn(() => true);
    });

    afterEach(() => {
      window.getFlag.mockRestore();
    });

    it('returns an error when the RPE is not between 0 to 12', () => {
      const { errors, isFormValid } = getFormErrors([
        {
          athlete_id: '1',
          rpe: 13,
          duration: 30,
        },
      ]);

      expect(isFormValid).toBe(false);
      expect(errors['1']).toEqual(['RPE must be between 0 and 12 (inclusive)']);
    });
  });
});

describe('getInitialAthleteFilters', () => {
  it('returns all the athletes filtered for each squad', () => {
    const availableSquads = [
      {
        id: 8,
        name: 'Squad 1',
      },
      {
        id: 73,
        name: 'Squad 2',
      },
    ];

    const participants = [
      {
        athlete_id: 1,
        squads: [73, 8],
      },
      {
        athlete_id: 2,
        squads: [73],
      },
      {
        athlete_id: 3,
        squads: [8],
      },
    ];

    expect(getInitialAthleteFilters(availableSquads, participants)).toEqual([
      {
        squadId: 8,
        filteredAthletes: [1, 3],
      },
      {
        squadId: 73,
        filteredAthletes: [1, 2],
      },
    ]);
  });
});
