import { data as mockIssueData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue';
import { getInvalidFields } from '..';

describe('getInvalidFields', () => {
  const organisation = { id: 1 };
  const issue = mockIssueData.issue;
  const mockDefaultResult = {
    issue_type: 'Injury',
    activity_type: 'game',
    athlete_id: 15642,
    reported_date: '2022-02-09T00:00:00+00:00',
    occurrence_date: '2022-01-13T00:00:00+00:00',
    examination_date: { examinationDate: '2022-02-09T00:00:00+00:00' },
    events: [
      { status: 4, date: '2022-01-13T00:00:00+00:00' },
      { status: 6, date: '2022-02-10T00:00:00+00:00' },
      { status: 7, date: '2022-02-11T00:00:00+00:00' },
    ],
    side_id: 2,
    conditional_questions: [
      {
        id: 1,
        parent_rule_id: null,
        question: 'Did he do a sufficient warm up prior?',
        question_type: 'multiple-choice',
        question_metadata: [
          { value: 'Yes', order: 1 },
          { value: 'No', order: 2 },
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
          { value: 'Nordic', order: 1 },
          { value: 'Leg Curl', order: 2 },
        ],
        order: 2,
        answer: { value: 'Nordic' },
      },
    ],
  };
  it('returns correct data when issue is Injury', async () => {
    const fields = getInvalidFields(organisation, issue, 'Injury', false);

    expect(fields).toEqual({
      ...mockDefaultResult,
      game_id: 47576,
      activity_id: 9,
      position_when_injured_id: 72,
    });
  });

  it('returns correct data when issue is injury and incomplete-injury-fields is enabled', async () => {
    window.featureFlags['incomplete-injury-fields'] = true;
    const fields = getInvalidFields(organisation, issue, 'Injury', false);
    expect(fields).toEqual({
      ...mockDefaultResult,
      issue_occurrence_onset_id: '4',
      game_id: 47576,
      activity_id: 9,
      position_when_injured_id: 72,
      activity_type: 'game',
      injury_mechanism: undefined,
      issue_contact_type: {
        id: 2423,
        name: 'Insidious/Overuse',
        parent_id: null,
        require_additional_input: false,
      },
      presentation_type: {
        id: 1084,
        name: 'Gradual Onset',
        require_additional_input: false,
      },
    });
  });

  it('returns correct data when issue is Illness', async () => {
    const fields = getInvalidFields(organisation, issue, 'Illness', false);

    expect(fields).toEqual({
      ...mockDefaultResult,
      issue_type: 'Illness',
    });
  });

  it('returns correct data when issue is a continuation issue', async () => {
    window.setFlag('incomplete-injury-fields', true);

    const fields = getInvalidFields(organisation, issue, 'Injury', true);

    // eslint-disable-next-line camelcase
    const { conditional_questions, ...remainingProperties } = mockDefaultResult;

    expect(fields).toEqual({
      ...remainingProperties,
      issue_occurrence_onset_id: '4',
    });
  });

  it('deletes conditional_questions when it is a continuation issue', async () => {
    const fields = getInvalidFields(organisation, issue, 'Injury', true);

    expect(fields).not.toHaveProperty('conditional_questions');
  });

  it('deletes conditional_questions when activity_type is not isInfoEvent', async () => {
    const fields = getInvalidFields(
      organisation,
      {
        ...issue,
        activity_type: 'nonfootball',
      },
      'Injury',
      false
    );

    expect(fields).not.toHaveProperty('conditional_questions');
  });
});
