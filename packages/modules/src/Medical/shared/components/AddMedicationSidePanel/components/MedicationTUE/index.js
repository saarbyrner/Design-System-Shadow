// @flow
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import moment from 'moment';
import {
  Box,
  Button,
  Collapse,
  SelectWrapper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Grid2 as Grid,
} from '@kitman/playbook/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import { saveNote } from '@kitman/services';
import { NOTE_TYPE } from '@kitman/modules/src/Medical/shared/types/medical/MedicalNote';
import { sanitizeDate } from '@kitman/playbook/utils/DatePicker';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import styles from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/MedicationTUE/styles';
import useTUEForm from '@kitman/modules/src/Medical/shared/components/AddTUESidePanel/hooks/useTUEForm';
import { getRestricVisibilityValue } from '@kitman/modules/src/Medical/shared/utils';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  athleteId: number,
  isDisabled: boolean,
  toggleOpen: () => void,
};

type FullProps = I18nProps<Props>;

export type MedicationTUERefType = {
  checkTUEValidation: () => boolean,
  saveTUE: () => Promise<void>,
} | null;

const MedicationTUE = (
  { isOpen, athleteId, isDisabled, toggleOpen, t }: FullProps,
  ref
) => {
  const { formState, dispatch } = useTUEForm();

  type TUEMode = 'new' | 'existing';

  const [TUEToggleMode, setTUEToggleMode] = useState<TUEMode>('new');
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);

  const checkTUEValidation = () => {
    setIsValidationCheckAllowed(true);

    const requiredFields = [
      athleteId,
      formState.tue_date,
      formState.tue_name,
      formState.tue_expiration_date,
    ];

    const allRequiredFieldsAreValid = requiredFields.every((item) => item);

    return allRequiredFieldsAreValid;
  };

  const saveNewTUERecord = (attachmentIds) => {
    const newTUERecord = {
      attachment_ids: attachmentIds,
      expiration_date: formState.tue_expiration_date,
      injury_ids: formState.injury_occurrence_ids,
      illness_ids: formState.illness_occurrence_ids,
      chronic_issue_ids: formState.chronic_issue_ids,
      medical_type: 'TUE',
      medical_name: formState.tue_name,
      note: 'TUE',
      note_date: formState.tue_date,
      note_type: NOTE_TYPE.MEDICAL_NOTE_ID,
      restricted: formState.restricted_to_doc,
      psych_only: formState.restricted_to_psych,
    };
    return saveNote(athleteId, newTUERecord);
  };

  const saveTUE = async () => {
    if (TUEToggleMode === 'new') {
      return saveNewTUERecord([]); // TODO: revisit attachments in next PR
    }
    // TODO: In the future we will associate existing TUE
    // with the medication. Needs BE
    return Promise.resolve();
  };

  useImperativeHandle(ref, () => ({
    saveTUE,
    checkTUEValidation,
  }));

  useEffect(() => {
    if (!isOpen) {
      dispatch({ type: 'CLEAR_FORM' });
    }
  }, [dispatch, isOpen]);

  const visibilityOptions = [
    {
      value: 'DEFAULT',
      label: t('Default visibility'),
    },
    {
      value: 'DOCTORS',
      label: t('Doctors'),
    },
  ];

  return (
    <Box>
      <Collapse in={!isOpen} data-testid="collapse-header">
        <Button
          startIcon={<KitmanIcon name={KITMAN_ICON_NAMES.Add} />}
          variant="text"
          disabled={isDisabled}
          onClick={() => {
            toggleOpen();
          }}
        >
          {t('Add TUE')}
        </Button>
      </Collapse>
      <Collapse in={isOpen} data-testid="collapse-body">
        <Box pb={1} pl="16px" sx={{ borderLeft: styles.borderIndent }}>
          <Box
            display="flex"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={styles.subtitle}
            >
              {t('Add TUE')}
            </Typography>
            <Button
              variant="text"
              disabled={isDisabled}
              onClick={() => {
                toggleOpen();
              }}
            >
              {t('Cancel')}
            </Button>
          </Box>
          <Stack
            direction="column"
            gap={1}
            alignItems="left"
            justifyContent="space-between"
          >
            <ToggleButtonGroup
              color="primary"
              value={TUEToggleMode}
              exclusive
              onChange={(event, newValue) => {
                if (newValue) {
                  setTUEToggleMode(newValue);
                }
              }}
            >
              <ToggleButton value="new">{t('Add New TUE')}</ToggleButton>
              <ToggleButton value="existing">
                {t('Use Existing TUE')}
              </ToggleButton>
            </ToggleButtonGroup>
            <TextField
              label={t('TUE name')}
              value={formState.tue_name || ''}
              onChange={(e) => {
                dispatch({
                  type: 'SET_TUE_NAME',
                  tue_name: e.target.value,
                });
              }}
              fullWidth
              margin="none"
              disabled={isDisabled}
              sx={{ width: '100%' }}
              error={isValidationCheckAllowed && !formState.tue_name}
            />

            <Grid container columns={12} columnSpacing={1}>
              <Grid xs={4}>
                <MovementAwareDatePicker
                  athleteId={athleteId}
                  value={formState.tue_date ? moment(formState.tue_date) : null}
                  name="TUEDate"
                  onChange={(date) => {
                    dispatch({
                      type: 'SET_TUE_DATE',
                      tue_date: moment(sanitizeDate(date)).format(
                        dateTransferFormat
                      ),
                    });
                  }}
                  label={t('Date of TUE')}
                  disableFuture
                  isInvalid={isValidationCheckAllowed && !formState.tue_date}
                />
              </Grid>
              <Grid xs={4}>
                <MovementAwareDatePicker
                  athleteId={athleteId}
                  value={
                    formState.tue_expiration_date
                      ? moment(formState.tue_expiration_date)
                      : null
                  }
                  name="TUEExpirationDate"
                  onChange={(date) => {
                    dispatch({
                      type: 'SET_TUE_EXPIRATION_DATE',
                      tue_expiration_date: moment(sanitizeDate(date)).format(
                        dateTransferFormat
                      ),
                    });
                  }}
                  label={t('Expiration date')}
                  isInvalid={
                    isValidationCheckAllowed && !formState.tue_expiration_date
                  }
                />
              </Grid>
            </Grid>
            <Grid container columns={12} columnSpacing={1}>
              <Grid xs={6}>
                <SelectWrapper
                  value={getRestricVisibilityValue(
                    formState.restricted_to_doc,
                    formState.restricted_to_psych
                  )}
                  onChange={(e) => {
                    dispatch({
                      type: 'SET_VISIBILITY',
                      visibilityId: e.target.value,
                    });
                  }}
                  multiple={false}
                  options={visibilityOptions}
                  label={t('Visibility')}
                  minWidth={0}
                />
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default forwardRef<FullProps, MedicationTUERefType>(MedicationTUE);
