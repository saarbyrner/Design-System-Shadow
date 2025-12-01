// @flow
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { Box, Typography, Button } from '@kitman/playbook/components';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { rootTheme } from '@kitman/playbook/themes';
import type { Translation } from '@kitman/common/src/types/i18n';

type Props = {
  t: Translation,
  rowSelectionModel: Array<number>,
  canCreateNotes: boolean,
  setModalOpen: (boolean) => void,
  handleCopyLastReport: (athleteIds: Array<number>) => void,
  isCoachesNotesError: boolean,
};

const getNoteCreationHeaderStyles = (variant) => {
  switch (variant) {
    case 'container':
      return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: rootTheme.palette.secondary.main,
        width: '100%',
        height: '5rem',
        padding: '1rem',
      };
    case 'text':
      return {
        fontWeight: '600',
        color: rootTheme.palette.primary.main,
      };
    case 'buttonWrapper':
      return {
        display: 'flex',
        gap: '0.625rem',
      };
    default:
      return {};
  }
};

const NoteCreationHeader = ({
  t,
  rowSelectionModel,
  canCreateNotes,
  setModalOpen,
  handleCopyLastReport,
  isCoachesNotesError,
}: Props) => {
  const { trackEvent } = useEventTracking();
  return (
    <Box
      sx={getNoteCreationHeaderStyles('container')}
      id="noteCreationHeader"
      data-testid="noteCreationHeader"
    >
      <Typography sx={getNoteCreationHeaderStyles('text')}>
        {t('{{count}} selected', {
          count: rowSelectionModel.length,
        })}
      </Typography>
      {canCreateNotes && (
        <Box sx={getNoteCreationHeaderStyles('buttonWrapper')}>
          <Button onClick={() => setModalOpen(true)} variant="text">
            {t('Add notes')}
            <Box sx={{ marginLeft: '0.5rem' }}>
              <KitmanIcon name={KITMAN_ICON_NAMES.Note} />
            </Box>
          </Button>
          <Button
            onClick={() => {
              handleCopyLastReport(rowSelectionModel);
              trackEvent(
                performanceMedicineEventNames.copyLastDailyStatusNotes
              );
            }}
            variant="text"
            sx={isCoachesNotesError && { border: '1px solid red' }}
          >
            {t('Copy last note')}
            <Box sx={{ marginLeft: '0.5rem' }}>
              <KitmanIcon name={KITMAN_ICON_NAMES.FileCopy} />
            </Box>
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default NoteCreationHeader;
