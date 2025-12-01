// @flow
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Box, Typography, Avatar, Grid } from '@kitman/playbook/components';
import type {
  AthleteData,
  ReviewFormData,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';

type ReviewContentHeaderProps = {
  athlete: ?AthleteData,
  reviewData: ?ReviewFormData,
  headerEnabled: boolean,
};

const ReviewContentHeader = (props: I18nProps<ReviewContentHeaderProps>) => {
  const { athlete, reviewData, headerEnabled } = props;

  if (!(headerEnabled && athlete && reviewData)) return null;

  const avatarUrl = athlete?.avatar_url || '';
  const athleteFullName = athlete?.fullname || '';
  const reviewDescription = reviewData?.review_description || '';
  const reviewNote = reviewData?.review_note || '';
  const dateOfBirth = athlete?.date_of_birth
    ? moment(athlete?.date_of_birth).format('MMMM D, YYYY')
    : '';
  const positionName = athlete?.position?.name || '';
  const squadName = reviewData?.squad_name || '';

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={avatarUrl}
          alt={athleteFullName}
          sx={{ width: 56, height: 56, mr: 2 }}
        />
        <Box>
          <Typography variant="h6" gutterBottom>
            {athleteFullName}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>{props.t('DoB')}:</strong> {dateOfBirth}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>{props.t('Position')}:</strong> {positionName}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>{props.t('Status')}:</strong>{' '}
                {reviewData.review_status || props.t('N/A')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <strong>{props.t('Squad')}:</strong>{' '}
                {squadName || props.t('N/A')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {reviewDescription && (
        <Typography sx={{ mb: 4 }} variant="body1" gutterBottom>
          <h3>{props.t('Description')}</h3>
          {reviewDescription}
        </Typography>
      )}
      {reviewNote && (
        <Typography sx={{ mb: 4 }} variant="body1" gutterBottom>
          <h3>{props.t('Note')}</h3>
          {reviewNote}
        </Typography>
      )}
    </Box>
  );
};

export const ReviewContentHeaderTranslated =
  withNamespaces()(ReviewContentHeader);
export default ReviewContentHeaderTranslated;
