// @flow
import type { Translation } from '@kitman/common/src/types/i18n';

export const goalStatusEnumLike = {
  inProgress: 'in_progress',
  achieved: 'achieved',
  notAchieved: 'not_achieved',
};
export const statusEnumLike = {
  in_progress: 'in_progress',
  completed: 'completed',
  upcoming: 'upcoming',
  deleted: 'deleted',
};

export const getStatusLabelsEnumLike = (t: Translation) => ({
  [statusEnumLike.in_progress]: t('In progress'),
  [statusEnumLike.completed]: t('Completed'),
  [statusEnumLike.upcoming]: t('Upcoming'),
  [statusEnumLike.deleted]: t('Deleted'),
});

export const getGoalStatusLabelsEnumLike = (t: Translation) => ({
  [goalStatusEnumLike.inProgress]: t('Still in progress'),
  [goalStatusEnumLike.achieved]: t('Achieved'),
  [goalStatusEnumLike.notAchieved]: t('Not Achieved'),
});

export const assessmentMandatoryFieldsEnumLike = {
  name: 'name',
  assessmentId: 'assessment_template_id',
  assessmentGroupDate: 'assessment_group_date',
};

export const formModeEnumLike = {
  Create: 'CREATE',
  Edit: 'EDIT',
};
