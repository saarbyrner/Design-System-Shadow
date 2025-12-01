/* eslint-disable camelcase */
// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AssessmentGroup } from '@kitman/services/src/types';
import { assessmentItemTypes } from '@kitman/services/src/types';
import { Box, Typography } from '@kitman/playbook/components';
import * as styles from './style';

type ReviewContentAssesmentSectionProps = {
  assessmentData: ?Array<AssessmentGroup>,
  selfAssessmentEnabled: boolean,
  getScoreAnswerValue: (answerValue: ?number) => string,
};

const ReviewContentAssesmentSection = ({
  // $FlowIgnore[incompatible-use] Ignoring this error because Flow cannot properly refine between `Metric` and `AssessmentHeader` based on `item_type`. Manual type refinement ensures safe access to `item.name` only when it's an `AssessmentHeader`.
  assessmentData = [],
  selfAssessmentEnabled,
  getScoreAnswerValue,
}: I18nProps<ReviewContentAssesmentSectionProps>) => {
  if (!selfAssessmentEnabled || !assessmentData.length) return null;

  return (
    <Box>
      {assessmentData?.map((group) => (
        <Box key={group.assessment_group_date} sx={{ marginBottom: 2 }}>
          {group?.items?.map((itemEl) => {
            const { item_type, item } = itemEl;

            if (item_type === assessmentItemTypes.header && item.name) {
              return (
                <div key={item.id}>
                  <Typography variant="h6" gutterBottom>
                    {item?.name}
                  </Typography>
                </div>
              );
            }

            if (item_type === assessmentItemTypes.metric) {
              const { training_variable, answers } = item;
              const { name, description } = training_variable;
              const answerValue =
                answers && answers.length > 0 && answers[0]?.value != null
                  ? answers[0].value
                  : null;

              return (
                <div css={styles.assessmentMetricStyle} key={item.id}>
                  <div css={styles.assessmentMetricHeaderStyle}>
                    <Typography
                      variant="h7"
                      gutterBottom
                      sx={{ fontWeight: 'normal' }}
                    >
                      {name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        {description}
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: 'lightgray',
                          color: 'black',
                          padding: '4px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {getScoreAnswerValue(answerValue)}
                      </Box>
                    </Box>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </Box>
      ))}
    </Box>
  );
};

export const ReviewContentAssesmentSectionTranslated = withNamespaces()(
  ReviewContentAssesmentSection
);
export default ReviewContentAssesmentSectionTranslated;
