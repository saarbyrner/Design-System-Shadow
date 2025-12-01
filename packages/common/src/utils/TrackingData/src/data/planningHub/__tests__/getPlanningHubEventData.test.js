import { data } from '@kitman/services/src/mocks/handlers/planningHub/saveDevelopmentGoal';
import {
  newEventImportTypeAndVendorMock,
  newEventImportTypeAndAPIMock,
  athleteFiltersAndSortingMock,
} from '@kitman/common/src/utils/TrackingData/src/mocks/planningHub';

import {
  getAddDrillToSessionData,
  getDrillData,
  getImportTypeAndVendor,
  getAthleteFiltersAndSorting,
  getRPECollectionChannelsData,
  getAddColumnToParticipantsOrCollectionTabTable,
} from '../getPlanningHubEventData';

describe('getPlanningHubEventData', () => {
  it('getAddDrillToSessionData', () => {
    expect(getAddDrillToSessionData({ isFavorite: true })).toMatchSnapshot();
  });

  it('getDrillData', () => {
    expect(
      getDrillData({
        principles: data.principles,
        isLibrary: true,
      })
    ).toMatchSnapshot();
  });

  describe('getImportTypeAndVendor', () => {
    it('should return as expected when integration type', () => {
      expect(
        getImportTypeAndVendor(newEventImportTypeAndAPIMock)
      ).toMatchSnapshot();
    });

    it('should return as expected when CSV type', () => {
      expect(
        getImportTypeAndVendor(newEventImportTypeAndVendorMock)
      ).toMatchSnapshot();
    });
  });

  it('getAthleteFiltersAndSorting', () => {
    expect(
      getAthleteFiltersAndSorting(athleteFiltersAndSortingMock)
    ).toMatchSnapshot();
  });

  it('getRPECollectionChannelsData', () => {
    expect(
      getRPECollectionChannelsData({
        athleteAppCollection: false,
        kioskAppCollection: true,
        massInput: true,
      })
    ).toMatchSnapshot();
  });

  it('getAddColumnToParticipantsOrCollectionTabTable', () => {
    expect(
      getAddColumnToParticipantsOrCollectionTabTable({
        eventType: 'session_event',
        dataSourceName: '% Difference',
        calculation: 'Max',
      })
    ).toMatchSnapshot();
  });
});
