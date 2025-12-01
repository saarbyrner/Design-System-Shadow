// @flow
import { memo } from 'react';
import type { ReviewFormData } from '@kitman/modules/src/AthleteReviews/src/shared/types';
import { Printable } from '@kitman/printing/src/renderers';
import type { AssessmentGroup } from '@kitman/services/src/types';
import { ReviewContentTranslated as ReviewContent } from './ReviewContent';

type PrintViewProps = {
  headerEnabled: boolean,
  selfAssessmentEnabled: boolean,
  coachingCommentsEnabled: boolean,
  goalStatusEnabled: boolean,
  reviewData: ?ReviewFormData,
  assessmentData: Array<AssessmentGroup>,
};

const PrintView = ({
  headerEnabled,
  selfAssessmentEnabled,
  coachingCommentsEnabled,
  goalStatusEnabled,
  reviewData,
  assessmentData,
}: PrintViewProps): React$Element<typeof Printable> => {
  return (
    <Printable
      pageMargin={{
        top: 8,
        right: 10,
        dimension: 'mm',
      }}
    >
      <ReviewContent
        headerEnabled={headerEnabled}
        selfAssessmentEnabled={selfAssessmentEnabled}
        coachingCommentsEnabled={coachingCommentsEnabled}
        goalStatusEnabled={goalStatusEnabled}
        reviewData={reviewData}
        assessmentData={assessmentData}
      />
    </Printable>
  );
};

export default memo<PrintViewProps>(PrintView);
