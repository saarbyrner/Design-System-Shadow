import {
  getPersistedMedicalFilters,
  setPersistedMedicalFilters,
} from '../filters';

describe('medical filters utils', () => {
  let sessionStorageMock;

  beforeAll(() => {
    sessionStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
      removeItem: jest.fn(),
      length: 0,
    };
    Object.defineProperty(window, 'localStorage', {
      value: sessionStorageMock,
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
    });
  });

  describe('getPersistedFilterField', () => {
    const filters = {
      date_range: {
        start_date: '2022-07-22T00:00:00Z',
        end_date: '2022-07-30T00:00:00Z',
      },
    };
    beforeEach(() => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify(filters));
    });

    it('overwrites a default value if one is present', () => {
      const defaultValues = {
        athlete_id: 12,
        date_range: {
          start_date: 'YYYY-MM-DDTHH:mm:ssZ',
          end_date: 'YYYY-MM-DDTHH:mm:ssZ',
        },
      };

      expect(getPersistedMedicalFilters(defaultValues, ['date_range'])).toEqual(
        {
          athlete_id: 12,
          date_range: {
            start_date: '2022-07-22T00:00:00Z',
            end_date: '2022-07-30T00:00:00Z',
          },
        }
      );
    });
  });

  describe('setPersistedFilterField', () => {
    it('sets the fields supplied in fields', () => {
      const filter = {
        athlete_id: 12,
        date_range: {
          start_date: '2022-07-22T00:00:00Z',
          end_date: '2022-07-30T00:00:00Z',
        },
      };

      setPersistedMedicalFilters(['date_range'], filter);

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        expect.anything(),
        JSON.stringify({
          date_range: {
            start_date: '2022-07-22T00:00:00Z',
            end_date: '2022-07-30T00:00:00Z',
          },
        })
      );
    });
  });

  describe('setPersistedMedicalFilters with scopeToLevel prop', () => {
    it('sets the fields supplied in fields', () => {
      const newValues = {
        date_range: {
          start_date: '2022-07-22T00:00:00Z',
          end_date: '2022-07-30T00:00:00Z',
        },
        squads: [3],
        availabilities: ['Injured'],
      };

      setPersistedMedicalFilters(
        ['date_range', 'squads', 'availabilities'],
        newValues,
        'roster'
      );

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        expect.anything(),
        JSON.stringify({
          date_range: {
            start_date: '2022-07-22T00:00:00Z',
            end_date: '2022-07-30T00:00:00Z',
          },
          squads: [3],
          availabilities: ['Injured'],
        })
      );

      expect(
        getPersistedMedicalFilters(
          {
            date_range: {
              start_date: '2022-07-22T00:00:00Z',
              end_date: '2022-07-30T00:00:00Z',
            },
            squads: [3],
            availabilities: ['Injured'],
          },
          ['date_range', 'squads', 'availabilities'],
          'roster'
        )
      ).toEqual({
        date_range: {
          start_date: '2022-07-22T00:00:00Z',
          end_date: '2022-07-30T00:00:00Z',
        },
        squads: [3],
        availabilities: ['Injured'],
      });
    });
  });
});
