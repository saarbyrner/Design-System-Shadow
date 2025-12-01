// @flow
import { Box, Typography } from '@kitman/playbook/components';
import {
  goalStatusEnumLike,
  getGoalStatusLabelsEnumLike,
} from '@kitman/modules/src/AthleteReviews/src/shared/enum-likes';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  ReviewFormData,
  AthleteData,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';
import type { AssessmentGroup } from '@kitman/services/src/types';
import { ReviewContentHeaderTranslated as ReviewContentHeader } from './ReviewContentHeader';
import { ReviewContentGoalSectionTranslated as ReviewContentGoalSection } from './ReviewContentGoalSection';
import { ReviewContentAssesmentSectionTranslated as ReviewContentAssesmentSection } from './ReviewContentAssesmentSection';

type Props = {
  headerEnabled: boolean,
  selfAssessmentEnabled: boolean,
  coachingCommentsEnabled: boolean,
  goalStatusEnabled: boolean,
  reviewData: ?ReviewFormData,
  athlete: ?AthleteData,
  assessmentData: Array<AssessmentGroup>,
  getGoalStatusChipColor: (goalStatusValue: string) => string,
  getStatusLabel: (status: ?string) => string,
  getScoreAnswerValue: (answerValue: ?number) => string,
};

const ReviewContent = (props: I18nProps<Props>): React$Element<'div'> => {
  const { reviewData } = props;

  if (!reviewData) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6">{`${props.t('Loading')}...`}</Typography>
      </Box>
    );
  }

  const goals = reviewData?.development_goals || [];

  const getGoalStatusChipColor = (goalStatusValue: string) => {
    switch (goalStatusValue) {
      case goalStatusEnumLike.achieved:
        return 'success';
      case goalStatusEnumLike.notAchieved:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: ?string) => {
    const { t } = props;
    if (status && getGoalStatusLabelsEnumLike(t)[status]) {
      return getGoalStatusLabelsEnumLike(t)[status];
    }
    return t('Still in progress');
  };

  const getScoreAnswerValue = (answerValue: ?number) => {
    switch (answerValue) {
      case 1:
        return props.t('Below Level');
      case 2:
        return props.t('Average');
      case 3:
        return props.t('Good');
      case 4:
        return props.t('Above Level');
      default:
        return '';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ReviewContentHeader
        reviewData={reviewData}
        athlete={reviewData.development_goals[0]?.athlete}
        headerEnabled={props.headerEnabled}
      />
      <ReviewContentGoalSection
        goals={goals}
        getGoalStatusChipColor={getGoalStatusChipColor}
        getStatusLabel={getStatusLabel}
        goalStatusEnabled={props.goalStatusEnabled}
        coachingCommentsEnabled={props.coachingCommentsEnabled}
      />
      <ReviewContentAssesmentSection
        assessmentData={props.assessmentData}
        getScoreAnswerValue={getScoreAnswerValue}
        selfAssessmentEnabled={props.selfAssessmentEnabled}
      />
    </Box>
  );
};

export const ReviewContentTranslated = withNamespaces()(ReviewContent);

export default ReviewContentTranslated;
