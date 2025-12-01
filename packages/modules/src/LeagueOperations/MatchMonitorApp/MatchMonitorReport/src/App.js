/* eslint-disable camelcase */
/* eslint-disable max-depth */
/* eslint-disable no-restricted-syntax */
// @flow
import { useState, useEffect, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  RichTextEditor,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { colors } from '@kitman/common/src/variables';
import { AddNewPlayerPanelTranslated as AddNewPlayerPanel } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/components/AddNewPlayerPanel';
import type { VenueType } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/types';
import type { Event } from '@kitman/common/src/types/Event';
import {
  onToggleNewUserFormPanel,
  onMatchMonitorReportChange,
  onToggleExistingUserPanel,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice';
import { RegisteredPlayersTableTranslated as RegisteredPlayersTable } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/components/RegisteredPlayersTable';
import { UnregisteredPlayersTableTranslated as UnregisteredPlayersTable } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/components/UnregisteredPlayersTable';
import {
  getMatchMonitorReport,
  getRegisteredPlayers,
  getUnregisteredPlayers,
  getIsExistingUserPanelOpen,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors';
import { useSaveMatchMonitorReportMutation } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services';
import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { AddAthletesSidePanelTranslated as AddAthletesSidePanel } from '@kitman/modules/src/PlanningEvent/src/components/AddAthletesSidePanel';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { sanitizeReport } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/utils';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import leagueOperationsEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/leagueOperations';
import { getMatchMonitorTrackingData } from '@kitman/common/src/utils/TrackingData/src/data/leagueOperations/getMatchMonitorData';

type Props = {
  event: Event,
};

const MatchMonitorReportApp = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { isLeague } = useLeagueOperations();
  const { permissions } = usePermissions();
  const isAutosaveEnabled = window.getFlag('league-ops-match-monitor-v3');
  const locationAssign = useLocationAssign();
  const { trackEvent } = useEventTracking();
  const matchReport = useSelector(getMatchMonitorReport);
  const [matchReportLocalCopy, setMatchReportLocalCopy] = useState(null);
  const registeredPlayers = useSelector(getRegisteredPlayers);
  const unregisteredPlayers = useSelector(getUnregisteredPlayers);
  const isAddAthletesPanelOpen = useSelector(getIsExistingUserPanelOpen);

  const canManageMatchMonitorReport =
    permissions.matchMonitor.manageMatchMonitorReport;

  const allRegisteredPlayersCompliant = registeredPlayers
    .map(({ compliant }) => compliant)
    .every(Boolean);

  const reportFlagged =
    unregisteredPlayers.length > 0 ||
    !allRegisteredPlayersCompliant ||
    Boolean(matchReport.notes);

  const reportSubmitted = matchReport?.submitted;
  const [activeTeam, setActiveTeam] = useState<VenueType>('home');
  const [notesLoaded, setNotesLoaded] = useState<boolean>(false);
  // So league users can make changes
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSavingReport, setIsSavingReport] = useState<boolean>(false);
  const [onUpdateMatchMonitorReport] = useSaveMatchMonitorReportMutation();
  const isReadOnly = isLeague ? !isEditMode : reportSubmitted;
  const selectedPlayers = registeredPlayers
    .filter(({ venue_type }) => venue_type === activeTeam)
    .map(({ athlete_id }) => String(athlete_id));
  const [lastSavedReport, setLastSavedReport] = useState(matchReport);
  const updatedAt = matchReport?.updated_at ?? null;
  const [relativeTime, setRelativeTime] = useState('');
  const showTimestamp =
    updatedAt && !isReadOnly && isAutosaveEnabled && lastSavedReport;

  const matchInformation = {
    date: `${moment(props.event.start_date)
      .tz(props.event.local_timezone)
      .format('dddd, MMM D, YYYY [at] HH:mm')} ${props.event.local_timezone}`,
    home: {
      name: props.event?.squad?.owner_name || '',
      squad: props.event?.squad?.name || '',
    },
    away: {
      name: props.event?.opponent_squad?.owner_name || '',
      squad: props.event?.opponent_squad?.name || '',
    },
  };

  const handleOnToggleNewPlayersPanel = () => {
    dispatch(onToggleNewUserFormPanel({ isOpen: true }));

    trackEvent(
      leagueOperationsEventNames.addNewPlayerClicked,
      getMatchMonitorTrackingData({
        product: 'league-ops',
        productArea: 'match-monitor-report',
        feature: 'match-monitor',
      })
    );
  };

  const handleOnToggleExistingUserPanel = (isOpen) => {
    dispatch(onToggleExistingUserPanel({ isOpen }));
  };

  const onSaveOrSubmitMatchReport = (isSubmitted = false) => {
    if (isSubmitted) {
      trackEvent(
        leagueOperationsEventNames.matchMonitorReportSubmitted,
        getMatchMonitorTrackingData({
          product: 'league-ops',
          productArea: 'match-monitor-report',
          feature: 'match-monitor',
        })
      );
    }

    onUpdateMatchMonitorReport({
      id: props.event.id,
      matchReport: {
        ...matchReport,
        monitor_issue: reportFlagged,
        ...(isSubmitted && {
          submitted: true,
          submitted_by_id: currentUser.id,
        }),
      },
    })
      .then(() => {
        dispatch(
          add({
            status: 'SUCCESS',
            title: isSubmitted
              ? props.t('Report submitted')
              : props.t('Report saved'),
          })
        );
        setIsEditMode(false);
      })
      .finally(() => {
        if (isSubmitted) {
          locationAssign('/league-fixtures');
        }
      })
      .catch(() => {
        dispatch(
          add({
            status: 'ERROR',
            title: isSubmitted
              ? props.t('An error has occurred whilst submitting the report')
              : props.t('An error has occurred whilst saving the report'),
          })
        );
      });
  };

  const checkIsRosterCompliant = () => {
    const { home, away } = registeredPlayers.reduce(
      (acc, player) => {
        acc[player.venue_type]?.push(player);
        return acc;
      },
      { home: [], away: [] }
    );

    const checkGroup = (group) => ({
      isEmpty: group.length === 0,
      isCompliant: group.every((player) => player.compliant),
    });

    const { isEmpty: homeEmpty, isCompliant: homeCompliant } = checkGroup(home);
    const { isEmpty: awayEmpty, isCompliant: awayCompliant } = checkGroup(away);

    if (!homeEmpty && awayEmpty) {
      return homeCompliant;
    }
    if (homeEmpty && !awayEmpty) {
      return awayCompliant;
    }

    return homeCompliant || awayCompliant;
  };

  const isCompliant = checkIsRosterCompliant();
  const isNotesAdded = Boolean(matchReport?.notes);
  const canSubmitReport = isCompliant || isNotesAdded;

  const renderReportLeagueEditButton = () => {
    if (!canManageMatchMonitorReport) {
      return null;
    }

    return (
      <Button
        onClick={() => {
          setIsEditMode(true);
          setMatchReportLocalCopy({ ...matchReport });
        }}
      >
        {props.t('Edit')}
      </Button>
    );
  };

  const renderReportLeagueActionButtons = () => (
    <>
      <Button
        color="secondary"
        onClick={() => {
          setIsEditMode(false);
          dispatch(onMatchMonitorReportChange(matchReportLocalCopy));
          if (matchReport.notes !== matchReportLocalCopy?.notes) {
            // Force re-render of the Rich Text Editor to update the text content
            setNotesLoaded(false);
            requestAnimationFrame(() => setNotesLoaded(true));
          }
        }}
      >
        {props.t('Cancel')}
      </Button>
      <Button
        disabled={!canSubmitReport}
        onClick={() => onSaveOrSubmitMatchReport(true)}
      >
        {props.t('Submit Report')}
      </Button>
    </>
  );

  const renderMatchMonitorActions = () => {
    if (!canManageMatchMonitorReport) {
      return null;
    }

    return (
      <>
        <Button
          disabled={!canSubmitReport || reportSubmitted}
          onClick={() => onSaveOrSubmitMatchReport(true)}
        >
          {props.t('Submit Report')}
        </Button>
        {!isAutosaveEnabled && (
          <Button
            color="secondary"
            disabled={isReadOnly}
            onClick={() => onSaveOrSubmitMatchReport()}
          >
            {props.t('Save')}
          </Button>
        )}
      </>
    );
  };

  const onAddExistingPlayers = ({ selectedAthletes, squads }) => {
    // The below code is due to the technical limitations of the AddAthletesSidePanel.
    // This panel will be refactored in the future to be more flexible.
    const uniqueAthleteIds = [...new Set(selectedAthletes)];

    // Maintain the players for the team not being updated.
    const inactiveTeam = activeTeam === 'home' ? 'away' : 'home';
    const game_monitor_report_athletes = registeredPlayers.filter(
      ({ venue_type }) => venue_type === inactiveTeam
    );

    // Track athletes already added
    const addedAthletesSet = new Set(
      game_monitor_report_athletes.map(({ athlete_id }) => athlete_id)
    );

    for (const squad of squads) {
      for (const { positions } of squad.position_groups) {
        for (const { athletes } of positions) {
          for (const athlete of athletes) {
            if (
              uniqueAthleteIds.includes(String(athlete.id)) &&
              !addedAthletesSet.has(athlete.id)
            ) {
              const foundPlayer = registeredPlayers.find(
                ({ athlete_id }) => athlete_id === athlete.id
              );
              if (foundPlayer) {
                game_monitor_report_athletes.push(foundPlayer);
              } else {
                game_monitor_report_athletes.push({
                  athlete_id: athlete.id,
                  venue_type: activeTeam,
                  compliant: false,
                  primary_squad: athlete?.primary_squad || null,
                  athlete,
                });
              }
              addedAthletesSet.add(athlete.id); // Mark this athlete as added
            }
          }
        }
      }
    }
    dispatch(
      onMatchMonitorReportChange({
        game_monitor_report_athletes,
      })
    );
    handleOnToggleExistingUserPanel(false);
  };

  const renderHeaderActions = () => {
    if (isLeague) {
      return isEditMode
        ? renderReportLeagueActionButtons()
        : renderReportLeagueEditButton();
    }
    return renderMatchMonitorActions();
  };

  const handleDeleteAthlete = (id: number) => {
    const newAthletes = registeredPlayers.filter(
      (athlete) => athlete.athlete_id !== id
    );

    dispatch(
      onMatchMonitorReportChange({
        game_monitor_report_athletes: newAthletes,
      })
    );

    trackEvent(
      leagueOperationsEventNames.deletePlayerClicked,
      getMatchMonitorTrackingData({
        product: 'league-ops',
        productArea: 'match-monitor-report',
        feature: 'match-monitor',
      })
    );
  };

  const saveMatchReport = () => {
    setIsSavingReport(true);
    onUpdateMatchMonitorReport({
      id: props.event.id,
      matchReport: {
        ...matchReport,
        monitor_issue: reportFlagged,
      },
    })
      .then(() => {
        setLastSavedReport(matchReport);
        setIsSavingReport(false);
      })
      .catch(() => {
        setIsSavingReport(false);
      });
  };

  useEffect(() => {
    setNotesLoaded(true);
  }, []);

  const debouncedAutosave = useMemo(
    () =>
      debounce(async () => {
        if (!lastSavedReport) {
          setLastSavedReport(matchReport);
          return;
        }

        const reportsDiffer = !isEqual(
          sanitizeReport(matchReport),
          sanitizeReport(lastSavedReport)
        );

        if (reportsDiffer) {
          await saveMatchReport();
        }
      }, 2000),
    [matchReport, lastSavedReport]
  );

  useEffect(() => {
    if (isAutosaveEnabled) {
      debouncedAutosave();
    }
    return () => debouncedAutosave.cancel();
  }, [debouncedAutosave, isAutosaveEnabled]);

  useEffect(() => {
    if (!updatedAt) {
      return undefined; // make return explicit for lint rules
    }

    const update = () => {
      setRelativeTime(
        props.t('Saved {{timeFromNow}}', {
          timeFromNow: moment(updatedAt).fromNow(),
        })
      );
    };

    update();
    const interval = setInterval(update, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [updatedAt]);

  return (
    <>
      <Box>
        <Stack
          p={3}
          sx={{
            backgroundColor: colors.white,
            padding: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: {
                xs: 'flex-start',
                sm: 'center',
              },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color={colors.grey_300}>
                {`${matchInformation.home.name} ${matchInformation.home.squad} vs ${matchInformation.away.name} ${matchInformation.away.squad}`}
              </Typography>
              <Typography
                variant="body2"
                color={colors.grey_300}
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                {matchInformation.date}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: 'flex-end' }}
            >
              {showTimestamp && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isSavingReport && (
                    <Typography>{props.t('Saving...')}</Typography>
                  )}
                  {!isSavingReport && <Typography>{relativeTime}</Typography>}
                </Box>
              )}
              {renderHeaderActions()}
            </Stack>
          </Stack>
          <Stack sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Typography variant="body2" color={colors.grey_300}>
              {matchInformation.date}
            </Typography>
          </Stack>
        </Stack>
        <Box
          py={2}
          sx={{
            height: '100%',
            overflowY: 'auto',
          }}
        >
          {!canSubmitReport && (
            <Box
              display="flex"
              justifyContent="center"
              mb={2}
              width="100%"
              sx={{ paddingX: '12px' }}
            >
              <Alert severity="error" width="100%" sx={{ flex: 1 }}>
                <AlertTitle mb={0}>
                  {props.t(
                    'Note needs to be added for non-compliant player before report can be submitted'
                  )}
                </AlertTitle>
              </Alert>
            </Box>
          )}
          <Grid container spacing={{ sm: 1.5, md: 2 }}>
            <Grid item xs={12} sm={12} md={5}>
              <Box
                height={800}
                sx={{
                  backgroundColor: colors.white,
                  overflowY: 'auto',
                  padding: {
                    xs: 0,
                    sm: 3,
                  },
                }}
              >
                <Stack
                  direction="row"
                  mb={2}
                  gap={1}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: { xs: 2, sm: 0 },
                    pt: { xs: 2, sm: 0 },
                  }}
                >
                  <ToggleButtonGroup
                    size="small"
                    value={activeTeam}
                    exclusive
                    onChange={(e, value) => {
                      if (value) {
                        setActiveTeam(value);
                      }
                    }}
                  >
                    <ToggleButton
                      value="home"
                      disabled={isAddAthletesPanelOpen}
                    >
                      {props.t('Home')}
                    </ToggleButton>
                    <ToggleButton
                      value="away"
                      disabled={isAddAthletesPanelOpen}
                    >
                      {props.t('Away')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {canManageMatchMonitorReport && (
                    <Button
                      sx={{
                        zIndex: 100,
                      }}
                      disabled={isReadOnly}
                      onClick={() => {
                        handleOnToggleExistingUserPanel(true);
                        trackEvent(
                          leagueOperationsEventNames.addRemovePlayersClicked,
                          getMatchMonitorTrackingData({
                            product: 'league-ops',
                            productArea: 'match-monitor-report',
                            feature: 'match-monitor',
                          })
                        );
                      }}
                    >
                      {props.t('Add/Remove Existing Players')}
                    </Button>
                  )}
                </Stack>
                <RegisteredPlayersTable
                  activeTeam={activeTeam}
                  isReadOnly={isReadOnly}
                  onDelete={handleDeleteAthlete}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={7}>
              <Box
                height={800}
                sx={{
                  backgroundColor: colors.white,
                  overflowY: 'auto',
                  padding: {
                    xs: 0,
                    sm: 3,
                  },
                }}
              >
                <Stack
                  direction="row"
                  gap={1}
                  mb={2}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: { xs: 2, sm: 0 },
                    pt: { xs: 2, sm: 0 },
                  }}
                >
                  <Typography variant="h6" color={colors.grey_300}>
                    {props.t('Players not in squad')}
                  </Typography>
                  {canManageMatchMonitorReport && (
                    <Button
                      disabled={isReadOnly}
                      onClick={handleOnToggleNewPlayersPanel}
                    >
                      {props.t('Add New Player')}
                    </Button>
                  )}
                </Stack>
                <UnregisteredPlayersTable
                  matchInformation={matchInformation}
                  isReadOnly={isReadOnly}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                p={3}
                sx={{
                  backgroundColor: colors.white,
                }}
              >
                <Typography variant="h6" color={colors.grey_300} mb={1}>
                  {props.t('Monitor issues')}
                </Typography>
                {notesLoaded && (
                  <RichTextEditor
                    value={matchReport.notes}
                    sx={{
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                    }}
                    kitmanDesignSystem
                    disabled={isReadOnly}
                    onChange={(content) => {
                      let notes = content;
                      if (notes === '<p></p>') {
                        notes = '';
                      }
                      dispatch(
                        onMatchMonitorReportChange({
                          notes,
                        })
                      );
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <AddNewPlayerPanel
        activeTeam={activeTeam}
        homeTeam={matchInformation.home.name}
        awayTeam={matchInformation.away.name}
      />
      <AddAthletesSidePanel
        title={props.t('Add/Remove Existing Players')}
        event={props.event}
        isOpen={isAddAthletesPanelOpen}
        filterByHomeOrganisation={activeTeam === 'home'}
        filterByAwayOrganisation={activeTeam === 'away'}
        preselectedAthleteIds={selectedPlayers}
        emitLocally
        playerSelection
        includePrimarySquad
        onClose={() => handleOnToggleExistingUserPanel(false)}
        onSaveParticipantsSuccess={onAddExistingPlayers}
        disablePositionGrouping
        hideAvailabilityStatus
      />
    </>
  );
};

export const MatchMonitorReportTranslated = withNamespaces()(
  MatchMonitorReportApp
);
export default MatchMonitorReportApp;
