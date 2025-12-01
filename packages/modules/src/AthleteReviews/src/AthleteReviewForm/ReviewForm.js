// @flow
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ComponentType,
} from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { AppStatus } from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  useGetAthleteReviewTypesQuery,
  useGetAthleteAssessmentGroupsQuery,
} from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';
// Form data
import { useGetStaffUsersQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  DatePicker,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@kitman/playbook/components';
import type {
  ReviewFormData,
  Link,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDispatch } from 'react-redux';
import styles from '@kitman/components/src/PopupBox/styles';
import { useLastReviewNote } from './hooks';
import SelfAssessmentModal from './Modals/SelfAssessmentModal';
import { dispatchToastMessage } from '../shared/utils';

const CheckBoxOutlineIcon = <CheckBoxOutlineBlank fontSize="small" />;
const CheckedIcon = <CheckBox fontSize="small" />;

type Props = {
  athleteId: ?number,
  form: ReviewFormData,
  onFormUpdate: (key: string, value: ?(string | Array<Link>)) => void,
  isValidationTriggered: boolean,
};

const ReviewForm = ({
  athleteId,
  form: {
    athlete_review_type_id: reviewTypeId,
    user_ids: userIds,
    start_date: startDate,
    end_date: endDate,
    review_description: reviewDescription,
    review_note: reviewNote,
    attached_links: attachedLinks,
    assessment_group_id: assessmentGroupId,
  },
  onFormUpdate,
  t,
  isValidationTriggered,
}: I18nProps<Props>) => {
  const [isCreateAssessmentModalOpen, setIsCreateAssessmentModalOpen] =
    useState(false);

  const reviewNoteRef = useRef();

  const {
    data: staffUsers = [],
    error: staffUsersError,
    isLoading: areStaffUsersLoading,
  } = useGetStaffUsersQuery();

  const {
    data: athleteReviewTypes = [],
    isError: athleteReviewTypesError,
    isLoading: areAthleteReviewTypesLoading,
  } = useGetAthleteReviewTypesQuery();

  const {
    data: athleteAssessmentGroups = {
      assessment_groups: [],
      next_id: null,
    },
    isError: athleteAssessmentGroupsError,
    isLoading: athleteAssessmentGroupsLoading,
  } = useGetAthleteAssessmentGroupsQuery(
    { athleteId },
    {
      skip: !athleteId,
    }
  );

  const { lastReviewNote, isFetching, fetchError, fetchLastReviewNote } =
    useLastReviewNote();
  const dispatch = useDispatch();

  const isError =
    athleteReviewTypesError || staffUsersError || athleteAssessmentGroupsError;

  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'done'>(
    'idle'
  );

  useEffect(() => {
    if (copyStatus === 'copying') {
      if (lastReviewNote !== null) {
        onFormUpdate('review_note', lastReviewNote);
        reviewNoteRef.current?.focus();
        setCopyStatus('done');
      } else if (!isFetching) {
        setCopyStatus('idle');
      }
    }
  }, [lastReviewNote, copyStatus, isFetching, onFormUpdate]);

  const copyLastNote = useCallback(async () => {
    if (athleteId) {
      setCopyStatus('copying');
      await fetchLastReviewNote(athleteId);
    }
  }, [athleteId, fetchLastReviewNote]);

  useEffect(() => {
    if (fetchError) {
      dispatchToastMessage({
        dispatch,
        message: t('Failed to fetch the last review note.'),
        status: 'error',
      });
    }
  }, [fetchError, dispatch, t]);

  if (isError) {
    return <AppStatus status="error" />;
  }
  return (
    <Stack sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        {t('Review setup')}
      </Typography>
      <Stack spacing={2}>
        <Autocomplete
          value={
            attachedLinks.length > 0 && assessmentGroupId
              ? athleteAssessmentGroups.assessment_groups.find(
                  ({ id }) => id === assessmentGroupId
                )
              : null
          }
          onChange={(e, value) => {
            onFormUpdate(
              'attached_links',
              value && athleteId
                ? [
                    {
                      title: value.name,
                      uri: `/assessments?athleteId=${athleteId}`,
                    },
                  ]
                : []
            );
            onFormUpdate('assessment_group_id', value.id);
          }}
          options={athleteAssessmentGroups.assessment_groups}
          getOptionLabel={({ name }) => name}
          renderOption={(props, { id, name }) => (
            <li {...props} key={id}>
              {name}
            </li>
          )}
          PaperComponent={({ children }) => {
            return (
              <Paper>
                {children}
                <Button
                  fullWidth
                  sx={{ justifyContent: 'flex-start', pl: 2 }}
                  onMouseDown={() => {
                    setIsCreateAssessmentModalOpen(true);
                  }}
                >
                  {t('Create Assessment')}
                </Button>
              </Paper>
            );
          }}
          style={{ maxWidth: 350 }}
          renderInput={(params) => (
            <TextField {...params} label={t('Self Assessment')} />
          )}
          loading={athleteAssessmentGroupsLoading}
        />
        <Autocomplete
          value={
            reviewTypeId
              ? athleteReviewTypes.find(({ id }) => id === reviewTypeId)
              : null
          }
          onChange={(e, value) =>
            onFormUpdate('athlete_review_type_id', value?.id)
          }
          options={athleteReviewTypes}
          getOptionLabel={({ review_name: reviewName }) => reviewName}
          renderOption={(props, { id, review_name: reviewName }) => (
            <li {...props} key={id}>
              {reviewName}
            </li>
          )}
          style={{ maxWidth: 350 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('Review Type (required)')}
              error={isValidationTriggered && !reviewTypeId}
            />
          )}
          loading={areAthleteReviewTypesLoading}
        />

        <Autocomplete
          value={
            userIds
              ? staffUsers.filter(({ id: staffUserId }) =>
                  userIds.includes(staffUserId)
                )
              : null
          }
          multiple
          onChange={(e, values) =>
            onFormUpdate(
              'user_ids',
              values.map(({ id }) => id)
            )
          }
          options={staffUsers}
          disableCloseOnSelect
          getOptionLabel={(option) => option.fullname}
          renderOption={(props, option, { selected }) => (
            <li {...props} key={option.id}>
              <Checkbox
                icon={CheckBoxOutlineIcon}
                checkedIcon={CheckedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.fullname}
            </li>
          )}
          style={{ width: 350 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('Staff (required)')}
              error={isValidationTriggered && userIds.length <= 0}
            />
          )}
          loading={areStaffUsersLoading}
        />

        <Stack direction="row" spacing={1}>
          <DatePicker
            formatDensity="dense"
            label={t('Start date (required)')}
            value={
              startDate && moment(startDate, DateFormatter.dateTransferFormat)
            }
            onChange={(selectedDate) => {
              let startDateTime = null;
              if (selectedDate) {
                startDateTime = selectedDate.format(
                  DateFormatter.dateTransferFormat
                );
              }
              onFormUpdate('start_date', startDateTime);
              onFormUpdate('start_time', startDateTime);
            }}
            slotProps={{
              textField: {
                error: isValidationTriggered && !startDate,
              },
            }}
            {...(endDate ? { maxDate: moment(endDate) } : {})}
          />
          <DatePicker
            formatDensity="dense"
            label={t('End date')}
            value={endDate && moment(endDate, DateFormatter.dateTransferFormat)}
            onChange={(selectedDate) =>
              onFormUpdate(
                'end_date',
                selectedDate.format(DateFormatter.dateTransferFormat)
              )
            }
            {...(startDate ? { minDate: moment(startDate) } : {})}
          />
        </Stack>

        <Box sx={{ maxWidth: 500 }}>
          <TextField
            label={t('Description (Optional)')}
            value={reviewDescription}
            onChange={(e) => {
              onFormUpdate('review_description', e.target.value);
            }}
            multiline
            fullWidth
          />
        </Box>
        {window.getFlag('athlete-profile-goals-and-reviews') && (
          <div style={styles.flexCenter}>
            <Box sx={{ width: '100%', maxWidth: 500 }}>
              <TextField
                label={t('Note (Optional)')}
                value={reviewNote}
                onChange={(e) => {
                  onFormUpdate('review_note', e.target.value);
                }}
                multiline
                fullWidth
                inputRef={reviewNoteRef}
              />
            </Box>
            <Button
              variant="contained"
              onClick={copyLastNote}
              disabled={isFetching || copyStatus === 'copying'}
              sx={{ mt: 1, ml: 2 }}
            >
              {t('Copy Last Note')}
            </Button>
          </div>
        )}
      </Stack>
      <SelfAssessmentModal
        athleteId={athleteId}
        isOpen={isCreateAssessmentModalOpen}
        setIsOpen={setIsCreateAssessmentModalOpen}
        onFormUpdate={onFormUpdate}
        t={t}
      />
    </Stack>
  );
};

export const ReviewFormTranslated: ComponentType<Props> =
  withNamespaces()(ReviewForm);
export default ReviewForm;
