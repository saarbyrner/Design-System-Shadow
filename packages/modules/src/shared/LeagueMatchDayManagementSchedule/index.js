// @flow
import { withNamespaces } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { TooltipMenu, TextButton } from '@kitman/components';
import { Box, Button, Stack } from '@kitman/playbook/components';
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { MassUploadTranslated as MassUpload } from '@kitman/modules/src/shared/MassUpload';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import NewLeagueFixtureDrawer from '@kitman/modules/src/MatchDay/components/NewLeagueFixtureDrawer';
import type { Event } from '@kitman/common/src/types/Event';
import {
  planningEventApi,
  TAGS as planningEventTags,
} from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/planningEventApi';
import {
  officialsApi,
  TAGS as officialsTags,
} from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';
import { useSquadScopedPersistentState } from '@kitman/common/src/hooks';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import useFixturesSuccessToast from '@kitman/modules/src/LeagueFixtures/src/mass-upload/useFixturesSuccessToast';
import { EventsScheduleGridTranslated as EventsScheduleGrid } from '../../PlanningHub/src/components/EventsScheduleGrid';
import styles from './styles';
import { getDefaultEventFilters } from '../../PlanningHub/src/utils';
import { MatchdayManagementFiltersTranslated as MatchdayManagementFilters } from '../ScheduleFilters/MatchdayManagementFilters';
import { MatchdayManagementFiltersMUITranslated as MatchdayManagementFiltersMUI } from '../ScheduleFilters/MatchdayManagementFiltersMUI';
import { LastUpdatedDmrTimerTranslated } from '../../PlanningHub/src/components/LastUpdatedDmrTimer';
import downloadCsvTemplate from '../MassUpload/New/utils/downloadCsvTemplate';

type Props = {};

const LeagueMatchDayManagementSchedule = (props: I18nProps<Props>) => {
  const locationAssign = useLocationAssign();
  const { permissions } = usePermissions();
  const { isLeague, isOrgSupervised } = useLeagueOperations();
  const { preferences } = usePreferences();
  const dispatch = useDispatch();
  const { toastDialog } = useFixturesSuccessToast();

  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [isFixtureDrawerOpen, setIsFixtureDrawerOpen] = useState(false);
  const [reloadDataGrid, setReloadDataGrid] = useState(false);
  const initialFiltersRef = useRef(
    getDefaultEventFilters({
      preferences,
      isGameEvents: true,
      isLeague,
    })
  );
  const { state: eventFilters, updateState: setEventFilters } =
    useSquadScopedPersistentState({
      initialState: initialFiltersRef.current,
      sessionKey: 'eventFilters',
    });

  const [editableEvent, setEditableEvent] = useState<?Event>(null);

  const useMuiFilters = window.getFlag('lops-grid-filter-enhancements');

  const showMassUploadFixturesButton =
    isLeague &&
    permissions?.leagueGame?.manageGameInformation &&
    permissions?.settings?.canCreateImports &&
    preferences.manage_league_game &&
    window.getFlag('league-game-mass-game-upload');

  const isManageGameInformationAllowed =
    permissions?.leagueGame.manageGameInformation;

  const openFixtureDrawerMenu = [
    {
      description: props.t('Create Fixture'),
      onClick: () => setIsFixtureDrawerOpen(true),
    },
    ...(showMassUploadFixturesButton
      ? [
          {
            description: props.t('Game template csv'),
            icon: 'icon-export',
            onClick: () => {
              downloadCsvTemplate(
                'League_Fixtures_Import_Template',
                IMPORT_TYPES.LeagueGame
              );
            },
          },
        ]
      : []),
  ];

  const onCloseLeagueFixtureDrawer = () => {
    setIsFixtureDrawerOpen(false);
    setEditableEvent(null);
  };

  useEffect(() => {
    if (reloadDataGrid) {
      setReloadDataGrid(false);
    }
  }, [reloadDataGrid]);

  const renderScheduleHeader = () => (
    <header css={styles.header}>
      <h3 css={styles.title}>{props.t('Schedule')}</h3>
      <Stack direction="row" spacing={1}>
        {isManageGameInformationAllowed && (
          <>
            {isLeague &&
              permissions?.settings?.canCreateImports &&
              !isOrgSupervised && (
                <MassUpload
                  userType="official_assignment"
                  reloadGrid={() => setReloadDataGrid(true)}
                />
              )}
            {showMassUploadFixturesButton && (
              <div>
                <Button
                  sx={{ padding: '4px 12px' }}
                  variant="contained"
                  color="secondary"
                  data-testid="mass-upload-games-btn"
                  onClick={() => {
                    locationAssign(`/mass_upload/${IMPORT_TYPES.LeagueGame}`);
                  }}
                >
                  {props.t('Upload games')}
                </Button>
              </div>
            )}
            {preferences?.manage_league_game && (
              <div>
                <TooltipMenu
                  placement="bottom-end"
                  menuItems={openFixtureDrawerMenu}
                  tooltipTriggerElement={
                    <TextButton
                      iconAfter="icon-more"
                      type="secondary"
                      kitmanDesignSystem
                    />
                  }
                  kitmanDesignSystem
                />
              </div>
            )}
          </>
        )}
      </Stack>
    </header>
  );
  return (
    <div css={styles.wrapper}>
      {renderScheduleHeader()}
      <Box>
        <LastUpdatedDmrTimerTranslated lastUpdatedAt={lastUpdatedAt} />
        {useMuiFilters ? (
          <MatchdayManagementFiltersMUI
            isLeague
            filters={eventFilters}
            setFilters={setEventFilters}
            initialFilters={initialFiltersRef.current}
          />
        ) : (
          <MatchdayManagementFilters
            isLeague
            filters={eventFilters}
            setFilters={setEventFilters}
          />
        )}
      </Box>
      <EventsScheduleGrid
        eventFilters={eventFilters}
        showHeader
        setLastUpdatedAt={setLastUpdatedAt}
        reload={reloadDataGrid}
        onClickEditEvent={(event) => {
          setEditableEvent(event);
          setIsFixtureDrawerOpen(true);
        }}
      />
      <NewLeagueFixtureDrawer
        isOpen={isFixtureDrawerOpen}
        event={editableEvent}
        onClose={onCloseLeagueFixtureDrawer}
        onSubmitSuccess={() => {
          setReloadDataGrid(true);
          dispatch(
            planningEventApi.util.invalidateTags([
              planningEventTags.GAME_INFORMATION,
            ])
          );
          dispatch(
            officialsApi.util.invalidateTags([officialsTags.GAME_OFFICIALS])
          );
        }}
      />
      {toastDialog}
    </div>
  );
};

export const LeagueMatchDayManagementScheduleTranslated: ComponentType<Props> =
  withNamespaces()(LeagueMatchDayManagementSchedule);
export default LeagueMatchDayManagementSchedule;
