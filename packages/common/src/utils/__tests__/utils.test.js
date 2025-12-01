import moment from 'moment';
import { buildAthlete } from '../test_utils';
import {
  groupAthletesByPosition,
  groupAthletesByPositionGroup,
  groupAthletesByScreening,
  groupAthletesByAvailability,
  getFilteredAthletes,
  formatDate,
  containsAnEmoji,
  getAlarmColour,
  getGroupOrderingByType,
  parseNoteMedicalTypeOptions,
  getValidHref,
  arraysAreNotEqual,
  getSquadFromPath,
} from '../index';
import {
  RESPONSIBLE_SQUADS,
  UNMATCHED_ROUTE,
} from '../../config/responsibleSquads';

describe('shared utils', () => {
  let { athlete1, athlete2, athlete3, athlete4 } = {};

  const orderedPositions = ['Winger', 'Blindside Flanker', 'Prop'];

  beforeAll(() => {
    athlete1 = buildAthlete({
      id: 1,
      firstname: 'John',
      lastname: 'Smith',
      position: 'Prop',
      positionId: 50,
      positionGroup: 'Forward',
      positionGroupId: 99,
      availability: 'available',
      squad_ids: ['10', '50'],
      screened_today: true,
      last_screening: moment().format(),
    });

    athlete2 = buildAthlete({
      id: 2,
      firstname: 'Sarah',
      lastname: 'Collins',
      position: 'Winger',
      positionId: 51,
      positionGroup: 'Back',
      positionGroupId: 98,
      availability: 'unavailable',
      squad_ids: ['10', '11'],
      screened_today: true,
      last_screening: moment().subtract(1, 'hours').format(),
    });

    athlete3 = buildAthlete({
      id: 3,
      firstname: 'Jobe',
      lastname: 'Brown',
      position: 'Blindside Flanker',
      positionId: 52,
      positionGroup: 'Back',
      positionGroupId: 98,
      availability: 'returning',
      squad_ids: ['20'],
      screened_today: true,
      last_screening: moment().subtract(2, 'hours').format(),
    });

    athlete4 = buildAthlete({
      id: 4,
      firstname: 'Frank',
      lastname: 'carlson', // N.B. lower 'c' should come before 'Smith'
      position: 'Prop',
      positionId: 53,
      positionGroup: 'Forward',
      positionGroupId: 99,
      availability: 'injured',
      squad_ids: ['20'],
      screened_today: false,
      last_screening: moment().subtract(1, 'days').format(),
    });
  });

  describe('#groupAthletesByPosition()', () => {
    it('groups athletes correctly and sorts each group by lastname, firstname', () => {
      const unGroupedAthletes = [athlete1, athlete2, athlete3, athlete4];
      const expected = {
        Winger: [athlete2],
        'Blindside Flanker': [athlete3],
        Prop: [athlete4, athlete1],
      };

      expect(groupAthletesByPosition(unGroupedAthletes)).toEqual(expected);
    });
  });

  describe('#groupAthletesByPositionGroup()', () => {
    it('groups athletes correctly and sorts each group by position, lastname, firstname', () => {
      const unGroupedAthletes = [athlete1, athlete2, athlete3, athlete4];
      const expected = {
        Back: [athlete2, athlete3],
        Forward: [athlete4, athlete1],
      };

      expect(
        groupAthletesByPositionGroup(unGroupedAthletes, orderedPositions)
      ).toEqual(expected);
    });
  });

  describe('#groupAthletesByScreening()', () => {
    it('groups athletes correctly and sorts each group by lastname, firstname', () => {
      const unGroupedAthletes = [athlete1, athlete2, athlete3, athlete4];
      const expected = {
        screened: [athlete3, athlete2, athlete1],
        not_screened: [athlete4],
      };

      expect(groupAthletesByScreening(unGroupedAthletes)).toEqual(expected);
    });
  });

  describe('#groupAthletesByAvailability()', () => {
    it('groups athletes correctly and sorts each group by lastname, firstname', () => {
      const unGroupedAthletes = [athlete1, athlete2, athlete3, athlete4];
      const expected = {
        unavailable: [athlete2],
        injured: [athlete4],
        returning: [athlete3],
        available: [athlete1],
      };

      expect(groupAthletesByAvailability(unGroupedAthletes)).toEqual(expected);
    });
  });

  describe('#getFilteredAthletes()', () => {
    let groupedAthletes = {};

    beforeAll(() => {
      groupedAthletes = {
        group1: [athlete1],
        group2: [athlete2, athlete3, athlete4],
      };
    });

    it('should return athletes based on a search term', () => {
      expect(getFilteredAthletes(groupedAthletes, 'Jo')).toEqual({
        group1: [athlete1],
        group2: [athlete3],
      });
    });

    it('should return athletes based on a squad filter', () => {
      expect(getFilteredAthletes(groupedAthletes, '', '20')).toEqual({
        group1: [],
        group2: [athlete3, athlete4],
      });
    });

    it('should return athletes based on an athlete filter', () => {
      expect(getFilteredAthletes(groupedAthletes, '', '', [], [2])).toEqual({
        group1: [],
        group2: [athlete2],
      });
    });

    it('should return athletes based on multiple athlete filters', () => {
      expect(getFilteredAthletes(groupedAthletes, '', '', [], [2, 99])).toEqual(
        {
          group1: [athlete1],
          group2: [athlete2, athlete4],
        }
      );
    });

    it('should return athletes based on a search term and an athlete filter', () => {
      expect(getFilteredAthletes(groupedAthletes, 'Bro', '', [], [98])).toEqual(
        {
          group1: [],
          group2: [athlete3],
        }
      );
    });

    it('should return athletes based on a squad filter and an athlete filter', () => {
      expect(getFilteredAthletes(groupedAthletes, '', '10', [], [50])).toEqual({
        group1: [athlete1],
        group2: [athlete2],
      });
    });

    it('should return athletes based on a search term and a squad filter', () => {
      expect(getFilteredAthletes(groupedAthletes, 'Jo', '10')).toEqual({
        group1: [athlete1],
        group2: [],
      });
    });

    it('should return athletes based on a search term, a squad filter and an athlete filter', () => {
      expect(
        getFilteredAthletes(groupedAthletes, 'Smi', '10', [], [98])
      ).toEqual({
        group1: [athlete1],
        group2: [],
      });
    });

    describe('when the athlete has an alarm triggered', () => {
      beforeEach(() => {
        athlete2.status_data = {
          alarmId_1: {
            alarms: ['triggeredAlarm'],
          },
        };
      });

      it('should return athletes based on an alarm filter', () => {
        expect(
          getFilteredAthletes(groupedAthletes, '', '', ['inAlarm'])
        ).toEqual({
          group1: [],
          group2: [athlete2],
        });
      });

      it('should return athletes based on a search term and an alarm filter', () => {
        expect(
          getFilteredAthletes(groupedAthletes, 'Jo', '', ['noAlarms'])
        ).toEqual({
          group1: [athlete1],
          group2: [athlete3],
        });
      });

      it('should return athletes based on an alarm filter and an athlete filter', () => {
        expect(
          getFilteredAthletes(groupedAthletes, '', '', ['noAlarms'], [99])
        ).toEqual({
          group1: [athlete1],
          group2: [athlete4],
        });
      });
    });

    describe('when the athlete has status data', () => {
      beforeEach(() => {
        athlete1.status_data = {
          status_1234: {
            value: 70,
            raw_value: 100,
          },
        };
        athlete2.status_data = {
          status_1234: {
            value: 60,
            raw_value: 10,
          },
        };
        athlete3.status_data = {
          status_1234: {
            value: 80,
            raw_value: 140,
          },
        };
        athlete4.status_data = {
          status_1234: {
            value: 20,
            raw_value: 430,
          },
        };
      });

      it('should return sorted athletes from low to high', () => {
        expect(
          getFilteredAthletes(
            groupedAthletes,
            '',
            null,
            [],
            [],
            'low_to_high',
            'status_1234',
            'kitman_variable'
          )
        ).toEqual({
          group1: [athlete1],
          group2: [athlete4, athlete2, athlete3],
        });
      });

      it('should return sorted athletes from high to low', () => {
        expect(
          getFilteredAthletes(
            groupedAthletes,
            '',
            null,
            [],
            [],
            'high_to_low',
            'status_1234',
            'kitman_variable'
          )
        ).toEqual({
          group1: [athlete1],
          group2: [athlete3, athlete2, athlete4],
        });
      });

      describe('when the sorted variable is sleep duration', () => {
        it('should return sorted athletes from low to high', () => {
          expect(
            getFilteredAthletes(
              groupedAthletes,
              '',
              null,
              [],
              [],
              'low_to_high',
              'status_1234',
              'kitman:tv|sleep_duration'
            )
          ).toEqual({
            group1: [athlete1],
            group2: [athlete2, athlete3, athlete4],
          });
        });

        it('should return sorted athletes from high to low', () => {
          expect(
            getFilteredAthletes(
              groupedAthletes,
              '',
              null,
              [],
              [],
              'high_to_low',
              'status_1234',
              'kitman:tv|sleep_duration'
            )
          ).toEqual({
            group1: [athlete1],
            group2: [athlete4, athlete3, athlete2],
          });
        });
      });
    });
  });

  describe('.formatDate()', () => {
    beforeAll(() => {
      window.moment = moment;
    });

    afterAll(() => {
      delete window.moment;
    });

    it('formats the date respecting the proper timezone offset', () => {
      const date = '2017-08-25T13:51:03-07:00';
      expect(formatDate(date)).toEqual('1:51 pm, 25 Aug 2017');
    });
  });
});

