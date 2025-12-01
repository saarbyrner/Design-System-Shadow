import { axios } from '@kitman/common/src/utils/services';
import {
  dataWhenActivating,
  dataWhenResolving,
} from '../../../mocks/handlers/medical/resolveChronicIssue';
import resolveChronicIssue from '../resolveChronicIssue';

describe('resolveChronicIssue', () => {
  const athleteId = 123;
  const issueId = 456;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the correct data when resolving', async () => {
    const returnedData = await resolveChronicIssue({
      athleteId,
      issueId,
      resolving: true,
      resolved_date: '2023-11-23T00:00:00+00:00',
    });
    expect(returnedData).toEqual(dataWhenResolving);
  });

  it('returns the correct data when activating', async () => {
    const returnedData = await resolveChronicIssue({
      athleteId,
      issueId,
      resolving: false,
    });
    expect(returnedData).toEqual(dataWhenActivating);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'patch');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request when resolving', async () => {
      await resolveChronicIssue({
        athleteId,
        issueId,
        resolving: true,
        resolved_date: '2023-11-23T00:00:00+00:00',
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/athletes/${athleteId}/chronic_issues/${issueId}/toggle_resolve`,
        { resolving: true, resolved_date: '2023-11-23T00:00:00+00:00' }
      );
    });

    it('calls the correct endpoint with correct body data in the request when activating', async () => {
      await resolveChronicIssue({ athleteId, issueId, resolving: false });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/athletes/${athleteId}/chronic_issues/${issueId}/toggle_resolve`,
        { resolving: false }
      );
    });
  });
});
