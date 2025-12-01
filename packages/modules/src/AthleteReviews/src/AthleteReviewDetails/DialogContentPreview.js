// @flow
import type { ReviewFormData } from '@kitman/modules/src/AthleteReviews/src/shared/types';
import type { AssessmentGroup } from '@kitman/services/src/types';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ReviewContentTranslated as ReviewContent } from './ReviewContent';

type Props = {
  headerEnabled: boolean,
  selfAssessmentEnabled: boolean,
  coachingCommentsEnabled: boolean,
  goalStatusEnabled: boolean,
  reviewData: ?ReviewFormData,
  assessmentData: Array<AssessmentGroup>,
};

export type TranslatedProps = I18nProps<Props>;

const DialogContentPreview = ({
  headerEnabled,
  selfAssessmentEnabled,
  coachingCommentsEnabled,
  goalStatusEnabled,
  reviewData,
  assessmentData,
}: TranslatedProps): React$Element<typeof ReviewContent> => {
  return (
    <ReviewContent
      headerEnabled={headerEnabled}
      selfAssessmentEnabled={selfAssessmentEnabled}
      coachingCommentsEnabled={coachingCommentsEnabled}
      goalStatusEnabled={goalStatusEnabled}
      reviewData={reviewData}
      assessmentData={assessmentData}
    />
  );
};

export const DialogContentPreviewTranslated =
  withNamespaces()(DialogContentPreview);
export default DialogContentPreviewTranslated;