describe('containsAnEmoji', () => {
  describe("when the template name doesn't contain an emoji", () => {
    it('returns a validation object with {isValid} true', () => {
      const value = 'a value without emoji';

      const expected = {
        isValid: true,
        errorType: 'emoji',
        message: 'Emojis cannot be used :(',
      };

      expect(containsAnEmoji(value)).toEqual(expected);
    });
  });

  describe('when the template name contains an emoji', () => {
    it('returns a validation object with {isValid} false', () => {
      const value = 'a value with an emoji 🔪';

      const expected = {
        isValid: false,
        errorType: 'emoji',
        message: 'Emojis cannot be used :(',
      };

      expect(containsAnEmoji(value)).toEqual(expected);
    });
  });
});

describe('getAlarmColour(colourName)', () => {
  describe('when the colour name is colour1', () => {
    it('returns #f3a69e', () => {
      expect(getAlarmColour('colour1')).toEqual('#f3a69e');
    });
  });

  describe('when the colour name is colour2', () => {
    it('returns #f39c11', () => {
      expect(getAlarmColour('colour2')).toEqual('#f9ce88');
    });
  });

  describe('when the colour name is colour3', () => {
    it('returns #f8e187', () => {
      expect(getAlarmColour('colour3')).toEqual('#f8e187');
    });
  });

  describe('when the colour name is colour4', () => {
    it('returns #94d6b0', () => {
      expect(getAlarmColour('colour4')).toEqual('#94d6b0');
    });
  });

  describe('when the colour name is colour5', () => {
    it('returns rgba(231, 77, 61, 0.5)', () => {
      expect(getAlarmColour('colour5')).toEqual('#e74d3d');
    });
  });

  describe('when the colour name is colour6', () => {
    it('returns rgba(231, 77, 61, 0.5)', () => {
      expect(getAlarmColour('colour6')).toEqual('#f39c11');
    });
  });

  describe('when the colour name is colour7', () => {
    it('returns rgba(231, 77, 61, 0.5)', () => {
      expect(getAlarmColour('colour7')).toEqual('#f1c410');
    });
  });

  describe('when the colour name is colour8', () => {
    it('returns rgba(231, 77, 61, 0.5)', () => {
      expect(getAlarmColour('colour8')).toEqual('#29ae61');
    });
  });

  describe('when the colour name is null', () => {
    it('returns colour1 by default', () => {
      expect(getAlarmColour()).toEqual('#f3a69e');
    });
  });
});

