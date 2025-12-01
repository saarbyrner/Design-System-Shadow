import $ from 'jquery';
import { renderHook } from '@testing-library/react-hooks';

import useIssueConditionalQuestions from '../useIssueConditionalQuestions';
import {
  mockedIssue,
  mockedIssueWithClinicalImpressions,
} from '../../services/getAthleteIssue';

describe('useIssueConditionalQuestions', () => {
  let ajaxSpy;

  beforeEach(() => {
    window.featureFlags['conditional-fields-showing-in-ip'] = true;
    ajaxSpy = jest.spyOn($, 'ajax').mockImplementation((options) => {
      const url = options && options.url;
      if (url === '/ui/conditional_fields/fetch_followup_questions') {
        return $.Deferred().resolveWith(null, [
          {
            questions: [
              {
                id: 4,
                parent_rule_id: 2,
                parent_question_id: 1,
                question: 'Followup question',
                question_type: 'freee-text',
                order: 1,
                question_metadata: [],
              },
            ],
          },
        ]);
      }
      if (url === '/ui/conditional_fields/fetch_questions') {
        return $.Deferred().resolveWith(null, [
          {
            questions: [
              {
                id: 5,
                question: 'Unanswered question',
                question_type: 'freee-text',
                order: 1,
                question_metadata: [],
              },
            ],
          },
        ]);
      }
      return $.Deferred().resolveWith(null, [[]]);
    });
  });

  afterEach(() => {
    window.featureFlags['conditional-fields-showing-in-ip'] = false;
    ajaxSpy.mockRestore();
  });

  it('fetches unanswered questions', async () => {
    const { result } = renderHook(() =>
      useIssueConditionalQuestions(mockedIssue)
    );

    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(result.current.questions).toEqual([
      {
        id: 1,
        parent_rule_id: null,
        question: 'Did he do a sufficient warm up prior?',
        question_type: 'multiple-choice',
        question_metadata: [
          { order: 1, value: 'Yes' },
          { order: 2, value: 'No' },
        ],
        order: 1,
        answer: { value: 'Yes' },
      },
      {
        id: 2,
        parent_rule_id: 1,
        question: 'Which exercises?',
        question_type: 'multiple-choice',
        question_metadata: [
          { order: 1, value: 'Nordic' },
          { order: 2, value: 'Leg Curl' },
        ],
        order: 2,
        answer: { value: 'Nordic' },
      },
      {
        id: 4,
        parent_rule_id: 2,
        parent_question_id: 1,
        question: 'Followup question',
        question_type: 'freee-text',
        order: 1,
        question_metadata: [],
      },
      {
        id: 5,
        question: 'Unanswered question',
        question_type: 'freee-text',
        order: 1,
        question_metadata: [],
      },
    ]);
  });

  describe('when CI coding system is used', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = true;
    });
    afterEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    it('fetches unanswered questions', async () => {
      const { result } = renderHook(() =>
        useIssueConditionalQuestions({
          ...mockedIssueWithClinicalImpressions,
          activity_type: 'nonfootball',
        })
      );

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(result.current.questions).toEqual([
        {
          id: 1,
          parent_rule_id: null,
          question: 'Did he do a sufficient warm up prior?',
          question_type: 'multiple-choice',
          question_metadata: [
            { order: 1, value: 'Yes' },
            { order: 2, value: 'No' },
          ],
          order: 1,
          answer: { value: 'Yes' },
        },
        {
          id: 2,
          parent_rule_id: 1,
          question: 'Which exercises?',
          question_type: 'multiple-choice',
          question_metadata: [
            { order: 1, value: 'Nordic' },
            { order: 2, value: 'Leg Curl' },
          ],
          order: 2,
          answer: { value: 'Nordic' },
        },
        {
          id: 4,
          parent_rule_id: 2,
          parent_question_id: 1,
          question: 'Followup question',
          question_type: 'freee-text',
          order: 1,
          question_metadata: [],
        },
        {
          id: 5,
          question: 'Unanswered question',
          question_type: 'freee-text',
          order: 1,
          question_metadata: [],
        },
      ]);
    });
  });

  describe('when the injury is a continuation', () => {
    it('does not fetch questions', async () => {
      const { result } = renderHook(() =>
        useIssueConditionalQuestions({
          ...mockedIssue,
          continuation_issue: { id: 1, organisation: 2 },
        })
      );

      expect(ajaxSpy).not.toHaveBeenCalled();
      expect(result.current.questions).toEqual([]);
    });
  });
});
