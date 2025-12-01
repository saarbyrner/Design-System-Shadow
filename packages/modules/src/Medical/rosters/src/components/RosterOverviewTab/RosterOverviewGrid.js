// @flow
import {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { colors } from '@kitman/common/src/variables';
import severityLabelColour from '@kitman/common/src/utils/severityLabelColour';
import { withNamespaces } from 'react-i18next';
import {
  EllipsisTooltipText,
  DataGrid,
  TextLink,
  TextTag,
  UserAvatar,
} from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  getAthleteId,
  determineMedicalLevelAndTab,
  getNoteActionElement,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import getAthletesAvailabilities from '@kitman/services/src/services/medical/getAthletesAvailabilities';
import AvailabilityStatusCell from './AvailabilityStatusCell';
import { OpenIssuesTranslated as OpenIssues } from './OpenIssues';
import { LatestNoteTranslated as LatestNote } from './LatestNote';
import { CardiacStatusTranslated as CardiacStatus } from './CardiacStatus';
import type { GridData } from '../../../types';

type OpenForCurrentAthlete = (currentAthleteId: number) => void;

type Props = {
  fetchMoreData: () => void,
  grid: GridData,
  isLoading: boolean,
  onOpenAddDiagnosticSidePanel: OpenForCurrentAthlete,
  onOpenAddIssuePanel: ({
    currentAthleteId: number,
    isChronicCondition?: boolean,
  }) => void,
  onOpenAddMedicalNotePanel: OpenForCurrentAthlete,
  onOpenAddModificationSidePanel: OpenForCurrentAthlete,
  onOpenAddAllergySidePanel: OpenForCurrentAthlete,
  onOpenAddMedicalAlertSidePanel: OpenForCurrentAthlete,
  onOpenAddProcedureSidePanel: OpenForCurrentAthlete,
  onOpenAddVaccinationSidePanel: OpenForCurrentAthlete,
  onOpenAddTUESidePanel: OpenForCurrentAthlete,
  onOpenAddTreatmentsSidePanel: OpenForCurrentAthlete,
};

const style = {
  loadingText: {
    color: colors.neutral_300,
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: '20px',
    marginTop: 24,
    textAlign: 'center',
    height: 60,
  },
  grid: {
    ...(!window.getFlag('update-perf-med-headers') && { marginTop: 24 }),
    padding: 0,
    'tbody tr td': {
      padding: 8,
    },
    'tr th:first-of-type, tr td:first-of-type': {
      paddingLeft: 24,
    },
    'tr th:last-child, tr td:last-child': {
      paddingRight: 24,
    },
    '.dataGrid__loading': {
      margin: 30,
    },
    '.dataGrid__body .athlete__row': {
      verticalAlign: 'top',
    },
    '.dataGrid__cell': {
      width: 600,
      maxWidth: 600,
      padding: 8,
      paddingTop: '0.26em',
      paddingBottom: '0.135em',
      overflow: 'visible',
    },
  },
  headerCell: {
    color: colors.grey_100,
    fontSize: '9pt',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  athleteCell: {
    display: 'flex',
    width: 280,
  },
  imageContainer: {
    display: 'flex',
    width: '1.79em',
  },
  image: {
    borderRadius: 20,
    height: 40,
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 12,
  },
  position: {
    color: colors.grey_100,
    fontSize: 12,
  },
  availabilityMarker: {
    alignItems: 'center',
    border: `2px solid ${colors.p06}`,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 28,
    marginTop: 28,
    position: 'absolute',
    span: {
      borderRadius: 10,
      display: 'block',
      height: 8,
      width: 8,
    },
  },
  availabilityMarker__available: {
    backgroundColor: colors.green_200,
  },
  availabilityMarker__injured: {
    backgroundColor: colors.orange_100,
  },
  availabilityMarker__unavailable: {
    backgroundColor: colors.red_100,
  },
  availabilityMarker__returning: {
    backgroundColor: colors.yellow_100,
  },
  rosters: {
    marginRight: 4,
  },
  availabilityStatus: {
    '.availabilityLabel': {
      fontSize: 14,
    },
  },
  unavailableSince: {
    fontSize: 12,
  },
  athleteAllergies: {
    display: 'flex',
    flexDirection: 'column',
  },
  athleteAllergy: {
    marginBottom: 4,
  },
  defaultCell: {
    display: 'block',
    width: 250,
    overflowWrap: 'normal',
    whiteSpace: 'normal',
  },
};

const gridBottomMarginToHideOverflowOnBody = '21px';

let interval;

const RosterOverviewGrid = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const { permissions } = usePermissions();

  const rosterContainerRef = useRef();
  const [height, setHeight] = useState();
  const [gridColumns, setGridColumns] = useState([]);
  const [shouldFetchData, setShouldFetchData] = useState(true);
  // When set, only this row enters edit mode for open injuries/illnesses
  const [editingRowId, setEditingRowId] = useState(null);
  const [availabilityMap, setAvailabilityMap] = useState<Object>({});
  const availabilityInfoDisabledFlag = window.getFlag(
    'availability-info-disabled'
  );
  const availabilityStatusProgressEnabled = window.getFlag(
    'availability-status-progress'
  );
  const pollingEnabled = window.getFlag('availability-status-polling');

  const fetchAthleteAvailabilities = useCallback(
    async (athleteIds: Array<number>) => {
      if (!availabilityStatusProgressEnabled) return;
      if (athleteIds?.length === 0) return;

      // To support the infinite scroll that fetches 10 athletes at a time
      // we are getting the last 10 athletes from the rows to update the availability statuses
      const response = await getAthletesAvailabilities(athleteIds.slice(-10));
      setAvailabilityMap((prevState) => {
        const nextState = { ...prevState };
        response.forEach((availability) => {
          nextState[availability.athlete_id] = availability;
        });
        return nextState;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    setAvailabilityMap({});
    fetchAthleteAvailabilities(props.grid.rows.map((row) => row.id));
  }, [fetchAthleteAvailabilities, props.grid.rows]);

  // Poll every 10 seconds for availability statuses that have their processing in progress
  // Poll will not occur if there is no availability statuses that are in progress
  useEffect(() => {
    if (!pollingEnabled) return undefined;

    if (interval) clearInterval(interval);

    interval = setInterval(() => {
      const availabilityMapValues = Object.values(availabilityMap);

      const athleteIdsWithProcessingInProgress = availabilityMapValues
        // $FlowIgnore[incompatible-use] this is cause by Object.values which return a mixed type
        .filter((availability) => availability.processing_in_progress)
        // $FlowIgnore[incompatible-use]
        .map((availability) => availability.athlete_id);
      fetchAthleteAvailabilities(athleteIdsWithProcessingInProgress);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [availabilityMap, fetchAthleteAvailabilities]);

  useLayoutEffect(() => {
    if (rosterContainerRef.current) {
      const { y } = rosterContainerRef?.current?.getBoundingClientRect();
      setHeight(
        `calc((100vh - ${y}px) - ${gridBottomMarginToHideOverflowOnBody})`
      );
    }
  }, []);

  /** 
    Adding a useEffect to make sure that when we fetch more data,
    the rows satisfy the client viewHeight,
    couldnt use current height useState because its tied to closely to css styling.
  */
  useEffect(() => {
    if (rosterContainerRef.current) {
      const { y, bottom } =
        rosterContainerRef?.current?.getBoundingClientRect();
      const maxHeightJs = window.document.body.clientHeight - y;
      const heightOfGridContainer = bottom - y + 25;

      // need to reset shouldFetchData to true as this ratio
      // changes when user utilizes filters and shrinks the grid
      if (maxHeightJs > heightOfGridContainer) {
        setShouldFetchData(true);
      }

      if (
        maxHeightJs >= heightOfGridContainer &&
        !props.isLoading &&
        props.grid.next_id &&
        shouldFetchData
      ) {
        props.fetchMoreData();
        if (
          maxHeightJs === heightOfGridContainer ||
          maxHeightJs < heightOfGridContainer
        ) {
          setShouldFetchData(false);
        }
      }
    }
  }, [props.isLoading, props.grid.next_id, props.fetchMoreData]);

  // Ideally, this should be done in the back end.
  // Hopefully a new grid will make this easier to manage
  // TODO: TEMPORARY MEASURE UNTIL PERMISSIONS ARE DERIVED IN BE
  const getGridColumnsByPermission = () => {
    const columnConfig = [
      {
        id: 'athlete',
        displayName: props.t('Athlete'),
        isPermitted: true,
      },
      {
        id: 'availability_status',
        displayName: props.t('Availability Status'),
        isPermitted:
          permissions.medical.availability.canView &&
          !availabilityInfoDisabledFlag,
      },
      {
        id: 'open_injuries_illnesses',
        displayName: props.t('Open Injury/ Illness'),
        isPermitted: permissions.medical.issues.canView,
      },
      {
        id: 'latest_note',
        displayName: props.t('Latest Note'),
        isPermitted:
          permissions.medical.notes.canView &&
          window.featureFlags['emr-show-latest-note-column'],
      },
      {
        id: 'cardiac_screening',
        displayName: props.t('Cardiac screening'),
        isPermitted:
          permissions.medical.diagnostics.canView &&
          window.featureFlags['cardiac-screening-v1'],
      },
      {
        id: 'allergies',
        displayName: props.t('Allergies'),
        isPermitted: permissions.medical.allergies.canView,
      },
      { id: 'squad', displayName: props.t('Squad'), isPermitted: true },
    ];

    return columnConfig
      .filter((col) => col.isPermitted)
      .map((column) => {
        return {
          id: column.id,
          row_key: column.id,
          content: (
            <div css={style.headerCell}>
              <span css={style[`headerCell__${column.id}`]}>
                {column.displayName}
              </span>
            </div>
          ),
          isHeader: true,
        };
      });
  };

  useEffect(() => {
    setGridColumns(getGridColumnsByPermission());
  }, [props.grid]);

  // We are fetching the availability statuses for the athlete that is being edited
  // when the user closes the edit mode
  const onCloseEditMode = useCallback(async () => {
    if (editingRowId) fetchAthleteAvailabilities([editingRowId]);
    setEditingRowId(null);
  }, [editingRowId, fetchAthleteAvailabilities]);

  const getCellContent = ({ row_key: rowKey }, rowData) => {
    switch (rowKey) {
      case 'athlete': {
        let availability;

        if (
          !availabilityInfoDisabledFlag &&
          permissions.medical.availability.canView
        ) {
          availability = rowData.athlete.availability;
        }
        if (
          !availabilityInfoDisabledFlag &&
          availabilityStatusProgressEnabled &&
          permissions.medical.availability.canView &&
          availabilityMap?.[rowData.id]
        ) {
          availability = availabilityMap[rowData.id]?.availability_status;
        }

        return (
          <div css={style.athleteCell}>
            <div css={style.imageContainer}>
              <UserAvatar
                url={rowData.athlete.avatar_url}
                firstname={rowData.athlete.fullname}
                displayInitialsAsFallback
                availability={availability}
                size="MEDIUM"
              />
            </div>
            <div css={style.detailsContainer}>
              <TextLink
                text={rowData.athlete.fullname}
                href={`/medical/athletes/${rowData.id}`}
                kitmanDesignSystem
              />
              <span data-testid="positionRow" css={style.position}>
                {rowData.player_id
                  ? `${rowData.player_id} - ${rowData.athlete.position}`
                  : rowData.athlete.position}
              </span>
            </div>
          </div>
        );
      }
      case 'open_injuries_illnesses':
        return (
          <OpenIssues
            athleteId={rowData.id}
            athleteName={rowData.athlete.fullname}
            athleteAvatarUrl={rowData.athlete.avatar_url}
            hasMore={rowData.open_injuries_illnesses.has_more}
            openIssues={rowData.open_injuries_illnesses.issues}
            isEditing={editingRowId === rowData.id}
            onCancelEdit={onCloseEditMode}
            onSaved={onCloseEditMode}
          />
        );
      case 'latest_note':
        return rowData.latest_note ? (
          <LatestNote latestNote={rowData.latest_note} />
        ) : null;
      case 'squad': {
        const squadNames = rowData.squad
          .map((squad) => (squad.primary ? `${squad.name}*` : squad.name))
          .join(', ');
        return (
          <div css={style.rosters}>
            <EllipsisTooltipText
              content={squadNames}
              displayEllipsisWidth={280}
            />
          </div>
        );
      }
      case 'availability_status':
        return (
          <div css={style.availabilityStatus}>
            <AvailabilityStatusCell
              baseAvailabilityStatus={rowData.availability_status}
              availabilityRecord={availabilityMap[rowData.id]}
            />
          </div>
        );
      case 'cardiac_screening':
        return (
          <CardiacStatus
            cardiacStatus={rowData.athlete.athlete_cardiac_screening_status}
          />
        );
      case 'allergies':
        return rowData.allergies && rowData.allergies.length > 0 ? (
          <div css={style.athleteAllergies}>
            {rowData.allergies.map((allergy) => (
              // $FlowIgnore[prop-missing]
              <div key={allergy.id} css={style.athleteAllergy}>
                <TextTag
                  // $FlowIgnore[prop-missing]
                  content={allergy.display_name}
                  // $FlowIgnore[prop-missing]
                  backgroundColor={severityLabelColour(allergy.severity)}
                  textColor={
                    allergy.severity === 'severe'
                      ? colors.white
                      : colors.grey_400
                  }
                  fontSize={12}
                />
              </div>
            ))}
          </div>
        ) : null;
      default:
        return <span css={style.defaultCell}>{rowData[rowKey]}</span>;
    }
  };

  const generateRowActions = (rowData) => {
    const rowActions = [];
    const changeStatus = {
      id: 'change-status',
      text: props.t('Change status'),
      onCallAction: (currentAthleteId) => {
        setEditingRowId(currentAthleteId);
      },
    };

    const addIssue = {
      id: 'issue',
      text: props.t('Add injury/ illness'),
      onCallAction: (currentAthleteId) => {
        props.onOpenAddIssuePanel({
          currentAthleteId,
        });
        trackEvent(
          performanceMedicineEventNames.clickAthleteRowMeatballInjuryIllness,
          getAthleteId(currentAthleteId)
        );
      },
    };

    const addNote = {
      id: 'note',
      text: props.t('Add note'),
      onCallAction: (currentAthleteId) => {
        props.onOpenAddMedicalNotePanel(currentAthleteId);
        trackEvent(performanceMedicineEventNames.clickAddMedicalNote, {
          ...determineMedicalLevelAndTab(),
          ...getNoteActionElement('Row meatball'),
        });
      },
    };

    const addModifications = {
      id: 'modification',
      text: props.t('Add modification'),
      onCallAction: props.onOpenAddModificationSidePanel,
    };

    const addTreatment = {
      id: 'treatment',
      text: props.t('Add treatment'),
      onCallAction: props.onOpenAddTreatmentsSidePanel,
    };

    const addDiagnostic = {
      id: 'diagnostic',
      text: props.t('Add diagnostic'),
      onCallAction: props.onOpenAddDiagnosticSidePanel,
    };

    const addAllergy = {
      id: 'allergy',
      text: props.t('Add allergy'),
      onCallAction: props.onOpenAddAllergySidePanel,
    };

    const addChronicCondition = {
      id: 'chronic-condition',
      text: props.t('Add chronic condition'),
      onCallAction: (currentAthleteId) =>
        props.onOpenAddIssuePanel({
          currentAthleteId,
          isChronicCondition: true,
        }),
    };

    const addMedicalAlert = {
      id: 'medical',
      text: props.t('Add medical alert'),
      onCallAction: props.onOpenAddMedicalAlertSidePanel,
    };

    const addProcedure = {
      id: 'procedure',
      text: props.t('Add procedure'),
      onCallAction: props.onOpenAddProcedureSidePanel,
    };

    const addTUE = {
      id: 'tue',
      text: props.t('Add TUE'),
      onCallAction: props.onOpenAddTUESidePanel,
    };

    const addVaccination = {
      id: 'vaccination',
      text: props.t('Add vaccination'),
      onCallAction: props.onOpenAddVaccinationSidePanel,
    };

    if (permissions.medical.issues.canCreate) {
      rowActions.push(addIssue);
    }

    if (
      permissions.medical.issues.canEdit &&
      window.getFlag('roster-player-injury-status-update') &&
      rowData?.open_injuries_illnesses?.issues?.length > 0
    ) {
      rowActions.push(changeStatus);
    }

    if (permissions.medical.notes.canCreate) {
      rowActions.push(addNote);
    }

    if (permissions.medical.modifications.canCreate) {
      rowActions.push(addModifications);
    }

    if (permissions.medical.treatments.canCreate) {
      rowActions.push(addTreatment);
    }

    if (permissions.medical.diagnostics.canCreate) {
      rowActions.push(addDiagnostic);
    }

    if (permissions.medical.vaccinations.canCreate) {
      rowActions.push(addVaccination);
    }

    if (permissions.medical.allergies.canCreate) {
      rowActions.push(addAllergy);
    }

    if (
      window.featureFlags['chronic-injury-illness'] &&
      permissions.medical.issues.canCreate
    ) {
      rowActions.push(addChronicCondition);
    }

    if (
      window.featureFlags['medical-alerts-side-panel'] &&
      permissions.medical.alerts.canCreate
    ) {
      rowActions.push(addMedicalAlert);
    }

    if (
      window.featureFlags['medical-procedure'] &&
      permissions.medical.procedures.canCreate
    ) {
      rowActions.push(addProcedure);
    }

    if (permissions.medical.tue.canCreate && window.getFlag('pm-show-tue')) {
      rowActions.push(addTUE);
    }

    return rowActions;
  };

  const getGridRows = () => {
    const gridRows = props.grid.rows.map((row) => {
      const cells = gridColumns.map((column) => {
        const content = getCellContent(column, row);
        return {
          id: column.row_key,
          content,
          allowOverflow: false,
        };
      });

      const rowActions = generateRowActions(row);

      return {
        id: row.id,
        cells,
        classnames: {
          athlete__row: true,
        },
        rowActions: rowActions.length > 0 ? rowActions : undefined,
      };
    });

    return gridRows;
  };

  return (
    // $FlowFixMe
    <div id="rosterGridRef" ref={rosterContainerRef} css={style.grid}>
      <DataGrid
        columns={getGridColumnsByPermission()}
        rows={getGridRows()}
        emptyTableText={props.t('There are no athletes')}
        isTableEmpty={props.grid.rows.length === 0}
        isFullyLoaded={!props.isLoading && !props.grid.next_id}
        fetchMoreData={props.fetchMoreData}
        isLoading={props.isLoading}
        // A height is forced on this component as the scrollOnBody event is triggered regardless of what tab you are viewing
        maxHeight={height}
      />
    </div>
  );
};

export const RosterOverviewGridTranslated =
  withNamespaces()(RosterOverviewGrid);
export default RosterOverviewGrid;
