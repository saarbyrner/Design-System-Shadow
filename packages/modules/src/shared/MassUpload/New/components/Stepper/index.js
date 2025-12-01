// @flow
import {
  Stepper as MuiStepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import { type SetState } from '@kitman/common/src/types/react';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import { getFormType } from '@kitman/modules/src/shared/MassUpload/utils/eventTracking';

const Stepper = ({
  activeStep,
  onChange,
  canProceed,
  onImport,
  isLoading,
  importType,
  uploadSteps,
}: {
  activeStep: number,
  onChange: SetState<number>,
  canProceed: boolean,
  onImport: () => Promise<void>,
  isLoading: boolean,
  importType: $Values<typeof IMPORT_TYPES>,
  uploadSteps: Array<{ title: string, caption: string }>,
}) => {
  const { trackEvent } = useEventTracking();

  const isComplete = activeStep === uploadSteps.length - 1;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 24px',
        gap: '70px',
        background: 'white',

        '& .MuiStep-root': {
          paddingLeft: 0,
        },
      }}
    >
      <MuiStepper
        activeStep={activeStep}
        sx={{
          width: '100%',
        }}
      >
        {uploadSteps.map((label) => (
          <Step key={label.title}>
            <StepLabel
              optional={
                <Typography variant="caption">{label.caption}</Typography>
              }
            >
              {label.title}
            </StepLabel>
          </Step>
        ))}
      </MuiStepper>

      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <Button
          onClick={() => {
            onChange(activeStep - 1);
            const IMPORT_STEP_INDEX = uploadSteps.length - 1;
            if (activeStep === IMPORT_STEP_INDEX) {
              trackEvent(
                `Forms — ${getFormType(
                  importType
                )} — Import a CSV file — Previous (back to the file selection step)`
              );
            }
          }}
          color="secondary"
          disabled={activeStep === 0}
        >
          {i18n.t('Previous')}
        </Button>

        {isComplete ? (
          <Button
            onClick={onImport}
            disabled={!canProceed || isLoading}
            variant="contained"
            // Ensuring size is the same when displaying circular progress
            sx={{ width: 77, height: 36 }}
          >
            {isLoading ? <CircularProgress size={20} /> : i18n.t('Import')}
          </Button>
        ) : (
          <Button
            onClick={() => onChange(activeStep + 1)}
            disabled={!canProceed}
          >
            {i18n.t('Next')}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Stepper;
