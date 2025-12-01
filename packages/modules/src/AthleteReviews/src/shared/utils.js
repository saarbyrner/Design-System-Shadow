// @flow
import type {
  Link,
  DevelopmentGoal,
  ReviewFormData,
  StatusLabelsEnumLikeKeys,
  DevelopmentGoalComment,
  AthleteReviewsFilters,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';
import type { AssessmentGroupCreate } from '@kitman/services/src/services/assessmentGroup/createAssessmentGroup';
import moment from 'moment';
import { validateURL } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ToastStatusEnumLikeValues } from '@kitman/components/src/Toast/types';
import { add, reset } from '@kitman/modules/src/Toasts/toastsSlice';
import type { Dispatch } from 'redux';
import { statusEnumLike } from './enum-likes';

// URLs: /athletes/:athleteId/athlete_reviews/...
export const getAthleteId = (pathname: string): number =>
  parseInt(pathname.split('/')[2], 10);

export const getDefaultLink = (): Link => ({
  id: null,
  title: '',
  uri: '',
  isIdLocal: true,
  description: '',
});

export const getDefaultDevelopmentGoal = (): DevelopmentGoal => ({
  id: null,
  additional_name: '',
  description: '',
  development_goal_type_id: null,
  development_goal_types: [],
  principle_id: null,
  principles: [],
  analytical_dashboard_ids: [],
  development_goal_standard_name_id: null,
  attached_links: [getDefaultLink()],
  comments: [],
  status: null,
});

export const getDefaultAthleteReviewsFilters = (): AthleteReviewsFilters => ({
  user_ids: [],
  review_start_date: null,
  review_end_date: null,
  athlete_review_type_id: null,
  review_status: null,
});

export const getDefaultReviewForm = (): ReviewFormData => ({
  attached_links: [],
  athlete_review_type_id: null,
  assessment_id: null,
  assessment_group_id: null,
  id: null,
  type: 'athlete_review',
  start_date: null,
  start_time: null,
  end_date: null,
  review_description: '',
  review_note: '',
  review_status: null,
  local_timezone: document.getElementsByTagName('body')[0].dataset.timezone,
  skip_create_athlete_events: true,
  skip_create_period: true,
  user_ids: [],
  squad_id: null,
  squad_name: '',
  development_goals: [getDefaultDevelopmentGoal()],
  age: null,
  height: null,
  country: null,
});

export const getDefaultDevelopmentGoalComment = (): DevelopmentGoalComment => ({
  id: null,
  text: '',
});

export const getDefaultSelfAssessmentForm = (): AssessmentGroupCreate => ({
  assessment_group_date: null,
  assessment_template_id: null,
  athlete_ids: [],
  event_id: null,
  event_type: null,
  name: '',
});

// URL:
// /athletes/:athleteId/reviews/:athleteReviewId/edit
// /athletes/:athleteId/reviews/:athleteReviewId
export const getAthleteReviewId = (pathname: string): number => {
  const [, , , , athleteReviewId] = pathname.split('/');
  return parseInt(athleteReviewId, 10);
};

export const removeEmptyUrlsFromForm = (form: ReviewFormData) => {
  // remove empty urls as they are validated on BE
  const developmentGoalsWithRemovedEmptyUrls: Array<DevelopmentGoal> =
    form?.development_goals.map((devGoal) => {
      return {
        ...devGoal,
        attached_links: devGoal.attached_links.filter(
          ({ uri, title }) => uri || title
        ),
      };
    });

  return {
    ...form,
    development_goals: developmentGoalsWithRemovedEmptyUrls,
  };
};

// this is short term while there is a discrepancy on the BE between what is sent in the GET and what is expected in the EDIT
// https://kitmanlabs.atlassian.net/browse/CAD2-1150
export const sanitizeDevelopmentGoals = ({
  reviewForm,
}: {
  reviewForm: ReviewFormData,
}): ReviewFormData => {
  return {
    ...reviewForm,
    development_goals: reviewForm.development_goals.map((devGoal) => ({
      ...devGoal,
      principle_id: devGoal.principles[0]?.id,
      development_goal_type_id: devGoal.development_goal_types[0]?.id,
    })),
  };
};

