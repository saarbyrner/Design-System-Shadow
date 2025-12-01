import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  getAthleteReviewId,
  validateReviewForm,
  getDefaultDevelopmentGoal,
  removeEmptyUrlsFromForm,
  getStatusMenuOptions,
  sanitizeDevelopmentGoals,
} from '../utils';
import { statusEnumLike } from '../enum-likes';

const validForm = {
  development_goals: [
    {
      ...getDefaultDevelopmentGoal(),
      additional_name: 'Kicking the ball harder',
      description: 'I want to kick ball harder',
      attached_links: [],
      development_goal_types: [{ id: 1 }],
    },
  ],
  user_ids: [1, 2],
  start_date: '2024-02-01T00:00:00+00:00',
  end_date: '2024-03-01T00:00:00+00:00',
  athlete_review_type_id: 1,
};

describe('getAthleteReviewId', () => {
  it('returns the athlete review id from the url', () => {
    const athleteReviewId = getAthleteReviewId(
      '/athletes/YESS/reviews/1234/edit'
    );

    expect(athleteReviewId).toEqual(1234);
  });
});

describe('getStatusMenuOptions', () => {
  const markAsDeleted = {
    id: 'mark_as_delete',
    title: 'Mark as deleted',
    newStatus: statusEnumLike.deleted,
    onClick: expect.any(Function),
  };
  const markAsComplete = {
    id: 'mark_as_complete',
    title: 'Mark as completed',
    newStatus: statusEnumLike.completed,
    onClick: expect.any(Function),
  };
  const markAsInProgress = {
    id: 'mark_as_in_progress',
    title: 'Mark as in progress',
    newStatus: statusEnumLike.in_progress,
    onClick: expect.any(Function),
  };
  const markAsUpcoming = {
    id: 'mark_as_upcoming',
    title: 'Mark as upcoming',
    newStatus: statusEnumLike.upcoming,
    onClick: expect.any(Function),
  };
  it('has correct menu options when status is Upcoming', () => {
    const menuOptions = getStatusMenuOptions({
      currentStatus: statusEnumLike.upcoming,
      updateReviewStatus: () => {},
      t: i18nextTranslateStub(),
    });
    expect(menuOptions).toEqual([
      markAsInProgress,
      markAsComplete,
      markAsDeleted,
    ]);
  });

  it('has correct menu options when status is In progress', () => {
    const menuOptions = getStatusMenuOptions({
      currentStatus: statusEnumLike.in_progress,
      updateReviewStatus: () => {},
      t: i18nextTranslateStub(),
    });
    expect(menuOptions).toEqual([
      markAsUpcoming,
      markAsComplete,
      markAsDeleted,
    ]);
  });

  it('has correct menu options when status is Completed', () => {
    const menuOptions = getStatusMenuOptions({
      currentStatus: statusEnumLike.completed,
      updateReviewStatus: () => {},
      t: i18nextTranslateStub(),
    });
    expect(menuOptions).toEqual([
      markAsUpcoming,
      markAsInProgress,
      markAsDeleted,
    ]);
  });

  it('has correct menu options when status is Deleted', () => {
    const menuOptions = getStatusMenuOptions({
      currentStatus: statusEnumLike.deleted,
      updateReviewStatus: () => {},
      t: i18nextTranslateStub(),
    });
    expect(menuOptions).toEqual([
      markAsUpcoming,
      markAsInProgress,
      markAsComplete,
    ]);
  });
});
describe('removeEmptyUrlsFromForm', () => {
  it('correctly removes empty urls from forms', () => {
    const form = {
      ...validForm,
      development_goals: [
        {
          ...validForm.development_goals[0],
          attached_links: [
            {
              title: '',
              uri: '',
            },
          ],
        },
      ],
    };

    expect(removeEmptyUrlsFromForm(form)).toEqual(validForm);
  });
});

describe('validateReviewForm', () => {
  const props = {
    form: validForm,
    t: i18nextTranslateStub(),
  };

  it('returns correctly when valid form', () => {
    expect(validateReviewForm(props)).toEqual({
      validForm: true,
      formWithEmptyUrlsRemoved: validForm,
      errorMessage: '',
    });
  });

  it('returns correct error when user leaves mandatory field blank', () => {
    expect(
      validateReviewForm({
        ...props,
        form: {
          ...props.form,
          user_ids: [],
        },
      })
    ).toEqual({
      validForm: false,
      errorMessage: 'Required field not complete',
    });
  });

  it('returns correct error when user enters start date before end date', () => {
    expect(
      validateReviewForm({
        ...props,
        form: {
          ...props.form,
          start_date: '2024-02-01T00:00:00+00:00',
          end_date: '2024-01-01T00:00:00+00:00',
        },
      })
    ).toEqual({
      validForm: false,
      errorMessage: 'Start date must be before end date',
    });
  });

  it('returns correct error when user enters an invalid date', () => {
    expect(
      validateReviewForm({
        ...props,
        form: {
          ...props.form,
          start_date: '2024-0',
          end_date: '2024-01-01T00:00:00+00:00',
        },
      })
    ).toEqual({
      validForm: false,
      errorMessage: 'Invalid date entered',
    });
  });
});

describe('sanitizeDevelopmentGoals', () => {
  it('sanitizes the review form', () => {
    const testForm = {
      id: 1,
      development_goals: [
        {
          development_goal_types: [{ id: 1 }],
          principles: [
            {
              id: 2,
            },
          ],
        },
      ],
    };
    expect(
      sanitizeDevelopmentGoals({
        reviewForm: testForm,
      })
    ).toEqual({
      ...testForm,
      development_goals: [
        {
          ...testForm.development_goals[0],
          development_goal_type_id: 1,
          principle_id: 2,
        },
      ],
    });
  });
});
