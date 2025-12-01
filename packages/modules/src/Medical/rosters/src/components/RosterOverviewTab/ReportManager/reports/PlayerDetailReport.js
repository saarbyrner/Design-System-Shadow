// @flow
import { useMemo, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import exportPlayerDetailReport from '@kitman/services/src/services/medical/exportPlayerDetailReport';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import { useGetReportColumnsQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { type ReportColumn } from '@kitman/services/src/services/medical/getReportColumns';
import { SquadSelectorFieldTranslated as SquadSelectorField } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/SquadSelectorField';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';

type Props = {
  squadId: ?number,
  isSettingsOpen: boolean,
  closeSettings: () => void,
  reportSettingsKey: string,
  onExportStartedSuccess?: () => void,
};

const PlayerDetailReport = ({
  squadId,
  isSettingsOpen,
  closeSettings,
  reportSettingsKey,
  onExportStartedSuccess,
  t,
}: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const exportHook = useExports(null, true);
  const { data: columns = [] }: { data: ReportColumn[] } =
    useGetReportColumnsQuery('player_detail', { skip: !isSettingsOpen });

  const columnValues = useMemo(
    () => columns.map(({ value }) => value),
    [columns]
  );

  const reportTitle = t('Player Detail Report');

  const onSave = (state) => {
    closeSettings();

    let visibleColumns = state.activeColumns || [];

    // Add filter as local cache may have previous values that are now unsupported
    visibleColumns = visibleColumns.filter((col) =>
      columns.some((c) => c.value === col)
    );

    // Sort because turning checkboxes on and off changes activeColumns order
    visibleColumns.sort(
      (a, b) => columnValues.indexOf(a) - columnValues.indexOf(b)
    );

    const includePastPlayers = state.includePastPlayers;
    const filters = {};

    exportHook.exportReports(() => {
      trackEvent(performanceMedicineEventNames.playerDetailReportExported);
      return exportPlayerDetailReport(
        state.population,
        [...visibleColumns],
        filters,
        includePastPlayers,
        state.exportFormat
      );
    }, onExportStartedSuccess);
  };

  return (
    <>
      <ExportSettings
        mui
        requiredKeys={['population']}
        title={reportTitle}
        isOpen={isSettingsOpen}
        onSave={onSave}
        onCancel={closeSettings}
        settingsKey={reportSettingsKey}
      >
        <SquadSelectorField
          defaultValue={[
            {
              applies_to_squad: false,
              all_squads: false,
              position_groups: [],
              positions: [],
              athletes: [],
              squads: squadId ? [squadId] : [],
              context_squads: squadId ? [squadId] : [],
            },
          ]}
        />
        <Box sx={{ px: '24px' }}>
          <ExportSettings.CommonFields.Mui.Checkbox
            fieldKey="includePastPlayers"
            label={t('Include Past players')}
            defaultValue={false}
            isCached
          />
        </Box>
        <ExportSettings.CommonFields.Mui.RadioList
          fieldKey="exportFormat"
          label={t('Export format')}
          options={[
            {
              value: 'csv',
              name: 'CSV',
            },
            {
              value: 'xlsx',
              name: 'XLSX',
            },
            {
              value: 'pdf',
              name: 'PDF',
            },
          ]}
          defaultValue="csv"
          isCached
        />
        <Box sx={{ width: '100%', px: '24px' }}>
          <Accordion disableGutters>
            <AccordionSummary
              expandIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ExpandMore} />}
              sx={{ px: 0 }}
            >
              <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                {t('Columns')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <ExportSettings.CommonFields.Mui.CheckboxList
                fieldKey="activeColumns"
                items={columns.map(({ value, label }) => ({
                  value,
                  label,
                }))}
                defaultValue={columnValues}
                styles={{
                  padding: '6px 12px',
                  paddingBottom: '24px',
                }}
                isCached
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      </ExportSettings>
      <ToastDialog
        toasts={exportHook.toasts}
        onCloseToast={exportHook.closeToast}
      />
    </>
  );
};

export const PlayerDetailReportTranslated: ComponentType<Props> =
  withNamespaces()(PlayerDetailReport);
export default PlayerDetailReport;
