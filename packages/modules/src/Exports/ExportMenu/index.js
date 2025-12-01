// @flow
import { withNamespaces } from 'react-i18next';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { TooltipMenu, TextButton } from '@kitman/components';
import {
  exportGovernance,
  exportYellowCards,
  exportRedCards,
  exportMatchReport,
  exportMatchMonitorReport,
  exportScout,
  exportScoutAttendees,
} from '@kitman/services/src/services/exports';
import type { EventFilters } from '@kitman/modules/src/PlanningHub/types';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import leagueOperationsEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/leagueOperations';
import { getScoutAccessTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getScoutAccessManagementData';
import downloadCsvTemplate from '../../shared/MassUpload/New/utils/downloadCsvTemplate';
import { IMPORT_TYPES } from '../../shared/MassUpload/New/utils/consts';

type Props = {
  filters: EventFilters,
};

const ExportMenu = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { isLeague } = useLeagueOperations();
  const { preferences } = usePreferences();

  const { trackEvent } = useEventTracking();

  const isGovernanceExportEnabled =
    window.featureFlags['league-ops-governance-export'] &&
    permissions.settings.canRunLeagueExports;
  const isCardsExportEnabled =
    window.featureFlags['league-ops-cards-export'] &&
    permissions.settings.canRunLeagueExports;

  const isMatchReportExportEnabled = permissions.settings.canRunLeagueExports;
  const isMatchMonitorReportExportEnabled =
    window.featureFlags['league-ops-match-monitor-v3'] &&
    !!permissions?.matchMonitor?.matchMonitorReportExport;
  const isScoutExportEnabled =
    permissions?.scoutAccessManagement?.canExportScout;

  const showExportFixturesTemplate =
    isLeague &&
    permissions?.leagueGame?.manageGameInformation &&
    permissions?.settings?.canCreateImports &&
    preferences.manage_league_game &&
    window.getFlag('league-game-mass-game-upload');

  // TODO: Once the feature flags are removed we can solely rely on the "permissions.settings.canRunLeagueExports"
  // And only use one "useExport" for all league ops exports
  const leagueOpsGovernanceExports = useExports(
    null,
    isGovernanceExportEnabled
  );

  const leagueOpsCardsExports = useExports(null, isCardsExportEnabled);

  const leagueOpsMatchReportExports = useExports(
    null,
    isMatchReportExportEnabled
  );

  const leagueOpsScoutsExports = useExports(null, isScoutExportEnabled);

  const matchMonitorExports = useExports(
    null,
    isMatchMonitorReportExportEnabled
  );

  const governanceExportItem = isGovernanceExportEnabled
    ? [
        {
          key: 'governance',
          description: props.t('Governance Export'),
          onClick: () =>
            leagueOpsGovernanceExports.exportReports(() =>
              exportGovernance({
                competitionIds: props.filters.competitions,
              })
            ),
          icon: 'icon-export',
          isDisabled: false,
        },
      ]
    : [];

  const cardExportItem = isCardsExportEnabled
    ? [
        {
          description: props.t('Yellow Card Export'),
          onClick: () =>
            leagueOpsCardsExports.exportReports(() =>
              exportYellowCards(props.filters)
            ),
          icon: 'icon-export',
          isDisabled: false,
        },
        {
          description: props.t('Red Card Export'),
          onClick: () =>
            leagueOpsCardsExports.exportReports(() =>
              exportRedCards(props.filters)
            ),
          icon: 'icon-export',
          isDisabled: false,
        },
      ]
    : [];

  const matchReportExportItem = isMatchReportExportEnabled
    ? [
        {
          description: props.t('Match Report Export'),
          onClick: () =>
            leagueOpsMatchReportExports.exportReports(() =>
              exportMatchReport(props.filters)
            ),
          icon: 'icon-export',
          isDisabled: false,
        },
      ]
    : [];

  const matchMonitorReportExportItem = isMatchMonitorReportExportEnabled
    ? [
        {
          description: props.t('Match Monitor Export'),
          onClick: () =>
            matchMonitorExports.exportReports(() =>
              exportMatchMonitorReport(props.filters)
            ),
          icon: 'icon-export',
          isDisabled: false,
        },
      ]
    : [];

  const scoutExportItem = isScoutExportEnabled
    ? [
        {
          description: props.t('Visiting scout attendees export'),
          onClick: () => {
            leagueOpsScoutsExports.exportReports(() =>
              exportScout(props.filters)
            );
            trackEvent(
              leagueOperationsEventNames.scoutAccessExported,
              getScoutAccessTrackingData({
                product: 'league-ops',
                productArea: 'schedule',
                feature: 'scout-access-management',
              })
            );
          },
          icon: 'icon-export',
          isDisabled: false,
        },
        {
          description: props.t('Internal scout schedule export'),
          onClick: () => {
            leagueOpsScoutsExports.exportReports(() =>
              exportScoutAttendees(props.filters)
            );
            trackEvent(
              leagueOperationsEventNames.scoutAttendeesExported,
              getScoutAccessTrackingData({
                product: 'league-ops',
                productArea: 'schedule',
                feature: 'scout-access-management',
              })
            );
          },
          icon: 'icon-export',
          isDisabled: false,
        },
      ]
    : [];

  const fixturesTemplate = showExportFixturesTemplate
    ? [
        {
          description: props.t('Game template csv'),
          onClick: () => {
            downloadCsvTemplate(
              'League_Fixtures_Import_Template',
              IMPORT_TYPES.LeagueGame
            );
          },
          icon: 'icon-export',
          isDisabled: false,
        },
      ]
    : [];

  const menuItems = [
    ...governanceExportItem,
    ...cardExportItem,
    ...matchReportExportItem,
    ...matchMonitorReportExportItem,
    ...scoutExportItem,
    ...fixturesTemplate,
  ];

  const viewDownloadMenu = menuItems.length > 0;

  const renderExportMenu = () => {
    return (
      viewDownloadMenu && (
        <>
          <TooltipMenu
            appendToParent
            placement="bottom-end"
            offset={[0, 5]}
            menuItems={menuItems}
            tooltipTriggerElement={
              <TextButton
                text={props.t('Download')}
                type="secondary"
                iconAfter="icon-chevron-down"
                kitmanDesignSystem
              />
            }
            kitmanDesignSystem
          />
          <ToastDialog
            toasts={leagueOpsGovernanceExports.toasts}
            onCloseToast={leagueOpsGovernanceExports.closeToast}
          />
          {/* TODO: once feature flags are removed we can then have one toast dialog */}
          <ToastDialog
            toasts={leagueOpsCardsExports.toasts}
            onCloseToast={leagueOpsCardsExports.closeToast}
          />
          <ToastDialog
            toasts={leagueOpsMatchReportExports.toasts}
            onCloseToast={leagueOpsMatchReportExports.closeToast}
          />
          <ToastDialog
            toasts={leagueOpsScoutsExports.toasts}
            onCloseToast={leagueOpsScoutsExports.closeToast}
          />
          <ToastDialog
            toasts={matchMonitorExports.toasts}
            onCloseToast={matchMonitorExports.closeToast}
          />
        </>
      )
    );
  };

  return renderExportMenu();
};

export const ExportMenuTranslated = withNamespaces()(ExportMenu);
export default ExportMenu;
