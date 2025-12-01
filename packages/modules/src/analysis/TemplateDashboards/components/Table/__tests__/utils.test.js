import {
  formatGrowthAndMaturationData,
  getAthleteById,
  getGrowthAndMaturationColumns,
  sortData,
  formatCSVData,
} from '../utils';
import { mockRows, mockSquadAthletes, testCases } from './testUtils';

describe('TemplateDashboards|TableUtils', () => {
  afterAll(() => {
    window.featureFlags = {};
  });

  describe('formatGrowthAndMaturationData', () => {
    const mockRow = mockRows[0];

    it('returns the formatted data', () => {
      testCases.forEach(({ input, expected }) => {
        expect(formatGrowthAndMaturationData(mockRow, input)).toBe(expected);
      });
    });
  });

  describe('getAthleteById', () => {
    const expectedAthlete = {
      id: 50980,
      firstname: 'A Athlete',
      lastname: 'One',
      fullname: 'A Athlete One',
      shortname: 'A. One',
      user_id: 1,
      avatar_url: 'url_string',
    };

    it('should return the expected athlete', () => {
      expect(getAthleteById(mockSquadAthletes, 50980)).toEqual(expectedAthlete);
    });
  });

  describe('getGrowthAndMaturationColumns', () => {
    beforeEach(() => {
      window.featureFlags = {};
    });

    describe('when "mirwald-calculation" FF is on', () => {
      it('returns the list of columns including the mirwald columns', () => {
        window.featureFlags = { 'mirwald-calculation': true };
        expect(getGrowthAndMaturationColumns()).toMatchSnapshot();
      });
    });

    describe('when "mirwald-calculation" FF is off', () => {
      it('returns the list of columns excluding the mirwald columns', () => {
        window.featureFlags = { 'mirwald-calculation': false };
        expect(getGrowthAndMaturationColumns()).toMatchSnapshot();
      });
    });

    describe('when ‘g-and-m-new-columns’ FF is on', () => {
      it('returns the list of columns including additional g&m columns', () => {
        window.featureFlags = {
          'g-and-m-new-columns': true,
        };
        expect(getGrowthAndMaturationColumns()).toMatchSnapshot();
      });
    });

    describe('when ‘g-and-m-new-columns’ FF is off', () => {
      it('doesn’t return the list of columns excluding additional g&m columns', () => {
        window.featureFlags = {
          'g-and-m-new-columns': false,
        };
        expect(getGrowthAndMaturationColumns()).toMatchSnapshot();
      });
    });

    describe('when ‘growth-and-maturation-pl-configuration’ FF is on', () => {
      it('returns the list of columns including estimated adult height lower and higher confidence columns', () => {
        window.featureFlags = {
          'growth-and-maturation-pl-configuration': true,
        };
        expect(getGrowthAndMaturationColumns()).toMatchSnapshot();
      });
    });

    describe('when ‘growth-and-maturation-pl-configuration’ FF is off', () => {
      it('doesn’t return the list of columns including estimated adult height lower and higher confidence columns', () => {
        window.featureFlags = {
          'growth-and-maturation-pl-configuration': false,
        };
        expect(getGrowthAndMaturationColumns()).toMatchSnapshot();
      });
    });
  });

  describe('sortData', () => {
    it('returns rows unsorted as default', () => {
      const actual = sortData(
        mockRows,
        mockSquadAthletes,
        'DEFAULT',
        undefined
      );
      expect(actual).toEqual(mockRows);
    });

    it('sorts for "ASC" for athlete_id', () => {
      expect(
        sortData(mockRows, mockSquadAthletes, 'ASC', 'athlete_id')
      ).toMatchSnapshot();
    });

    it('sorts for "ASC" for other props', () => {
      expect(
        sortData(
          mockRows,
          mockSquadAthletes,
          'ASC',
          'g_and_m_percent_adult_height_att'
        )
      ).toMatchSnapshot();
    });

    it('sorts for "DESC" for athlete_id', () => {
      expect(
        sortData(mockRows, mockSquadAthletes, 'DESC', 'athlete_id')
      ).toMatchSnapshot();
    });

    it('sorts for "DESC" for other props', () => {
      expect(
        sortData(
          mockRows,
          mockSquadAthletes,
          'DESC',
          'g_and_m_percent_adult_height_att'
        )
      ).toMatchSnapshot();
    });
  });

  describe('formatCSVData', () => {
    beforeEach(() => {
      window.featureFlags = {};
    });

    describe('when "mirwald-calculation" FF is on', () => {
      it('formats table data', () => {
        window.featureFlags = { 'mirwald-calculation': true };
        expect(formatCSVData(mockSquadAthletes, mockRows)).toMatchSnapshot();
      });
    });

    describe('when "mirwald-calculation" FF is off', () => {
      it('formats table data', () => {
        window.featureFlags = { 'mirwald-calculation': false };
        expect(formatCSVData(mockSquadAthletes, mockRows)).toMatchSnapshot();
      });
    });

    describe('when ‘g-and-m-new-columns’ FF is on', () => {
      it('formats table data correctly', () => {
        window.featureFlags = {
          'g-and-m-new-columns': true,
        };
        expect(formatCSVData(mockSquadAthletes, mockRows)).toMatchSnapshot();
      });
    });

    describe('when ‘g-and-m-new-columns’ FF is off', () => {
      it('formats table data correctly', () => {
        window.featureFlags = {
          'g-and-m-new-columns': false,
        };
        expect(formatCSVData(mockSquadAthletes, mockRows)).toMatchSnapshot();
      });
    });
  });
});
