/* eslint-disable no-unused-vars */
// @flow
import type { ComponentType } from 'react';
import { useMemo, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import AthleteRosterGrid from './components/AthleteRosterGrid';
import useAthleteRoster from './hooks/useAthleteRoster';
import { ActionsTranslated as Actions } from '../../../rosters/src/components/RosterOverviewTab/components/Actions';

import { cellStyle, gridStyle } from '../CommonGridStyle';

import AddIssueSidePanel from '../../../rosters/src/containers/AddIssueSidePanel';
import AddDiagnosticSidePanel from '../../containers/AddDiagnosticSidePanel';
import AddMedicalNoteSidePanel from '../../containers/AddMedicalNoteSidePanel';
import AddModificationSidePanel from '../../containers/AddModificationSidePanel';
import AddTreatmentsSidePanel from '../../containers/AddTreatmentsSidePanel';
import AddAllergySidePanel from '../../containers/AddAllergySidePanel';
import AddMedicalAlertSidePanel from '../../containers/AddMedicalAlertSidePanel';
import AddMedicalDocumentSidePanel from '../../containers/AddMedicalDocumentSidePanel';
import AddProcedureSidePanel from '../../containers/AddProcedureSidePanel';
import AddVaccinationSidePanel from '../../containers/AddVaccinationSidePanel';
import AddConcussionTestResultSidePanel from '../../containers/AddConcussionTestResultSidePanel';
import AddTUESidePanel from '../../containers/AddTUESidePanel';

import { FiltersTranslated as Filters } from '../../../rosters/src/components/RosterOverviewTab/components/Filters';

type Props = {
  onOpenPanel: Function,
  athleteId: ?number,
};

const AthleteRosterTab = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const [isMedicalDocumentPanelOpen, setIsMedicalDocumentPanelOpen] =
    useState<boolean>(false);
  const {
    requestStatus,
    onFetchAthleteRoster,
    grid,
    nextId,
    filteredSearchParams,
    onUpdateFilter,
    isInitialDataLoaded,
  } = useAthleteRoster();

  const rowActions = useMemo(() => {
    if (!isInitialDataLoaded) return [];
    return [
      {
        id: 'issue',
        text: props.t('Add injury/ illness'),
        onCallAction: (selectedAthleteId) => {
          props.onOpenPanel('ISSUE', selectedAthleteId);
        },
        isPermitted: permissions.medical.issues.canCreate,
      },
      {
        id: 'note',
        text: props.t('Add note'),
        onCallAction: (selectedAthleteId) => {
          props.onOpenPanel('MEDICAL_NOTE', selectedAthleteId);
        },
        isPermitted: permissions.medical.notes.canCreate,
      },
      {
        id: 'modification',
        text: props.t('Add modification'),
        onCallAction: (selectedAthleteId) => {
          props.onOpenPanel('MODIFICATION', selectedAthleteId);
        },
        isPermitted: permissions.medical.modifications.canCreate,
      },
      {
        id: 'treatment',
        text: props.t('Add treatment'),
        onCallAction: (selectedAthleteId) => {
          props.onOpenPanel('TREATMENT', selectedAthleteId);
        },
        isPermitted: permissions.medical.treatments.canCreate,
      },
      {
        id: 'diagnostic',
        text: props.t('Add diagnostic'),
        onCallAction: (selectedAthleteId) => {
          props.onOpenPanel('DIAGNOSTIC', selectedAthleteId);
        },
        isPermitted: permissions.medical.diagnostics.canCreate,
      },
      {
        id: 'vaccination',
        text: props.t('Add vaccination'),
        onCallAction: (selectedAthleteId) => {
          props.onOpenPanel('VACCINATION', selectedAthleteId);
        },
        isPermitted: permissions.medical.vaccinations.canCreate,
      },
      {
        id: 'allergy',
        text: props.t('Add allergy'),
        onCallAction: (selectedAthleteId) => {
          props.onOpenPanel('ALLERGY', selectedAthleteId);
        },
        isPermitted: permissions.medical.allergies.canCreate,
      },
      {
        id: 'chronic-condition',
        text: props.t('Add chronic condition'),
        onCallAction: (selectedAthleteId) => {
          props.onOpenPanel('CHRONIC_CONDITION', selectedAthleteId);
        },
        isPermitted:
          window.featureFlags['chronic-injury-illness'] &&
          permissions.medical.issues.canCreate,
      },
      {
        id: 'medical',
        text: props.t('Add medical alert'),
        onCallAction: (selectedAthleteId) => {
          props.onOpenPanel('MEDICAL_ALERT', selectedAthleteId);
        },
        isPermitted:
          window.featureFlags['medical-alerts-side-panel'] &&
          permissions.medical.alerts.canCreate,
      },
      {
        id: 'procedure',
        text: props.t('Add procedure'),
        onCallAction: (selectedAthleteId) => {
          props.onOpenPanel('PROCEDURE', selectedAthleteId);
        },
        isPermitted:
          window.featureFlags['medical-procedure'] &&
          permissions.medical.procedures.canCreate,
      },
      {
        id: 'tue',
        text: props.t('Add TUE'),
        onCallAction: (selectedAthleteId) => {
          props.onOpenPanel('TUE', selectedAthleteId);
        },
        isPermitted: permissions.medical.tue.canCreate && window.getFlag('pm-show-tue'),
      },
    ].filter((i) => i.isPermitted);
  }, [permissions, props, isInitialDataLoaded]);

  const renderTitle = () => {
    return (
      <div css={cellStyle.titleContainer}>
        <h3 css={cellStyle.title}>{props.t('Team')}</h3>
        <Actions
          isDisabled={
            ['PENDING', 'ERROR'].includes(requestStatus) || !isInitialDataLoaded
          }
          filters={filteredSearchParams}
          onOpenPanel={(panel) => props.onOpenPanel(panel)}
        />
      </div>
    );
  };

  const renderContent = () => {
    switch (requestStatus) {
      case 'PENDING':
        return <DelayedLoadingFeedback />;
      case 'ERROR':
        return <AppStatus status="error" />;
      default:
        return (
          <AthleteRosterGrid
            fetchMoreData={() =>
              onFetchAthleteRoster({ filters: filteredSearchParams })
            }
            grid={{
              columns: grid.columns,
              rows: grid.rows,
              next_id: nextId,
            }}
            gridId={grid.id}
            isFullyLoaded={false}
            emptyTableText={grid.emptyTableText}
            rowActions={rowActions.length > 0 ? rowActions : null}
            isLoading={['UPDATING'].includes(requestStatus)}
          />
        );
    }
  };

  // const renderSidePanels = () => {
  //   return (
  //     <>
  //       <AddIssueSidePanel permissions={permissions} />
  //       <AddDiagnosticSidePanel athleteId={props.athleteId} />
  //       <AddMedicalNoteSidePanel
  //         athleteId={props.athleteId}
  //         onSaveNote={() => onFetchAthleteRoster({ reset: true })}
  //       />
  //       <AddModificationSidePanel athleteId={props.athleteId} />
  //       <AddTreatmentsSidePanel athleteId={props.athleteId} />
  //       <AddAllergySidePanel
  //         athleteId={props.athleteId}
  //         onSaveAllergy={() => onFetchAthleteRoster({ reset: true })}
  //       />
  //       <AddMedicalAlertSidePanel
  //         athleteId={props.athleteId}
  //         onSaveMedicalAlert={() => onFetchAthleteRoster({ reset: true })}
  //       />
  //       <AddProcedureSidePanel
  //         athleteId={props.athleteId}
  //         onSaveProcedure={() => onFetchAthleteRoster({ reset: true })}
  //       />
  //       <AddVaccinationSidePanel athleteId={props.athleteId} />
  //       {(permissions.concussion.canManageKingDevickAssessments ||
  //         permissions.concussion.canManageNpcAssessments) && (
  //         <AddConcussionTestResultSidePanel athleteId={props.athleteId} />
  //       )}
  //       <AddTUESidePanel athleteId={props.athleteId} />
  //       <AddMedicalDocumentSidePanel
  //         isPanelOpen={isMedicalDocumentPanelOpen}
  //         setIsPanelOpen={setIsMedicalDocumentPanelOpen}
  //         disablePlayerSelection={false}
  //         athleteId={props.athleteId}
  //         issueId={null}
  //       />
  //     </>
  //   );
  // };

  return (
    <div css={gridStyle.wrapper}>
      <header css={cellStyle.header}>
        {renderTitle()}
        <Filters
          filters={filteredSearchParams}
          onUpdateFilters={onUpdateFilter}
          isDisabled={!isInitialDataLoaded}
        />
      </header>
      {renderContent()}
      {/* {!!isInitialDataLoaded && renderSidePanels()} */}
    </div>
  );
};

export const AthleteRosterTabTranslated: ComponentType<Props> =
  withNamespaces()(AthleteRosterTab);
export default AthleteRosterTab;
