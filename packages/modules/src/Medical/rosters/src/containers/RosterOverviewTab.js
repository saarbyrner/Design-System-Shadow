// @flow
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getActiveSquad } from '@kitman/services';
import { resetGridPagination } from '@kitman/modules/src/Medical/rosters/src/redux/actions';
import { RosterOverviewTabTranslated as RosterOverviewTab } from '../components/RosterOverviewTab';
import {
  fetchRosterGrid,
  openAddIssuePanel,
  selectIssueType,
  setRequestStatus,
  updateFilters,
} from '../redux/actions';
import {
  openAddDiagnosticSidePanel,
  openAddMedicalNotePanel,
  openAddModificationSidePanel,
  openAddTreatmentsSidePanel,
  openAddAllergySidePanel,
  openAddMedicalAlertSidePanel,
  openAddProcedureSidePanel,
  openAddVaccinationSidePanel,
  openAddConcussionTestResultsSidePanel,
  openAddTUESidePanel,
} from '../../../shared/redux/actions';
import {
  getPersistedMedicalFilters,
  setPersistedMedicalFilters,
} from '../../../shared/utils/filters';

export default () => {
  const [filtersUpdated, setFiltersUpdated] = useState(false);

  const dispatch = useDispatch();
  const grid = useSelector((state) => state.grid);
  const requestStatus = useSelector((state) => state.app.requestStatus);
  const filters = useSelector((state) => state.filters);

  const setFilters = (updatedFilters) => {
    dispatch(resetGridPagination());
    // $FlowIgnore
    dispatch(updateFilters(updatedFilters));
    setFiltersUpdated(true);
    if (Array.isArray(updatedFilters.squads)) {
      setPersistedMedicalFilters(
        ['squads', 'positions', 'availabilities', 'issues'],
        updatedFilters,
        'roster'
      );
    }
  };

  // Default 'Squad' filter to the active squad, or empty if there is an invalid responsive from service. Github issue: #19257
  useEffect(() => {
    const persistedFilters = getPersistedMedicalFilters(
      filters,
      ['squads', 'positions', 'availabilities', 'issues'],
      'roster'
    );

    if (persistedFilters?.squads?.length) {
      setFilters({
        ...persistedFilters,
      });
    } else {
      getActiveSquad()
        .then(({ id }) => {
          setFilters({
            squads: id ? [id] : [],
          });
        })
        .catch(() => {
          setFilters({
            squads: [],
          });
        });
    }
  }, []);

  return (
    <RosterOverviewTab
      fetchGrid={(reset) => dispatch(fetchRosterGrid(reset))}
      grid={grid}
      filters={filters}
      filtersUpdated={filtersUpdated}
      requestStatus={requestStatus}
      onFiltersUpdate={setFilters}
      onOpenAddIssuePanelWithAthleteData={(
        athleteId,
        squadId,
        positionId,
        isChronicCondition
      ) => {
        dispatch(
          openAddIssuePanel({
            athleteId,
            squadId,
            positionId,
          })
        );
        // Note: this is important to open the chronic condition panel
        if (isChronicCondition) {
          dispatch(selectIssueType('CHRONIC_INJURY'));
        }
      }}
      onOpenAddIssuePanel={({ isChronicCondition } = {}) => {
        dispatch(openAddIssuePanel());
        // Note: this is important to open the chronic condition panel
        if (isChronicCondition) {
          dispatch(selectIssueType('CHRONIC_INJURY'));
        }
      }}
      onOpenAddDiagnosticSidePanel={() =>
        dispatch(openAddDiagnosticSidePanel())
      }
      onOpenAddMedicalNotePanel={() => dispatch(openAddMedicalNotePanel())}
      onOpenAddModificationSidePanel={() =>
        dispatch(openAddModificationSidePanel())
      }
      onOpenAddTreatmentsSidePanel={() =>
        dispatch(openAddTreatmentsSidePanel())
      }
      onOpenAddAllergySidePanel={() => dispatch(openAddAllergySidePanel())}
      onOpenAddMedicalAlertSidePanel={() =>
        dispatch(openAddMedicalAlertSidePanel())
      }
      onOpenAddProcedureSidePanel={() => dispatch(openAddProcedureSidePanel())}
      onOpenAddVaccinationPanel={() => dispatch(openAddVaccinationSidePanel())}
      onOpenAddConcussionTestResultSidePanel={(testProtocol) =>
        dispatch(
          openAddConcussionTestResultsSidePanel({
            testProtocol,
            isAthleteSelectable: true,
          })
        )
      }
      onOpenAddTUESidePanel={() => dispatch(openAddTUESidePanel())}
      onSetRequestStatus={(status) => dispatch(setRequestStatus(status))}
    />
  );
};
