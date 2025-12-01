// @flow
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import _flatten from 'lodash/flatten';
import debounce from 'lodash/debounce';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { fullWidthMenuCustomStyles } from '@kitman/components/src/Select';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import {
  AppStatus,
  Select,
  TextButton,
  DelayedLoadingFeedback,
  SlidingPanelResponsive,
} from '@kitman/components';

import {
  getAvailabilityList,
  getIssueList,
} from '@kitman/common/src/utils/workload';
import {
  getAthleteData,
  getPositionGroups,
  getPermittedSquads,
} from '@kitman/services';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  determineMedicalLevelAndTab,
  getDocumentActionElement,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import { RosterOverviewGridTranslated as RosterOverviewGrid } from './RosterOverviewGrid';
import AddDiagnosticSidePanel from '../../../../shared/containers/AddDiagnosticSidePanel';
import AddMedicalNoteSidePanel from '../../../../shared/containers/AddMedicalNoteSidePanel';
import AddModificationSidePanel from '../../../../shared/containers/AddModificationSidePanel';
import AddTreatmentsSidePanel from '../../../../shared/containers/AddTreatmentsSidePanel';
import AddAllergySidePanel from '../../../../shared/containers/AddAllergySidePanel';
import AddMedicalAlertSidePanel from '../../../../shared/containers/AddMedicalAlertSidePanel';
import AddMedicalDocumentSidePanel from '../../../../shared/containers/AddMedicalDocumentSidePanel';
import AddMedicalFileSidePanel from '../../../../shared/containers/AddMedicalFileSidePanel';
import AddProcedureSidePanel from '../../../../shared/containers/AddProcedureSidePanel';
import AddVaccinationSidePanel from '../../../../shared/containers/AddVaccinationSidePanel';
import AddConcussionTestResultSidePanel from '../../../../shared/containers/AddConcussionTestResultSidePanel';
import AddTUESidePanel from '../../../../shared/containers/AddTUESidePanel';
import { ActionsTranslated as Actions } from './components/Actions';
import SearchBarFilter from './components/SearchBarFilter';

import type {
  RequestStatus,
  ConcussionTestProtocol,
  PanelType,
} from '../../../../shared/types';
import type { RosterFilters, GridData } from '../../../types';

type Props = {
  fetchGrid: (resetGrid: boolean) => void,
  onFiltersUpdate: Function,
  grid: GridData,
  filters: RosterFilters,
  onOpenAddDiagnosticSidePanel: Function,
  onOpenAddIssuePanel: Function,
  onOpenAddMedicalNotePanel: Function,
  onOpenAddModificationSidePanel: Function,
  onOpenAddTreatmentsSidePanel: Function,
  onOpenAddAllergySidePanel: Function,
  onOpenAddMedicalAlertSidePanel: Function,
  onOpenAddProcedureSidePanel: Function,
  onOpenAddIssuePanelWithAthleteData: Function,
  onOpenAddVaccinationPanel: Function,
  onOpenAddConcussionTestResultSidePanel: Function,
  onOpenAddTUESidePanel: Function,
  onSetRequestStatus: Function,
  requestStatus: RequestStatus,
};

