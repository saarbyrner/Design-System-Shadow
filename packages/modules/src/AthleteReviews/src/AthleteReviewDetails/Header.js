// @flow
import { useState, useRef, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Box,
  Button,
  Grid,
  Typography,
  Link,
  Avatar,
} from '@kitman/playbook/components';
import {
  useLocationAssign,
  useLocationPathname,
} from '@kitman/common/src/hooks';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import type { StaffUserTypes } from '@kitman/services/src/services/medical/getStaffUsers';
import type { AthleteReviewType } from '@kitman/services/src/mocks/handlers/getAthleteReviewTypes';
import type {
  ReviewFormData,
  StatusLabelsEnumLikeKeys,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';
import { useEditReviewMutation } from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { useDispatch } from 'react-redux';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import sharedStyles from '@kitman/modules/src/AthleteReviews/src/shared/style';
import type { AssessmentGroup } from '@kitman/services/src/types';
import DownloadPdfSidePanel from '@kitman/modules/src/DownloadPdfSidePanel';
import PdfDownloadModal from './PdfDownloadModal';
import PrintView from './PrintView';
import * as styles from './style';

import {
  removeEmptyUrlsFromForm,
  dispatchToastMessage,
  dismissToasts,
  getAthleteId,
  getStatusMenuOptions,
} from '../shared/utils';
import ActionsMenu from './ActionsMenu';
import { getStatusLabelsEnumLike } from '../shared/enum-likes';
import { DialogContentPreviewTranslated as DialogContentPreview } from './DialogContentPreview';

type Props = {
  form: ReviewFormData,
  staffUsers: StaffUserTypes,
  athleteReviewTypes: AthleteReviewType,
  setForm: (
    newForm: ReviewFormData | ((prevForm: ReviewFormData) => ReviewFormData)
  ) => void,
  assessmentGroups: Array<AssessmentGroup>,
};

const Header = ({
  form,
  staffUsers,
  athleteReviewTypes,
  setForm,
  assessmentGroups,
  t,
}: I18nProps<Props>) => {
  const {
    id: formId,
    athlete_review_type_id: athleteReviewTypeId,
    start_date: startDate,
    end_date: endDate,
    user_ids: userIds,
    review_description: reviewDescription,
    review_note: reviewNote,
    development_goals: developmentGoals,
    review_status: reviewStatus,
    attached_links: attachedLinks,
    squad_name: squadName,
    country,
    height,
    age,
  } = form;
  const locationAssign = useLocationAssign();
  const pathname = useLocationPathname();
  const athleteId = getAthleteId(pathname);
  const athleteReviewHref = `/athletes/${athleteId}/athlete_reviews`;
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [headerEnabled, setHeaderEnabled] = useState(true);
  const [selfAssessmentEnabled, setSelfAssessmentEnabled] = useState(true);
  const [coachingCommentsEnabled, setCoachingCommentsEnabled] = useState(true);
  const [goalStatusEnabled, setGoalStatusEnabled] = useState(true);

  const formattedStartDate = formatStandard({
    date: moment(startDate),
  });
  const formattedEndDate = endDate
    ? formatStandard({
        date: moment(endDate),
      })
    : '';
  const formDatesValue = `${formattedStartDate} - ${formattedEndDate}`;

  const associatedStaff = staffUsers
    ? staffUsers
        .filter(({ id }) => userIds.includes(id))
        .map(({ fullname }) => fullname)
        .join(', ')
    : '';

  const athleteReviewType =
    athleteReviewTypes.find(({ id }) => id === athleteReviewTypeId)
      ?.review_name || '';

  const [editReview] = useEditReviewMutation();
  const printViewRef = useRef(null);

  const isGoalsAndReviewsEnabled =
    window.getFlag('athlete-profile-goals-and-reviews');

  const handleReviewDownload = () => {
    if (isGoalsAndReviewsEnabled) {
      setModalOpen(true);
    } else {
      window.location.href = `/athletes/${athleteId}/athlete_reviews/${+formId}/export.pdf`;
    }
  };

  const handleConfirmDownload = () => {
    dispatchToastMessage({
      dispatch,
      id: 'loadingReport',
      message: t('Generating report'),
      status: toastStatusEnumLike.Loading,
    });

    if (printViewRef.current) {
      window.print();

      setModalOpen(false);

      dispatchToastMessage({
        dispatch,
        message: t('Report generation successful'),
        status: toastStatusEnumLike.Success,
      });

      setTimeout(() => {
        dispatchToastMessage({
          dispatch,
          message: t('Report generation successful'),
          status: toastStatusEnumLike.Success,
        });
        dismissToasts(dispatch);
      }, 2000);
    } else {
      dismissToasts(dispatch);

      dispatchToastMessage({
        dispatch,
        message: t('Error generating report'),
        status: toastStatusEnumLike.Error,
      });

      setModalOpen(false);
    }
  };

  const updateReviewStatus = (newReviewStatus: StatusLabelsEnumLikeKeys) => {
    const translatedStatusLabels = getStatusLabelsEnumLike(t);
    const formWithEmptyUrlsRemoved = removeEmptyUrlsFromForm(form);
    editReview({
      athleteId,
      reviewId: formId,
      form: { ...formWithEmptyUrlsRemoved, review_status: newReviewStatus },
    }).then(({ error }) => {
      if (error) {
        dispatchToastMessage({
          dispatch,
          message: t('Error editing review status'),
          status: toastStatusEnumLike.Error,
        });
      } else {
        setForm((prev) => ({ ...prev, review_status: newReviewStatus }));
        dispatchToastMessage({
          dispatch,
          message: t('Review marked as {{statusLabel}}', {
            statusLabel:
              translatedStatusLabels[newReviewStatus].toLocaleLowerCase(),
          }),
          status: toastStatusEnumLike.Success,
        });
      }
    });
  };

  const menuItems = [
    {
      id: 'edit',
      title: t('Edit'),
      onClick: () => locationAssign(`${pathname}/edit`),
    },
    ...getStatusMenuOptions({
      currentStatus: reviewStatus,
      updateReviewStatus,
      t,
    }),
  ];

  const renderAthleteNameAndTypeInfo = () => {
    if (isGoalsAndReviewsEnabled) {
      return athleteReviewType;
    }

    const fullname = developmentGoals[0]?.athlete?.fullname || '';
    return fullname ? `${fullname} - ${athleteReviewType}` : athleteReviewType;
  };

  return (
    <Grid component="header" container spacing={2}>
      <Grid xs item>
        <Button
          color="secondary"
          href={athleteReviewHref}
          startIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ChevronLeft} />}
          sx={sharedStyles.linkStyle}
        >
          {t('Athlete reviews')}
        </Button>
      </Grid>

      <Grid xs container item spacing={1} justifyContent="right">
        <Grid item>
          <Button onClick={handleReviewDownload} color="primary">
            {t('Download')}
          </Button>
        </Grid>
        {isGoalsAndReviewsEnabled && (
          <PdfDownloadModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleReviewDownload}
            title=""
            dialogContent={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <DownloadPdfSidePanel
                  isOpen={isModalOpen}
                  onClose={() => setModalOpen(false)}
                  onConfirm={handleConfirmDownload}
                  onCancel={() => setModalOpen(false)}
                  headerEnabled={headerEnabled}
                  selfAssessmentEnabled={selfAssessmentEnabled}
                  coachingCommentsEnabled={coachingCommentsEnabled}
                  goalStatusEnabled={goalStatusEnabled}
                  onHeaderChange={setHeaderEnabled}
                  onSelfAssessmentChange={setSelfAssessmentEnabled}
                  onCoachingCommentsChange={setCoachingCommentsEnabled}
                  onGoalStatusChange={setGoalStatusEnabled}
                />
                <DialogContentPreview
                  headerEnabled={headerEnabled}
                  selfAssessmentEnabled={selfAssessmentEnabled}
                  coachingCommentsEnabled={coachingCommentsEnabled}
                  goalStatusEnabled={goalStatusEnabled}
                  reviewData={form}
                  assessmentData={assessmentGroups}
                />
              </Box>
            }
          />
        )}
        {isGoalsAndReviewsEnabled && (
          <div ref={printViewRef}>
            <PrintView
              form={form}
              athleteName={developmentGoals[0]?.athlete?.fullname}
              athleteReviewType={athleteReviewType}
              formDatesValue={formDatesValue}
              associatedStaff={associatedStaff}
              headerEnabled={headerEnabled}
              selfAssessmentEnabled={selfAssessmentEnabled}
              coachingCommentsEnabled={coachingCommentsEnabled}
              goalStatusEnabled={goalStatusEnabled}
              reviewData={form}
              assessmentData={assessmentGroups}
              t={t}
            />
          </div>
        )}

        <Grid item>
          <ActionsMenu items={menuItems} />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        {isGoalsAndReviewsEnabled && (
          <Box css={styles.athleteHeader}>
            <Avatar
              src={developmentGoals[0]?.athlete?.avatar_url}
              alt={developmentGoals[0]?.athlete?.avatar_url}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography variant="h6" gutterBottom>
                {developmentGoals[0]?.athlete?.fullname}
              </Typography>

              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="body1">
                    <strong>{t('DoB')}</strong>
                    <div>{developmentGoals[0]?.athlete?.date_of_birth}</div>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    <strong>{t('Age')}</strong>
                    <div>{age}</div>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    <strong>{t('Country')}</strong>
                    <div>{country}</div>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    <strong>{t('Height')}</strong>
                    <div>{height}</div>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    <strong>{t('Positions')}</strong>
                    <div>{developmentGoals[0]?.athlete?.position?.name}</div>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    <strong>{t('Squad')}</strong>
                    <div>{squadName}</div>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        <Typography variant="h5" gutterBottom>
          {renderAthleteNameAndTypeInfo()}
        </Typography>

        <Typography variant="body1" gutterBottom>
          {`${formDatesValue} | ${associatedStaff}`}
        </Typography>

        <Typography variant="body1" gutterBottom>
          {reviewDescription}
        </Typography>

        {isGoalsAndReviewsEnabled && (
          <Typography variant="body1" gutterBottom>
            {reviewNote}
          </Typography>
        )}
        {attachedLinks.length > 0 && (
          <Box mt={1} sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <Link
              key={attachedLinks[0]?.id}
              href={attachedLinks[0]?.uri}
              underline="hover"
              mr={1}
              sx={sharedStyles.linkStyle}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.Link} />
              {`${t('Self Assessment')} - ${attachedLinks[0]?.title}`}
            </Link>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export const HeaderTranslated: ComponentType<Props> = withNamespaces()(Header);
export default Header;
