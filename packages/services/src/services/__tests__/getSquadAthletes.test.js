import serverResponseSquadAthletes from '@kitman/services/src/mocks/handlers/getSquadAthletes/squadAthletesData.mock';
import serverResponseSquadAthletesMinimal from '@kitman/services/src/mocks/handlers/getSquadAthletes/squadAthleteListMinimalAthletesData.mock';
import serverResponseSquadAthletesList from '@kitman/services/src/mocks/handlers/getSquadAthletes/squadAthleteListData.mock';

import $ from 'jquery';
import getSquadAthletes from '../getSquadAthletes';

describe('getSquadAthletes', () => {
  let request;

  describe('when athleteList is false', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      request = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(serverResponseSquadAthletes)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getSquadAthletes();

      expect(returnedData).toEqual(serverResponseSquadAthletes);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/squad_athletes',
        data: {
          include_previous_organisation_information: false,
          minimal: false,
          refresh_cache: false,
        },
      });
    });

    it('calls the endpoint with correct value passed for refreshCache', async () => {
      const returnedData = await getSquadAthletes({ refreshCache: true });

      expect(returnedData).toEqual(serverResponseSquadAthletes);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/squad_athletes',
        data: {
          include_previous_organisation_information: false,
          minimal: false,
          refresh_cache: true,
        },
      });
    });
  });
  describe('when athleteList is true', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      request = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(serverResponseSquadAthletesList)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getSquadAthletes({
        athleteList: true,
      });

      expect(returnedData).toEqual(serverResponseSquadAthletesList);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/squad_athletes/athlete_list',
        data: {
          include_previous_organisation_information: false,
          minimal: false,
        },
      });
    });
  });
  describe('when athleteList is true minimalAthleteListData is true', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      request = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(serverResponseSquadAthletesMinimal)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getSquadAthletes({
        athleteList: true,
        minimalAthleteListData: true,
      });

      expect(returnedData).toEqual(serverResponseSquadAthletesMinimal);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/squad_athletes/athlete_list',
        data: {
          include_previous_organisation_information: false,
          minimal: true,
        },
      });
    });
  });
  describe('when athleteList is true include_previous_organisation_information is true', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      request = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve(serverResponseSquadAthletesMinimal)
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getSquadAthletes({
        athleteList: true,
        includePreviousOrganisationInformation: true,
      });

      expect(returnedData).toEqual(serverResponseSquadAthletesMinimal);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/squad_athletes/athlete_list',
        data: {
          include_previous_organisation_information: true,
          minimal: false,
        },
      });
    });
  });
});