const style = {
  content: css`
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
  `,
  header: css`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    ${!window.featureFlags['update-perf-med-headers'] &&
    `margin-bottom: 8px; padding: 24px;`}
    ${window.featureFlags['update-perf-med-headers'] &&
    `padding: 1.14em 1.70em 0.85em 1.70em`}
  `,
  titleContainer: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.57em;
    width: 100%;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 20px;
    font-weight: 600;
  `,
  actionButtons: css`
    margin: 0;
    display: flex;
    gap: 4px;
  `,
  disabledElement: css`
    pointer-events: none;
    opacity: 0.5;
  `,
  filters: css`
    display: flex;
  `,
  'filters--desktop': css`
    gap: 5px;

    @media (max-width: ${breakPoints.desktop}) {
      display: none;
    }
  `,
  'filters--mobile': css`
    gap: 5px;

    button {
      margin-bottom: 8px;
    }

    @media (min-width: ${breakPoints.desktop}) {
      display: none;
    }

    @media (max-width: ${breakPoints.tablet}) {
      align-items: flex-start;
      flex-direction: column;
    }
  `,
  filter: css`
    @media (min-width: ${breakPoints.desktop}) {
      min-width: 180px;

      .inputText {
        width: 240px;
      }
    }

    @media (max-width: ${breakPoints.desktop}) {
      display: block;
      margin-bottom: 10px;
      width: 100%;
    }
  `,
  filtersPanel: css`
    padding-left: 25px;
    padding-right: 25px;
    margin: 8px 0 0 0;
  `,
  grid: css`
    margin-top: 24px;

    tbody {
      tr {
        td {
          padding: 8px 0;
        }
      }
    }

    tr {
      th:first-child,
      td:first-child {
        padding-left: 24px;
      }
      th:last-child,
      td:last-child {
        padding-right: 24px;
      }
    }

    .dataGrid__loading {
      margin-top: 80px;
    }

    .dataGrid__body {
      .athlete__row {
        vertical-align: top;
      }
    }

    .dataGrid__cell {
      overflow: visible;
    }
  `,
};

const RosterOverviewTab = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { trackEvent } = useEventTracking();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filtersDisabled, setFiltersDisabled] = useState(true); // No filtering until data is ready
  const [positions, setPositions] = useState();
  const [squads, setSquads] = useState();
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [athleteId, setAthleteId] = useState<number | null>(null);
  const [isMedicalDocumentPanelOpen, setIsMedicalDocumentPanelOpen] =
    useState<boolean>(false);
  const [isMedicalFilePanelOpen, setIsMedicalFilePanelOpen] =
    useState<boolean>(false);
  const injuryRosterFilterFlag =
    window.featureFlags['injured-filter-on-roster-page'];
  const availabilityInfoDisabledFlag =
    window.featureFlags['availability-info-disabled'];

  const availabilityOptions = defaultMapToOptions(getAvailabilityList());
  const issueOptions = defaultMapToOptions(getIssueList());
  const { toasts, toastDispatch } = useToasts();

  const getNextAthletes = (reset = false) => props.fetchGrid(reset);

  const resetGrid = () => {
    getNextAthletes(true);
    setFiltersDisabled(false); // Enable filters now that data is present
  };

  useEffect(() => {
    Promise.all([getPositionGroups(), getPermittedSquads()]).then(
      ([positionGroupsData, squadsData]) => {
        setPositions(
          _flatten(
            positionGroupsData.map((positionGroup) => positionGroup.positions)
          ).map((position) => ({
            value: position.id,
            label: position.name,
          }))
        );
        setSquads(
          squadsData.map((squad) => ({ value: squad.id, label: squad.name }))
        );
        setIsInitialDataLoaded(true);
        props.onSetRequestStatus('SUCCESS');
      },
      () => props.onSetRequestStatus('FAILURE')
    );
  }, []);

  const debounceResetGrid = useDebouncedCallback(() => resetGrid(), 400);

  useEffect(() => {
    if (!isInitialDataLoaded) {
      return;
    }

    debounceResetGrid();
  }, [props.filters]);

  if (!isInitialDataLoaded) {
    switch (props.requestStatus) {
      case 'PENDING':
        return <DelayedLoadingFeedback />;
      case 'FAILURE':
        return <AppStatus status="error" />;
      default:
        return null;
    }
  }

  const onOpenAddIssuePanel = ({
    currentAthleteId,
    isChronicCondition = false,
  }: {
    currentAthleteId: number,
    isChronicCondition: boolean,
  }) => {
    getAthleteData(currentAthleteId).then(
      (fetchedAthleteData) => {
        props.onOpenAddIssuePanelWithAthleteData(
          currentAthleteId,
          fetchedAthleteData.squad_names[0].id,
          fetchedAthleteData.position_id,
          isChronicCondition
        );
        props.onSetRequestStatus('SUCCESS');
      },
      () => props.onSetRequestStatus('FAILURE')
    );
  };

  const handleSearch = (value) =>
    props.onFiltersUpdate({
      athlete_name: value,
    });

  const debounceHandleSearch = debounce(handleSearch, 400);

  const searchBar = (
    <div css={style.filter}>
      <SearchBarFilter
        data-testid="rosterOverviewTab|SearchBar"
        onValidation={(value) => {
          debounceHandleSearch(value);
        }}
        placeholder={props.t('Search athletes')}
      />
    </div>
  );

  const squadFilter = (
    <div css={style.filter}>
      <Select
        appendToBody
        data-testid="rosterOverviewTab|SquadSelect"
        options={squads}
        onChange={(selectedItems) =>
          props.onFiltersUpdate({
            squads: selectedItems,
          })
        }
        value={props.filters.squads}
        placeholder={props.t('Squad')}
        isMulti
        inlineShownSelection
        customSelectStyles={fullWidthMenuCustomStyles}
      />
    </div>
  );

  const positionFilter = (
    <div css={style.filter}>
      <Select
        appendToBody
        data-testid="rosterOverviewTab|PositionSelect"
        options={positions}
        onChange={(selectedItems) =>
          props.onFiltersUpdate({
            positions: selectedItems,
          })
        }
        value={props.filters.positions}
        placeholder={props.t('Position')}
        isMulti
        inlineShownSelection
      />
    </div>
  );

  const availabilityFilter = (
    <div css={style.filter}>
      <Select
        appendToBody
        data-testid="rosterOverviewTab|AvailabilitySelect"
        options={availabilityOptions}
        onChange={(selectedItems) =>
          props.onFiltersUpdate({
            availabilities: selectedItems,
          })
        }
        value={props.filters.availabilities}
        placeholder={props.t('Availability')}
        isMulti
        showAutoWidthDropdown
        inlineShownSelection
      />
    </div>
  );

  const issueFilter = (
    <div css={style.filter}>
      <Select
        appendToBody
        data-testid="rosterOverviewTab|IssueSelect"
        options={issueOptions}
        onChange={(selectedItems) =>
          props.onFiltersUpdate({
            issues: selectedItems,
          })
        }
        value={props.filters.issues}
        placeholder={props.t('Injured')}
        isMulti
        showAutoWidthDropdown
        inlineShownSelection
      />
    </div>
  );

  const handleOnOpenPanel = (panel: PanelType) => {
    setAthleteId(null);

    switch (panel) {
      case 'ALLERGY':
        return props.onOpenAddAllergySidePanel();
      case 'CHRONIC_CONDITION':
        return props.onOpenAddIssuePanel({ isChronicCondition: true });
      case 'DIAGNOSTIC':
        return props.onOpenAddDiagnosticSidePanel();
      case 'DOCUMENT':
        return setIsMedicalDocumentPanelOpen(true);
      case 'FILE':
        trackEvent(performanceMedicineEventNames.clickAddMedicalDocument, {
          ...determineMedicalLevelAndTab(),
          ...getDocumentActionElement('Add menu'),
        });
        return setIsMedicalFilePanelOpen(true);
      case 'ISSUE':
        return props.onOpenAddIssuePanel();
      case 'KING_DEVICK':
        return props.onOpenAddConcussionTestResultSidePanel('KING-DEVICK');
      case 'MEDICAL_ALERT':
        return props.onOpenAddMedicalAlertSidePanel();
      case 'MEDICAL_NOTE':
        return props.onOpenAddMedicalNotePanel();
      case 'MODIFICATION':
        return props.onOpenAddModificationSidePanel();
      case 'NPC':
        return props.onOpenAddConcussionTestResultSidePanel('NPC');
      case 'PROCEDURE':
        return props.onOpenAddProcedureSidePanel();
      case 'TREATMENT':
        return props.onOpenAddTreatmentsSidePanel();
      case 'TUE':
        return props.onOpenAddTUESidePanel();
      case 'VACCINATION':
        return props.onOpenAddVaccinationPanel();
      default:
        return props.onOpenAddIssuePanel();
    }
  };

  return (
    <div className="rosterOverviewTab" css={style.content}>
      <header css={[style.header, filtersDisabled && style.disabledElement]}>
        <div css={style.titleContainer}>
          <h3 css={style.title}>{props.t('Team')}</h3>
          <Actions
            filters={props.filters}
            onOpenPanel={(panel) => handleOnOpenPanel(panel)}
          />
        </div>

        <div
          css={[style.filters, style['filters--desktop']]}
          data-testid="TeamFilters|DesktopFilters"
        >
          {searchBar}
          {squadFilter}
          {positionFilter}
          {permissions.medical.availability.canView &&
            !availabilityInfoDisabledFlag &&
            availabilityFilter}
          {injuryRosterFilterFlag && issueFilter}
        </div>
        <div
          css={[style.filters, style['filters--mobile']]}
          data-testid="TeamFilters|MobileFilters"
        >
          <TextButton
            text={props.t('Filters')}
            iconAfter="icon-filter"
            type="secondary"
            onClick={() => setShowFilterPanel(true)}
            kitmanDesignSystem
          />

          <SlidingPanelResponsive
            isOpen={showFilterPanel}
            title={props.t('Filters')}
            onClose={() => setShowFilterPanel(false)}
          >
            <div css={style.filtersPanel}>
              {searchBar}
              {squadFilter}
              {positionFilter}
              {permissions.medical.availability.canView &&
                !availabilityInfoDisabledFlag &&
                availabilityFilter}
              {injuryRosterFilterFlag && issueFilter}
            </div>
          </SlidingPanelResponsive>
        </div>
      </header>
      {isInitialDataLoaded && (
        <RosterOverviewGrid
          fetchMoreData={getNextAthletes}
          grid={props.grid}
          isLoading={props.requestStatus === 'PENDING'}
          onOpenAddIssuePanel={onOpenAddIssuePanel}
          onOpenAddDiagnosticSidePanel={(currentAthleteId: number) => {
            setAthleteId(currentAthleteId);
            props.onOpenAddDiagnosticSidePanel();
          }}
          onOpenAddMedicalNotePanel={(currentAthleteId: number) => {
            setAthleteId(currentAthleteId);
            props.onOpenAddMedicalNotePanel();
          }}
          onOpenAddModificationSidePanel={(currentAthleteId: number) => {
            setAthleteId(currentAthleteId);
            props.onOpenAddModificationSidePanel();
          }}
          onOpenAddTreatmentsSidePanel={(currentAthleteId: number) => {
            setAthleteId(currentAthleteId);
            props.onOpenAddTreatmentsSidePanel();
          }}
          onOpenAddAllergySidePanel={(currentAthleteId: number) => {
            setAthleteId(currentAthleteId);
            props.onOpenAddAllergySidePanel();
          }}
          onOpenAddMedicalAlertSidePanel={(currentAthleteId: number) => {
            setAthleteId(currentAthleteId);
            props.onOpenAddMedicalAlertSidePanel();
          }}
          onOpenAddProcedureSidePanel={(currentAthleteId: number) => {
            setAthleteId(currentAthleteId);
            props.onOpenAddProcedureSidePanel();
          }}
          onOpenAddVaccinationSidePanel={(currentAthleteId: number) => {
            setAthleteId(currentAthleteId);
            props.onOpenAddVaccinationPanel();
          }}
          onOpenAddConcussionTestResultSidePanel={(
            currentAthleteId: number,
            concussionProtocol: ConcussionTestProtocol
          ) => {
            setAthleteId(currentAthleteId);
            props.onOpenAddConcussionTestResultSidePanel(concussionProtocol);
          }}
          onOpenAddTUESidePanel={(currentAthleteId: number) => {
            setAthleteId(currentAthleteId);
            props.onOpenAddTUESidePanel();
          }}
        />
      )}
      <AddDiagnosticSidePanel athleteId={athleteId} />
      <AddMedicalNoteSidePanel athleteId={athleteId} onSaveNote={resetGrid} />
      <AddModificationSidePanel athleteId={athleteId} />
      <AddTreatmentsSidePanel athleteId={athleteId} />
      <AddAllergySidePanel athleteId={athleteId} onSaveAllergy={resetGrid} />
      <AddMedicalAlertSidePanel
        athleteId={athleteId}
        onSaveMedicalAlert={resetGrid}
      />
      <AddProcedureSidePanel
        athleteId={athleteId}
        onSaveProcedure={resetGrid}
      />
      <AddVaccinationSidePanel athleteId={athleteId} />
      {(permissions.concussion.canManageConcussionAssessments ||
        permissions.concussion.canManageKingDevickAssessments ||
        permissions.concussion.canManageNpcAssessments) && (
        <AddConcussionTestResultSidePanel athleteId={athleteId} />
      )}
      {window.getFlag('pm-show-tue') && (
        <AddTUESidePanel athleteId={athleteId} onSaveTUE={resetGrid} />
      )}
      {permissions.medical.documents.canCreate && (
        <AddMedicalDocumentSidePanel
          isPanelOpen={isMedicalDocumentPanelOpen}
          setIsPanelOpen={setIsMedicalDocumentPanelOpen}
          disablePlayerSelection={false}
          athleteId={null}
          issueId={null}
        />
      )}
      {permissions.medical.documents.canCreate && (
        <AddMedicalFileSidePanel
          isPanelOpen={isMedicalFilePanelOpen}
          setIsPanelOpen={setIsMedicalFilePanelOpen}
          disablePlayerSelection={false}
          athleteId={null}
          issueId={null}
          toastAction={toastDispatch}
          toasts={toasts}
        />
      )}
    </div>
  );
};

export const RosterOverviewTabTranslated = withNamespaces()(RosterOverviewTab);
export default RosterOverviewTab;
