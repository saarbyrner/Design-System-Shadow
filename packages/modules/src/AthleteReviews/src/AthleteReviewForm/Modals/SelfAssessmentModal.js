// @flow
import {
  Autocomplete,
  Box,
  Button,
  DatePicker,
  Stack,
  Modal,
  Grid,
  TextField,
  Typography,
} from '@kitman/playbook/components';
import { AppStatus } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import {
  useGetAssessmentTemplatesQuery,
  useCreateAssessmentMutation,
} from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';
import { useEffect, useState, type ComponentType } from 'react';
import type { AssessmentGroupCreate } from '@kitman/services/src/services/assessmentGroup/createAssessmentGroup';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { useDispatch } from 'react-redux';
import type { Link } from '@kitman/modules/src/AthleteReviews/src/shared/types';
import { validateSelfAssessmentForm } from './utils';
import { getDefaultSelfAssessmentForm } from '../../shared/utils';
import { styles } from './styles';

type Props = {
  athleteId: ?number,
  isOpen: boolean,
  onFormUpdate: (
    objectKeyToUpdate: string,
    newValue: string | Array<Link>
  ) => void,
  setIsOpen: (newValue: boolean) => void,
};

const SelfAssessmentModal = ({
  athleteId,
  isOpen,
  setIsOpen,
  t,
  onFormUpdate,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const {
    data: { assessment_templates: assessmentTemplates = [] } = {
      assessment_templates: [],
    },
    isError: assessmentTemplatesError,
    isLoading: assessmentTemplatesLoading,
  } = useGetAssessmentTemplatesQuery();

  const [isValidationTriggered, setIsValidationTriggered] =
    useState<boolean>(false);

  const [assessment, setAssessment] = useState<AssessmentGroupCreate>({
    ...getDefaultSelfAssessmentForm(),
    athlete_ids: [+athleteId],
  });

  const updateAssessment = (key: string, value: ?(string | number)) => {
    setAssessment((prev) => ({ ...prev, [key]: value }));
  };
  const [createAssessment, { isLoading: isAssessmentSaving }] =
    useCreateAssessmentMutation();

  useEffect(() => {
    setAssessment((prev) => ({
      ...prev,
      athlete_ids: [+athleteId],
    }));
  }, [athleteId]);

  const closeForm = () => {
    setAssessment({
      ...getDefaultSelfAssessmentForm(),
      athlete_ids: [+athleteId],
    });
    setIsValidationTriggered(false);
    setIsOpen(false);
  };

  const onCreateSelfAssessment = () => {
    // check if assessment has every valid field
    const mandatoryFieldCheck = validateSelfAssessmentForm(assessment);
    if (!mandatoryFieldCheck) {
      dispatch(
        add({
          title: t('Required field not complete'),
          status: 'ERROR',
        })
      );
      setIsValidationTriggered(true);
      return;
    }
    createAssessment(assessment).then(({ data, error, errors }) => {
      if (error || errors) {
        dispatch(
          add({
            title: t('Error saving self assessment'),
            status: 'ERROR',
          })
        );
      } else {
        dispatch(
          add({
            title: t('Self assessment saved'),
            status: 'SUCCESS',
          })
        );
        // athleteId must be present at this stage
        window.open(`/assessments?athleteId=${athleteId || ''}`, '_blank');
        onFormUpdate('attached_links', [
          {
            title: data.assessment_group.name,
            uri: `/assessments?athleteId=${+athleteId}`,
          },
        ]);
        onFormUpdate('assessment_group_id', data.assessment_group.id);
        closeForm();
      }
    });
  };

  if (assessmentTemplatesError) {
    return <AppStatus status="error" />;
  }

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby={t('New self assessment')}
      aria-describedby={t(
        'Modal to create new self assessment on the selected athlete'
      )}
    >
      <Box sx={styles.wrapper}>
        <Typography variant="h6" component="h2">
          {t('New Self Assessment')}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {t('Do you want to create a self assessment now?')}
        </Typography>
        <Stack spacing={2} sx={{ mt: 2, width: 400 }}>
          <Autocomplete
            value={
              assessmentTemplates.find(
                ({ id }) => id === assessment.assessment_template_id
              ) || null
            }
            onChange={(e, { id: assessmentTemplateId }) =>
              updateAssessment('assessment_template_id', assessmentTemplateId)
            }
            options={assessmentTemplates}
            getOptionLabel={({ name }) => name}
            renderOption={(props, { id, name }) => (
              <li {...props} key={id}>
                {name}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('Assessment (required)')}
                error={
                  isValidationTriggered && !assessment.assessment_template_id
                }
              />
            )}
            loading={assessmentTemplatesLoading}
          />

          <TextField
            label={t('Assessment title (required)')}
            value={assessment.name}
            onChange={(e) => updateAssessment('name', e.target.value)}
            error={isValidationTriggered && !assessment.name}
          />

          <DatePicker
            formatDensity="dense"
            label={t('Assessment date (required)')}
            value={
              assessment.assessment_group_date &&
              moment(
                assessment.assessment_group_date,
                DateFormatter.dateTransferFormat
              )
            }
            slotProps={{
              textField: {
                error:
                  isValidationTriggered && !assessment.assessment_group_date,
              },
            }}
            onChange={(dateValue) => {
              let selectedDate = null;
              if (dateValue) {
                selectedDate = dateValue.format(
                  DateFormatter.dateTransferFormat
                );
              }
              updateAssessment('assessment_group_date', selectedDate);
            }}
          />
        </Stack>
        <Grid container spacing={1} sx={{ mt: 2 }} justifyContent="right">
          <Grid item>
            <Button
              color="secondary"
              variant="secondary"
              onClick={closeForm}
              disabled={false}
            >
              {t('Cancel')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              onClick={onCreateSelfAssessment}
              disabled={isAssessmentSaving}
            >
              {t('Create')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
export const SelfAssessmentModalTranslated: ComponentType<Props> =
  withNamespaces()(SelfAssessmentModal);
export default SelfAssessmentModal;
