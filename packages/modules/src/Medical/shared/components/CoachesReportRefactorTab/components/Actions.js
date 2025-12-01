// @flow
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { withNamespaces } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Typography,
  Box,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { rootTheme } from '@kitman/playbook/themes';
import { ReportManagerTranslated as ReportManager } from '@kitman/modules/src/Medical/rosters/src/components/CoachesReportTab/components/ReportManager';
import type { CoachesFilters } from '@kitman/modules/src/Medical/rosters/src/components/CoachesReportTab/index';

const style = {
  actionButtons: { margin: 0, display: 'flex', gap: '4px' },
};

type Props = {
  dataGridCurrentDate: string,
  canExport: boolean,
  filters: CoachesFilters,
  rehydrateGrid: () => void,
  canCreateNotes?: boolean,
  isCoachesNotesError: boolean,
  isCoachesNotesFetching: boolean,
  handleCopyLastReport: (athleteIds: Array<number>) => void,
};

const Actions = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const {
    t,
    canExport,
    filters,
    canCreateNotes,
    isCoachesNotesFetching,
    isCoachesNotesError,
    handleCopyLastReport,
    dataGridCurrentDate,
  } = props;

  return (
    <Box sx={style.actionButtons}>
      {canExport && (
        <ReportManager
          squads={filters.squads}
          dataGridCurrentDate={dataGridCurrentDate}
        />
      )}
      {canCreateNotes && (
        <Button
          disabled={isCoachesNotesFetching}
          sx={[
            { height: '2.8rem' },
            isCoachesNotesError && { border: '1px solid red' },
          ]}
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => {
            handleCopyLastReport([]);
            trackEvent(performanceMedicineEventNames.copyLastDailyStatusReport);
          }}
        >
          <Typography
            fontWeight={500}
            sx={{
              color: rootTheme.palette.text.secondary,
              padding: '0',
              whiteSpace: 'nowrap',
            }}
          >
            {t('Copy last report')}
          </Typography>

          {isCoachesNotesFetching && (
            <CircularProgress
              color="inherit"
              size={18}
              sx={{ marginLeft: '0.5rem' }}
            />
          )}
        </Button>
      )}
    </Box>
  );
};

export const ActionsTranslated = withNamespaces()(Actions);
export default Actions;
