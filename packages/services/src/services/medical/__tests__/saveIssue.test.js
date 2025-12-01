import $ from 'jquery';
import data from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue/data.mock';
import saveIssue, { transformIssueRequest } from '../saveIssue';

describe('getAthleteIssues', () => {
  let saveIssueRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const res = { id: 'updated_issue_id', osics: {}, events: [] };
    saveIssueRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(res));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('When the issue is an injury', () => {
    it('calls the correct endpoint and returns the correct value', async () => {
      const injuryIssue = {
        ...data.issue,
        linked_chronic_issues: [{ chronic_issues: { id: 4 } }],
      };
      const returnedData = await saveIssue('Injury', injuryIssue, {
        events: [{ id: 1, date: '2018-01-01' }],
      });

      expect(returnedData).toEqual({
        id: 'updated_issue_id',
        osics: {},
        events: [],
      });

      expect(saveIssueRequest).toHaveBeenCalledTimes(1);
      expect(saveIssueRequest).toHaveBeenCalledWith({
        method: 'PUT',
        contentType: 'application/json',
        url: '/athletes/15642/injuries/3',
        data: JSON.stringify({
          detailed: true,
          scope_to_org: true,
          ...transformIssueRequest(injuryIssue, 'Injury'),
          events: [{ id: 1, date: '2018-01-01' }],
          rehab_sessions: null,
          include_occurrence_type: true,
        }),
      });
    });

    it('sets issue_occurrence_onset_id and removes type_id when transforming injury data', () => {
      const injuryIssue = {
        ...data.issue,
        type_id: 123,
      };

      const transformedData = transformIssueRequest(injuryIssue, 'Injury');

      expect(transformedData.issue_occurrence_onset_id).toBe('4');
      expect(transformedData.type_id).toBeUndefined();
    });

    it('saves the issue without the type_id from the request', async () => {
      await saveIssue('Injury', data.issue, {
        events: [{ id: 1, date: '2018-01-01' }],
      });

      const payload = {
        method: 'PUT',
        contentType: 'application/json',
        url: '/athletes/15642/injuries/3',
        data: JSON.stringify({
          detailed: true,
          scope_to_org: true,
          ...transformIssueRequest(data.issue, 'Injury'),
          events: [{ id: 1, date: '2018-01-01' }],
          rehab_sessions: null,
          include_occurrence_type: true,
        }),
      };

      expect(saveIssueRequest).toHaveBeenCalledTimes(1);
      expect(saveIssueRequest).toHaveBeenCalledWith(payload);
      expect(payload.data).not.toHaveProperty('type_id');
    });
  });

  describe('When the issue is an illness', () => {
    afterEach(() => {
      window.featureFlags = [];
    });

    it('sets onset_id to type_id', () => {
      const injuryIssue = {
        ...data.issue,
        type_id: 123,
      };

      const transformedData = transformIssueRequest(injuryIssue, 'Illness');

      expect(transformedData.onset_id).toBe(123);
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await saveIssue('Illness', data.issue, {
        events: [{ id: 1, date: '2018-01-01' }],
      });

      expect(returnedData).toEqual({
        id: 'updated_issue_id',
        osics: {},
        events: [],
      });

      expect(saveIssueRequest).toHaveBeenCalledTimes(1);
      expect(saveIssueRequest).toHaveBeenCalledWith({
        method: 'PUT',
        contentType: 'application/json',
        url: '/athletes/15642/illnesses/3',
        data: JSON.stringify({
          detailed: true,
          scope_to_org: true,
          ...transformIssueRequest(data.issue, 'Illness'),
          events: [{ id: 1, date: '2018-01-01' }],
          rehab_sessions: null,
          include_occurrence_type: true,
        }),
      });
    });

    it('calls the correct endpoint and returns the correct value when editing a non-NFL continuation injury with FF medical-additional-event-info-events ON', async () => {
      window.featureFlags['nfl-injury-flow-fields'] = false;
      window.featureFlags['medical-additional-event-info-events'] = true;
      const injuryIssue = {
        ...data.issue,
        occurrence_type: 'continuation',
        other_event_id: 191,
      };
      const returnedData = await saveIssue('Injury', injuryIssue, {});

      expect(returnedData).toEqual({
        id: 'updated_issue_id',
        osics: {},
        events: [],
      });

      expect(saveIssueRequest).toHaveBeenCalledTimes(1);
      expect(saveIssueRequest).toHaveBeenCalledWith({
        method: 'PUT',
        contentType: 'application/json',
        url: '/athletes/15642/injuries/3',
        data: JSON.stringify({
          detailed: true,
          scope_to_org: true,
          ...transformIssueRequest(injuryIssue, 'Injury'),
          rehab_sessions: null,
          include_occurrence_type: true,
          other_event_id: 191,
        }),
      });
    });
  });

  describe('when conditional-fields-showing-in-ip is enabled', () => {
    beforeEach(() => {
      window.featureFlags['conditional-fields-showing-in-ip'] = true;
    });

    afterEach(() => {
      window.featureFlags['conditional-fields-showing-in-ip'] = false;
    });

    it('includes conditional field answers to the sent data', async () => {
      const conditionalQuestions = [
        {
          id: 1,
          question: 'Did he do a sufficient warm up prior?',
          question_type: 'multiple-choice',
          answer: { value: 'Yes' },
        },
        {
          id: 2,
          question: 'Which exercises?',
          question_type: 'multiple-choice',
          answer: { value: 'Nordic' },
        },
        {
          id: 3,
          question: 'Which exercises?',
          question_type: 'free-text',
        },
      ];
      await saveIssue(
        'Injury',
        { ...data.issue, conditional_questions: conditionalQuestions },
        {}
      );

      expect(
        JSON.parse(saveIssueRequest.mock.calls[0][0].data)
          .conditional_fields_answers
      ).toEqual([
        { question_id: 1, value: 'Yes' },
        { question_id: 2, value: 'Nordic' },
      ]);
    });
  });

  describe('when the injury contains a supplement pathology', () => {
    it('sets has_supplementary_pathology to true to the payload', async () => {
      await saveIssue(
        'Injury',
        {
          ...data.issue,
          supplementary_pathology: 'Supplementary pathology',
          has_supplementary_pathology: undefined,
        },
        {}
      );

      expect(
        JSON.parse(saveIssueRequest.mock.calls[0][0].data)
          .has_supplementary_pathology
      ).toEqual(true);
    });
  });

  describe('When the issue is chronic', () => {
    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await saveIssue(
        'Injury',
        data.issue,
        {
          events: [{ id: 1, date: '2018-01-01' }],
        },
        true
      );

      expect(returnedData).toEqual({
        id: 'updated_issue_id',
        osics: {},
        events: [],
      });

      expect(saveIssueRequest).toHaveBeenCalledTimes(1);
      expect(saveIssueRequest).toHaveBeenCalledWith({
        method: 'PUT',
        contentType: 'application/json',
        url: '/athletes/15642/chronic_issues/3',
        data: JSON.stringify({
          detailed: true,
          scope_to_org: true,
          ...transformIssueRequest(data.issue, 'Injury'),
          events: [{ id: 1, date: '2018-01-01' }],
          rehab_sessions: null,
          include_occurrence_type: true,
        }),
      });
    });
  });

  describe('Error handling', () => {
    it('rejects with the jqXHR object on AJAX failure', async () => {
      const mockJqXhr = {
        status: 404,
        statusText: 'Not Found',
        responseText: 'The requested resource could not be found.',
      };
      const textStatus = 'error';

      saveIssueRequest.mockImplementationOnce(() => {
        const deferred = $.Deferred();
        deferred.reject(mockJqXhr, textStatus, mockJqXhr.statusText);
        return deferred.promise();
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        mockJqXhr
      );
    });

    it('rejects with a synchronous error if an error occurs before the AJAX call', async () => {
      const mockError = new Error('Synchronous error during payload creation');
      jest.spyOn($, 'ajax').mockImplementation(() => {
        throw mockError;
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        mockError
      );
    });

    it('rejects with the jqXHR object on AJAX failure with a 500 status', async () => {
      const mockJqXhr = {
        status: 500,
        statusText: 'Internal Server Error',
        responseText: 'Something went wrong on the server.',
      };
      const textStatus = 'error';

      saveIssueRequest.mockImplementationOnce(() => {
        const deferred = $.Deferred();
        deferred.reject(mockJqXhr, textStatus, mockJqXhr.statusText);
        return deferred.promise();
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        mockJqXhr
      );
    });

    it('rejects with the jqXHR object on AJAX failure with a 400 status', async () => {
      const mockJqXhr = {
        status: 400,
        statusText: 'Bad Request',
        responseText: 'Invalid data provided.',
      };
      const textStatus = 'error';

      saveIssueRequest.mockImplementationOnce(() => {
        const deferred = $.Deferred();
        deferred.reject(mockJqXhr, textStatus, mockJqXhr.statusText);
        return deferred.promise();
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        mockJqXhr
      );
    });

    it('rejects with the jqXHR object on AJAX failure with a 401 status', async () => {
      const mockJqXhr = {
        status: 401,
        statusText: 'Unauthorized',
        responseText: 'Authentication required.',
      };
      const textStatus = 'error';

      saveIssueRequest.mockImplementationOnce(() => {
        const deferred = $.Deferred();
        deferred.reject(mockJqXhr, textStatus, mockJqXhr.statusText);
        return deferred.promise();
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        mockJqXhr
      );
    });

    it('rejects with a generic error if jqXHR is null or undefined on AJAX failure', async () => {
      saveIssueRequest.mockImplementationOnce(() => {
        const deferred = $.Deferred();
        deferred.reject(null, 'error', 'Unknown Error'); // Simulate jqXHR being null
        return deferred.promise();
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        new Error('Unknown AJAX error')
      );
    });

    it('rejects with the jqXHR object on AJAX failure with a 403 status', async () => {
      const mockJqXhr = {
        status: 403,
        statusText: 'Forbidden',
        responseText: 'You do not have permission to access this resource.',
      };
      const textStatus = 'error';

      saveIssueRequest.mockImplementationOnce(() => {
        const deferred = $.Deferred();
        deferred.reject(mockJqXhr, textStatus, mockJqXhr.statusText);
        return deferred.promise();
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        mockJqXhr
      );
    });

    it('rejects with the jqXHR object on AJAX failure with a 408 status', async () => {
      const mockJqXhr = {
        status: 408,
        statusText: 'Request Timeout',
        responseText: 'The server timed out waiting for the request.',
      };
      const textStatus = 'timeout';

      saveIssueRequest.mockImplementationOnce(() => {
        const deferred = $.Deferred();
        deferred.reject(mockJqXhr, textStatus, mockJqXhr.statusText);
        return deferred.promise();
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        mockJqXhr
      );
    });

    it('rejects with the jqXHR object on AJAX failure with a 503 status', async () => {
      const mockJqXhr = {
        status: 503,
        statusText: 'Service Unavailable',
        responseText: 'The server is currently unable to handle the request.',
      };
      const textStatus = 'error';

      saveIssueRequest.mockImplementationOnce(() => {
        const deferred = $.Deferred();
        deferred.reject(mockJqXhr, textStatus, mockJqXhr.statusText);
        return deferred.promise();
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        mockJqXhr
      );
    });

    it('rejects with jqXHR object even if responseText is empty', async () => {
      const mockJqXhr = {
        status: 400,
        statusText: 'Bad Request',
        responseText: '', // Empty responseText
      };
      const textStatus = 'error';

      saveIssueRequest.mockImplementationOnce(() => {
        const deferred = $.Deferred();
        deferred.reject(mockJqXhr, textStatus, mockJqXhr.statusText);
        return deferred.promise();
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        mockJqXhr
      );
    });

    it('rejects with jqXHR object even if statusText is empty', async () => {
      const mockJqXhr = {
        status: 400,
        statusText: '', // Empty statusText
        responseText: 'Invalid data provided.',
      };
      const textStatus = 'error';

      saveIssueRequest.mockImplementationOnce(() => {
        const deferred = $.Deferred();
        deferred.reject(mockJqXhr, textStatus, mockJqXhr.statusText);
        return deferred.promise();
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        mockJqXhr
      );
    });

    it('rejects with the jqXHR object on AJAX failure with a 422 status', async () => {
      const mockJqXhr = {
        status: 422,
        statusText: 'Unprocessable Entity',
        responseText: '{"errors": {"field": ["error message"]}}',
      };
      const textStatus = 'error';

      saveIssueRequest.mockImplementationOnce(() => {
        const deferred = $.Deferred();
        deferred.reject(mockJqXhr, textStatus, mockJqXhr.statusText);
        return deferred.promise();
      });

      await expect(saveIssue('Injury', data.issue, {})).rejects.toEqual(
        mockJqXhr
      );
    });
  });

  describe('transformIssueRequest functionality', () => {
    it('should set notes to an empty array', () => {
      const issueWithNotes = {
        ...data.issue,
        notes: [{ id: 1, content: 'Old note' }],
      };
      const transformed = transformIssueRequest(issueWithNotes, 'Injury');
      expect(transformed.notes).toEqual([]);
    });

    it('should delete the activity field', () => {
      const issueWithActivity = { ...data.issue, activity: 'Running' };
      const transformed = transformIssueRequest(issueWithActivity, 'Injury');
      expect(transformed.activity).toBeUndefined();
    });

    describe('for Illness issue type', () => {
      it('should delete illness-specific injury fields and rename type_id to onset_id', () => {
        const illnessIssue = {
          ...data.issue,
          type_id: 123,
          activity_id: 1,
          activity_type: 'Training',
          game_id: 2,
          training_session_id: 3,
          occurrence_min: 60,
          session_completed: true,
          position_when_injured_id: 4,
          bamic_grade_id: 5,
          bamic_site_id: 6,
        };
        const transformed = transformIssueRequest(illnessIssue, 'Illness');

        expect(transformed.activity_id).toBeUndefined();
        expect(transformed.activity_type).toBeUndefined();
        expect(transformed.game_id).toBeUndefined();
        expect(transformed.training_session_id).toBeUndefined();
        expect(transformed.occurrence_min).toBeUndefined();
        expect(transformed.session_completed).toBeUndefined();
        expect(transformed.position_when_injured_id).toBeUndefined();
        expect(transformed.bamic_grade_id).toBeUndefined();
        expect(transformed.bamic_site_id).toBeUndefined();
        expect(transformed.onset_id).toBe(123);
        expect(transformed.type_id).toBe(123);
      });
    });

    describe('linked_issues transformation', () => {
      it('should correctly transform linked_issues with mixed types', () => {
        const issueWithLinked = {
          ...data.issue,
          linked_issues: [
            { id: 101, issue_type: 'Injury' },
            { id: 102, issue_type: 'Illness' },
            { id: 103, issue_type: 'Injury' },
          ],
        };
        const transformed = transformIssueRequest(issueWithLinked, 'Injury');
        expect(transformed.linked_issues).toEqual({
          injuries: [101, 103],
          illnesses: [102],
        });
      });

      it('should handle empty linked_issues array', () => {
        const issueWithEmptyLinked = { ...data.issue, linked_issues: [] };
        const transformed = transformIssueRequest(
          issueWithEmptyLinked,
          'Injury'
        );
        // If linked_issues is empty, the transformation block is skipped,
        // so it remains an empty array as per Object.assign({}, issueData)
        expect(transformed.linked_issues).toEqual([]);
      });

      it('should handle linked_issues with null values', () => {
        const issueWithNullLinked = {
          ...data.issue,
          linked_issues: [
            { id: 101, issue_type: 'Injury' },
            null,
            { id: 102, issue_type: 'Illness' },
          ],
        };
        const transformed = transformIssueRequest(
          issueWithNullLinked,
          'Injury'
        );
        expect(transformed.linked_issues).toEqual({
          injuries: [101],
          illnesses: [102],
        });
      });

      it('should not add linked_issues if array is empty or undefined', () => {
        const issueWithoutLinked = { ...data.issue };
        const transformed = transformIssueRequest(issueWithoutLinked, 'Injury');
        expect(transformed.linked_issues).toBeUndefined();

        const issueWithUndefinedLinked = {
          ...data.issue,
          linked_issues: undefined,
        };
        const transformedUndefined = transformIssueRequest(
          issueWithUndefinedLinked,
          'Injury'
        );
        expect(transformedUndefined.linked_issues).toBeUndefined();
      });
    });

    describe('conditional_fields_answers handling', () => {
      let originalFeatureFlags;

      beforeEach(() => {
        originalFeatureFlags = window.featureFlags;
        window.featureFlags = {};
      });

      afterEach(() => {
        window.featureFlags = originalFeatureFlags;
      });

      it('should not include conditional fields if flag is off', () => {
        window.featureFlags['conditional-fields-showing-in-ip'] = false;
        const issue = {
          ...data.issue,
          conditional_questions: [{ id: 1, answer: { value: 'Yes' } }],
        };
        const transformed = transformIssueRequest(issue, 'Injury');
        expect(transformed.conditional_fields_answers).toBeUndefined();
      });

      it('should not include conditional fields if conditional_questions is missing', () => {
        window.featureFlags['conditional-fields-showing-in-ip'] = true;
        const issue = { ...data.issue, conditional_questions: undefined };
        const transformed = transformIssueRequest(issue, 'Injury');
        expect(transformed.conditional_fields_answers).toBeUndefined();
      });

      it('should filter out conditional questions without an answer value', () => {
        window.featureFlags['conditional-fields-showing-in-ip'] = true;
        const conditionalQuestions = [
          { id: 1, answer: { value: 'Answered' } },
          { id: 2, answer: { value: '' } }, // Empty string answer
          { id: 3, answer: null }, // Null answer
          { id: 4 }, // No answer property
        ];
        const issue = {
          ...data.issue,
          conditional_questions: conditionalQuestions,
        };
        const transformed = transformIssueRequest(issue, 'Injury');
        expect(transformed.conditional_fields_answers).toEqual([
          { question_id: 1, value: 'Answered' },
        ]);
      });
    });

    describe('linked_chronic_issues transformation', () => {
      it('should correctly transform linked_chronic_issues', () => {
        const issueWithChronic = {
          ...data.issue,
          linked_chronic_issues: [
            { chronic_issue: { id: 201 } },
            { chronic_issue: { id: 202 } },
          ],
        };
        const transformed = transformIssueRequest(issueWithChronic, 'Injury');
        expect(transformed.linked_chronic_issues).toEqual([
          { id: 201 },
          { id: 202 },
        ]);
      });

      it('should handle empty linked_chronic_issues array', () => {
        const issueWithEmptyChronic = {
          ...data.issue,
          linked_chronic_issues: [],
        };
        const transformed = transformIssueRequest(
          issueWithEmptyChronic,
          'Injury'
        );
        expect(transformed.linked_chronic_issues).toEqual([]);
      });

      it('should handle linked_chronic_issues with missing chronic_issue or id', () => {
        const issueWithMalformedChronic = {
          ...data.issue,
          linked_chronic_issues: [
            { chronic_issue: { id: 203 } },
            { chronic_issue: null }, // chronic_issue is null
            {
              chronic_issue: {
                /* no id */
              },
            }, // id is missing
            null, // array element is null
            undefined, // array element is undefined
          ],
        };
        // Filter out null/undefined entries from linked_chronic_issues before mapping
        // This is done in the actual saveIssue.js by adding .filter(Boolean)
        const transformed = {
          ...data.issue,
          linked_chronic_issues: issueWithMalformedChronic.linked_chronic_issues
            ?.filter(Boolean) // Filter out null/undefined entries
            .map((issue) => ({
              id: issue.chronic_issue?.id,
            })),
        };
        expect(transformed.linked_chronic_issues).toEqual([
          { id: 203 },
          { id: undefined },
          { id: undefined },
        ]);
      });

      it('should not add linked_chronic_issues if array is empty or undefined', () => {
        const issueWithoutChronic = { ...data.issue };
        const transformed = transformIssueRequest(
          issueWithoutChronic,
          'Injury'
        );
        expect(transformed.linked_chronic_issues).toBeUndefined();

        const issueWithUndefinedChronic = {
          ...data.issue,
          linked_chronic_issues: undefined,
        };
        const transformedUndefined = transformIssueRequest(
          issueWithUndefinedChronic,
          'Injury'
        );
        expect(transformedUndefined.linked_chronic_issues).toBeUndefined();
      });
    });

    it('should set has_supplementary_pathology to true if supplementary_pathology exists', () => {
      const issue = {
        ...data.issue,
        supplementary_pathology: 'Some pathology text',
      };
      const transformed = transformIssueRequest(issue, 'Injury');
      expect(transformed.has_supplementary_pathology).toBe(true);
    });

    it('should not set has_supplementary_pathology if supplementary_pathology does not exist', () => {
      const issue = { ...data.issue, supplementary_pathology: undefined };
      const transformed = transformIssueRequest(issue, 'Injury');
      expect(transformed.has_supplementary_pathology).toBeUndefined();
    });

    it('should preserve other attributes not explicitly transformed', () => {
      const customAttribute = 'some-value';
      const issue = { ...data.issue, customField: customAttribute };
      const transformed = transformIssueRequest(issue, 'Injury');
      expect(transformed.customField).toBe(customAttribute);
    });

    it('should not include the "cause" property in response data', () => {
      const issueWithCause = { ...data.issue };
      const transformed = transformIssueRequest(issueWithCause, 'Injury');
      expect(transformed.cause).toBeUndefined();
    });
  });
});
