// @flow

import { Box, Typography, Switch } from '@kitman/playbook/components';
import style from '../style';

type ContentSelectorProps = {
  headerEnabled: boolean,
  onHeaderChange: (checked: boolean) => void,
  selfAssessmentEnabled: boolean,
  onSelfAssessmentChange: (checked: boolean) => void,
  coachingCommentsEnabled: boolean,
  onCoachingCommentsChange: (checked: boolean) => void,
  goalStatusEnabled: boolean,
  onGoalStatusChange: (checked: boolean) => void,
};

const ContentSelector = ({
  headerEnabled,
  onHeaderChange,
  selfAssessmentEnabled,
  onSelfAssessmentChange,
  coachingCommentsEnabled,
  onCoachingCommentsChange,
  goalStatusEnabled,
  onGoalStatusChange,
}: ContentSelectorProps) => (
  <div css={style.contentWrapper}>
    <Typography variant="h6">Content</Typography>

    <Box display="flex" alignItems="center" mt={2}>
      <Typography variant="body1">Self Assessment</Typography>
      <Switch
        checked={selfAssessmentEnabled}
        onChange={(event) => onSelfAssessmentChange(event.target.checked)}
        inputProps={{ 'aria-label': 'Self Assessment' }}
        css={{ marginLeft: 'auto' }}
      />
    </Box>

    <Box display="flex" alignItems="center" mt={2}>
      <Typography variant="body1">Header</Typography>
      <Switch
        checked={headerEnabled}
        onChange={(event) => onHeaderChange(event.target.checked)}
        inputProps={{ 'aria-label': 'Header' }}
        css={{ marginLeft: 'auto' }}
      />
    </Box>

    <Box display="flex" alignItems="center" mt={2}>
      <Typography variant="body1">Coaching Comments</Typography>
      <Switch
        checked={coachingCommentsEnabled}
        onChange={(event) => onCoachingCommentsChange(event.target.checked)}
        inputProps={{ 'aria-label': 'Coaching Comments' }}
        css={{ marginLeft: 'auto' }}
      />
    </Box>

    <Box display="flex" alignItems="center" mt={2}>
      <Typography variant="body1">Goal Status</Typography>
      <Switch
        checked={goalStatusEnabled}
        onChange={(event) => onGoalStatusChange(event.target.checked)}
        inputProps={{ 'aria-label': 'Goal Status' }}
        css={{ marginLeft: 'auto' }}
      />
    </Box>
  </div>
);

export default ContentSelector;