describe('getGroupOrderingByType', () => {
  let positionsHashForGroupOrdering;

  beforeEach(() => {
    positionsHashForGroupOrdering = {
      position_group_order: [25, 26, 27],
      position_groups: {
        25: 'Forward',
        26: 'Back',
        27: 'Other',
      },
      position_order: [72, 71, 70, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83],
      positions: {
        70: 'Tight-head Prop',
        71: 'Hooker',
        72: 'Loose-head Prop',
        73: 'Second Row',
        74: 'Blindside Flanker',
        75: 'Openside Flanker',
        76: 'No. 8',
        77: 'Scrum Half',
        78: 'Out Half',
        79: 'Inside Centre',
        80: 'Outside Centre',
        81: 'Wing',
        82: 'Fullback',
        83: 'Other',
      },
    };
  });

  it('returns the correct group ordering by type', () => {
    const result = getGroupOrderingByType(positionsHashForGroupOrdering);
    expect(result).toEqual({
      position: [
        'Loose-head Prop',
        'Hooker',
        'Tight-head Prop',
        'Second Row',
        'Blindside Flanker',
        'Openside Flanker',
        'No. 8',
        'Scrum Half',
        'Out Half',
        'Inside Centre',
        'Outside Centre',
        'Wing',
        'Fullback',
        'Other',
      ],
      positionGroup: ['Forward', 'Back', 'Other'],
      availability: ['unavailable', 'injured', 'returning', 'available'],
      last_screening: ['screened', 'not_screened'],
      name: ['alphabetical'],
    });
  });
});

