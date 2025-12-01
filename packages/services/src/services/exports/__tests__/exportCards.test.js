import { axios } from '@kitman/common/src/utils/services';
import { data as exportCardsHandlerResponse } from '@kitman/services/src/mocks/handlers/exports/exportCards';
import {
  exportStaffCards,
  exportAthleteCards,
  exportYellowCards,
  exportRedCards,
} from '../exportCards';

describe('exportCards', () => {
  describe('exportStaffCards', () => {
    let exportStaffCardsRequest;

    beforeEach(() => {
      exportStaffCardsRequest = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('return the correct response value', async () => {
      const result = await exportStaffCards({ competitionIds: [] });

      expect(result).toEqual(exportCardsHandlerResponse.staffCards);
      expect(exportStaffCardsRequest).toHaveBeenCalledTimes(1);
      expect(exportStaffCardsRequest).toHaveBeenCalledWith(
        '/export_jobs/mls_staff_cards_export',
        {
          competition_ids: [],
        }
      );
    });
  });

  describe('exportAthleteCards', () => {
    let exportAthleteCardsRequest;

    beforeEach(() => {
      exportAthleteCardsRequest = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('return the correct response value', async () => {
      const result = await exportAthleteCards({ competitionIds: [] });

      expect(result).toEqual(exportCardsHandlerResponse.athleteCards);
      expect(exportAthleteCardsRequest).toHaveBeenCalledTimes(1);
      expect(exportAthleteCardsRequest).toHaveBeenCalledWith(
        '/export_jobs/mls_athlete_cards_export',
        {
          competition_ids: [],
        }
      );
    });
  });

  describe('exportYellowCards', () => {
    let exportCardsRequest;

    beforeEach(() => {
      exportCardsRequest = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('return the correct response value', async () => {
      const result = await exportYellowCards({
        competitions: [],
        dateRange: {},
        search_expression: '',
      });

      expect(result).toEqual(exportCardsHandlerResponse.yellowCards);
      expect(exportCardsRequest).toHaveBeenCalledTimes(1);
      expect(exportCardsRequest).toHaveBeenCalledWith(
        '/export_jobs/yellow_cards_export',
        {
          filter: {
            competitions: [],
            date_range: {},
            search_expression: '',
          },
        }
      );
    });
  });
  describe('exportRedCards', () => {
    let exportCardsRequest;

    beforeEach(() => {
      exportCardsRequest = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('return the correct response value', async () => {
      const result = await exportRedCards({
        competitions: [],
        dateRange: {},
        search_expression: '',
      });

      expect(result).toEqual(exportCardsHandlerResponse.redCards);
      expect(exportCardsRequest).toHaveBeenCalledTimes(1);
      expect(exportCardsRequest).toHaveBeenCalledWith(
        '/export_jobs/red_cards_export',
        {
          filter: {
            competitions: [],
            date_range: {},
            search_expression: '',
          },
        }
      );
    });
  });
});
