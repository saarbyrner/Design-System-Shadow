import $ from 'jquery';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import getAthleteChronicIssues from '../getAthleteChronicIssues';

describe('getAthleteChronicIssues', () => {
  let mockRequest;

  describe('when grouped_response is not passed', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve(data.chronicIssues));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getAthleteChronicIssues({ athleteId: 1234 });

      expect(returnedData).toEqual(data.chronicIssues);
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/athletes/1234/chronic_issues/search',
      });
    });
  });

  describe('when grouped_response is passed', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve(data.groupedChronicIssues));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getAthleteChronicIssues({
        athleteId: 1234,
        groupedResponse: true,
      });
      expect(returnedData).toEqual(data.groupedChronicIssues);
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/athletes/1234/chronic_issues/search?grouped_response=true',
      });
    });
  });
});
