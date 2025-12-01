// @flow
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import {
  openAddIssuePanel,
  // selectIssueType,
} from '../../rosters/src/redux/actions';
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
} from '../redux/actions';
import type { PanelType } from '../types';

import { AthleteRosterTabTranslated as AthleteRosterTab } from '../components/AthleteRosterTab';

const AthleteRosterTabContainer = () => {
  const dispatch = useDispatch();

  const [athleteId, setAthleteId] = useState<number | null>(null);

  const handleOnOpenPanel = (
    panel: PanelType,
    selectedAthleteId: number | null
  ) => {
    setAthleteId(selectedAthleteId);

    switch (panel) {
      case 'ALLERGY':
        return dispatch(openAddAllergySidePanel());
      // case 'CHRONIC_CONDITION':
      //   dispatch(selectIssueType('CHRONIC_INJURY'));
      //   return dispatch(openAddIssuePanel({ isChronicCondition: true }));
      case 'DIAGNOSTIC':
        return dispatch(openAddDiagnosticSidePanel());
      case 'ISSUE':
        return dispatch(openAddIssuePanel());
      case 'KING_DEVICK':
        return dispatch(
          openAddConcussionTestResultsSidePanel({
            testProtocol: 'KING-DEVICK',
            isAthleteSelectable: !selectedAthleteId,
          })
        );
      case 'MEDICAL_ALERT':
        return dispatch(openAddMedicalAlertSidePanel());
      case 'MEDICAL_NOTE':
        return dispatch(openAddMedicalNotePanel());
      case 'MODIFICATION':
        return dispatch(openAddModificationSidePanel());
      case 'NPC':
        return dispatch(
          openAddConcussionTestResultsSidePanel({
            testProtocol: 'NPC',
            isAthleteSelectable: !selectedAthleteId,
          })
        );
      case 'PROCEDURE':
        return dispatch(openAddProcedureSidePanel());
      case 'TREATMENT':
        return dispatch(openAddTreatmentsSidePanel());
      case 'TUE':
        return dispatch(openAddTUESidePanel());
      case 'VACCINATION':
        return dispatch(openAddVaccinationSidePanel());
      default:
        return dispatch(openAddIssuePanel());
    }
  };

  return (
    <AthleteRosterTab onOpenPanel={handleOnOpenPanel} athleteId={athleteId} />
  );
};

export default AthleteRosterTabContainer;