describe('parseNoteMedicalTypeOptions', () => {
  let medicalTypes;

  beforeEach(() => {
    medicalTypes = {
      Alergia: {
        Alergia: 'Allergy',
      },
      'Historico Medico': {
        'Exame de Sangue': 'Blood Test',
        'Dados Cardiacos': 'Cardiac Data',
      },
    };
  });

  it('returns the correct group ordering by type', () => {
    const result = parseNoteMedicalTypeOptions(medicalTypes);
    expect(result).toEqual([
      { isGroupOption: true, name: 'Alergia' },
      { name: 'Alergia', key_name: 'Allergy' },
      { isGroupOption: true, name: 'Historico Medico' },
      { name: 'Exame de Sangue', key_name: 'Blood Test' },
      { name: 'Dados Cardiacos', key_name: 'Cardiac Data' },
    ]);
  });
});

describe('getValidHref', () => {
  it('should return the url by including the http protocol when the url param includes the http protocol', () => {
    expect(getValidHref('http://www.google.com')).toEqual(
      'http://www.google.com'
    );
  });

  it('should return the url by including the https protocol when the url param includes the https protocol', () => {
    expect(getValidHref('https://www.google.com')).toEqual(
      'https://www.google.com'
    );
  });

  it('should return the url by including // at the beginning when the url param does not include any protocols', () => {
    expect(getValidHref('www.google.com')).toEqual('//www.google.com');
  });
});

describe('ArraysAreNotEqual', () => {
  it('should return false when arrays are equal', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];

    const result = arraysAreNotEqual(arr1, arr2);

    expect(result).toBe(false);
  });

  it('should return true when arrays are not equal', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];

    const result = arraysAreNotEqual(arr1, arr2);

    expect(result).toBe(true);
  });

  it('should handle arrays with different order', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [3, 2, 1];

    const result = arraysAreNotEqual(arr1, arr2);

    expect(result).toBe(true);
  });

  it('should handle arrays with different types', () => {
    const arr1 = [1, 'two', true];
    const arr2 = [1, 2, true];

    const result = arraysAreNotEqual(arr1, arr2);

    expect(result).toBe(true);
  });

  it('should return true for arrays with objects having null values', () => {
    const arr1 = [{ start: null, end: null }];
    const arr2 = [{ start: '2023-12-12T00:00:00+00:00', end: null }];

    const result = arraysAreNotEqual(arr1, arr2);

    expect(result).toBe(true);
  });

  it('should return false for identical arrays with objects having null values', () => {
    const arr1 = [{ start: null, end: null }];
    const arr2 = [{ start: null, end: null }];

    const result = arraysAreNotEqual(arr1, arr2);

    expect(result).toBe(false);
  });

  it('should return true for arrays with objects having different date values', () => {
    const arr1 = [{ start: '2023-12-12T00:00:00+00:00', end: null }];
    const arr2 = [{ start: '2024-01-01T00:00:00+00:00', end: null }];

    const result = arraysAreNotEqual(arr1, arr2);

    expect(result).toBe(true);
  });

  it('should return false for arrays with identical object date values', () => {
    const arr1 = [{ start: '2023-12-12T00:00:00+00:00', end: null }];
    const arr2 = [{ start: '2023-12-12T00:00:00+00:00', end: null }];

    const result = arraysAreNotEqual(arr1, arr2);

    expect(result).toBe(false);
  });
});

describe('getSquadFromPath', () => {
  it('returns the correct squad for a matching path', () => {
    expect(getSquadFromPath('/home_dashboards')).toBe(
      RESPONSIBLE_SQUADS.reporting
    );
    expect(getSquadFromPath('/calendar')).toBe(RESPONSIBLE_SQUADS.corePlatform);
    expect(getSquadFromPath('/medical/athletes')).toBe(
      RESPONSIBLE_SQUADS.performanceMedicine
    );
  });

  it('returns "Unmatched route" for a non-matching path', () => {
    expect(getSquadFromPath('/testPath')).toBe(UNMATCHED_ROUTE);
  });

  it('returns "Unknown Route" when path is undefined or null', () => {
    expect(getSquadFromPath(undefined)).toBe('Unknown Route');
    expect(getSquadFromPath(null)).toBe('Unknown Route');
  });

  it('returns the expected squad for the most specific matching route', () => {
    expect(getSquadFromPath('/athletes')).toBe(RESPONSIBLE_SQUADS.corePlatform);
    expect(getSquadFromPath('/athletes/reports')).toBe(
      RESPONSIBLE_SQUADS.reporting
    );
  });
});