export const validateReviewForm = ({
  form,
  t,
}: I18nProps<{
  form: ReviewFormData,
}>): {
  validForm: boolean,
  formWithEmptyUrlsRemoved?: ReviewFormData,
  errorMessage: string,
} => {
  const formWithEmptyUrlsRemoved = removeEmptyUrlsFromForm(form);
  const {
    development_goals: developmentGoals,
    user_ids: userIds,
    start_date: startDate,
    end_date: endDate,
    athlete_review_type_id: reviewType,
  } = formWithEmptyUrlsRemoved;

  // ensure every development goal has a value for each mandatory field
  const areReviewGoalsRequiredFieldsPresent = developmentGoals.every(
    ({
      additional_name: goalTitle,
      description,
      attached_links: attachedLinks,
      development_goal_types: developmentGoalTypes,
    }) =>
      goalTitle &&
      description &&
      // BE have made development_goal_types an array
      // but user can only add one creating dev goal
      developmentGoalTypes[0]?.id &&
      attachedLinks.every(({ uri, title }) => validateURL(uri) && title)
  );

  // ensure review setup has a value for each mandatory field
  const areSetupRequiredFieldsPresent =
    reviewType && startDate && userIds.length > 0;

  const isStartDateBeforeEndDate =
    moment(startDate).isAfter(moment(endDate)) && endDate;

  const areInvalidDatesEntered = !(
    !moment(startDate).isValid() ||
    (!moment(endDate).isValid() && endDate)
  );

  if (!(areSetupRequiredFieldsPresent && areReviewGoalsRequiredFieldsPresent)) {
    return {
      validForm: false,
      errorMessage: t('Required field not complete'),
    };
  }

  if (isStartDateBeforeEndDate) {
    return {
      validForm: false,
      errorMessage: t('Start date must be before end date'),
    };
  }

  if (!areInvalidDatesEntered) {
    return {
      validForm: false,
      errorMessage: t('Invalid date entered'),
    };
  }

  return {
    validForm: true,
    formWithEmptyUrlsRemoved,
    errorMessage: '',
  };
};

export const getStatusMenuOptions = ({
  currentStatus,
  updateReviewStatus,
  t,
}: I18nProps<{
  currentStatus: ?StatusLabelsEnumLikeKeys,
  updateReviewStatus: (
    newStatus: StatusLabelsEnumLikeKeys,
    form?: ReviewFormData
  ) => void,
}>) => {
  const markAsDeleted = {
    id: 'mark_as_delete',
    title: t('Mark as deleted'),
    newStatus: statusEnumLike.deleted,
    onClick: () => updateReviewStatus(statusEnumLike.deleted),
  };
  const markAsComplete = {
    id: 'mark_as_complete',
    title: t('Mark as completed'),
    newStatus: statusEnumLike.completed,
    onClick: () => updateReviewStatus(statusEnumLike.completed),
  };
  const markAsInProgress = {
    id: 'mark_as_in_progress',
    title: t('Mark as in progress'),
    newStatus: statusEnumLike.in_progress,
    onClick: () => updateReviewStatus(statusEnumLike.in_progress),
  };
  const markAsUpcoming = {
    id: 'mark_as_upcoming',
    title: t('Mark as upcoming'),
    newStatus: statusEnumLike.upcoming,
    onClick: () => updateReviewStatus(statusEnumLike.upcoming),
  };

  switch (currentStatus) {
    case statusEnumLike.in_progress: {
      return [markAsUpcoming, markAsComplete, markAsDeleted];
    }
    case statusEnumLike.completed: {
      return [markAsUpcoming, markAsInProgress, markAsDeleted];
    }
    case statusEnumLike.deleted: {
      return [markAsUpcoming, markAsInProgress, markAsComplete];
    }
    case statusEnumLike.upcoming:
    default: {
      return [markAsInProgress, markAsComplete, markAsDeleted];
    }
  }
};

export const dispatchToastMessage = ({
  dispatch,
  message,
  status,
}: {
  dispatch: Dispatch,
  message: string,
  status: ToastStatusEnumLikeValues,
}) => {
  dispatch(
    add({
      title: message,
      status,
    })
  );
};

export const dismissToasts = (dispatch: Dispatch) => {
  dispatch(reset());
};
