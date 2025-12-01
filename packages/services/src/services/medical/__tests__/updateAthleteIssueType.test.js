/* eslint-disable jest/no-conditional-expect */
import { axios } from '@kitman/common/src/utils/services';
import { mockedIssue } from '@kitman/modules/src/Medical/shared/services/getAthleteIssue';
import updateIssueType from '../updateAtheleteIssueType';

let request;
const payload = {
  from_issue_occurrence_id: 4,
  to_issue_occurrence_id: 6,
  to_type: 'recurrence',
  issue_type: 'injury',
  athlete_id: 123,
};
const insufficientPayload = {
  from_issue_occurrence_id: 11113333333333333311,
  to_issue_occurrence_id: 222222,
  to_type: 'aaaaaa',
  issue_type: 'bbbbffffffffffbb',
  athlete_id: 123,
};

describe('updateIssueType', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateIssueType(payload);
    expect(returnedData).toEqual(mockedIssue);
  });
  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'patch');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the endpoint with valid payload which includes to_issue_occurrence_id', async () => {
      await updateIssueType(payload);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/athletes/123/issues/issues_type_update`,
        payload
      );
    });

    it('calls the endpoint with valid payload which includes recurrence_outside_system', async () => {
      // eslint-disable-next-line camelcase
      const { to_issue_occurrence_id, ...updatedPayload } = {
        ...payload,
        recurrence_outside_system: true,
      };

      await updateIssueType(updatedPayload);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/athletes/123/issues/issues_type_update`,
        updatedPayload
      );
    });

    it('calls the endpoint and handles errors when payload insufficient', async () => {
      try {
        await updateIssueType(insufficientPayload);
      } catch (error) {
        expect(error).toEqual(
          new Error('`from_type` & `to_type` must make a valid combination')
        );
      }

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/athletes/123/issues/issues_type_update`,
        insufficientPayload
      );
    });
  });
});
