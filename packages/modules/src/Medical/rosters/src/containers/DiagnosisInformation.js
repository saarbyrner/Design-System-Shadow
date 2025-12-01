// @flow
import { useMemo } from 'react';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { useSelector, useDispatch } from 'react-redux';
import type { Side } from '@kitman/services/src/services/medical/getSides';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { InjuryStatuses } from '@kitman/services/src/services/getInjuryStatuses';
import type { Grade } from '@kitman/services/src/services/medical/getGrades';
import type { ConcussionPermissions } from '@kitman/common/src/contexts/PermissionsContext/concussion/types';
import type { MedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical/types';
import { DiagnosisInformationTranslated as DiagnosisInformation } from '../components/AddIssueSidePanel/components/DiagnosisInformation';
import {
  addStatus,
  enterSupplementalPathology,
  fetchGroupAndSelectCoding,
  fetchIssueDetails,
  removeStatus,
  removeSupplementalPathology,
  selectBodyArea,
  selectClassification,
  selectExaminationDate,
  selectCoding,
  selectBamicGrade,
  selectBamicSite,
  selectOnset,
  selectOnsetDescription,
  setOnsetFreeText,
  selectPathology,
  selectCodingSystemPathology,
  selectRelatedChronicIssues,
  selectSide,
  updateStatusType,
  updateStatusDate,
  updateAttachedConcussionAssessments,
  addSecondaryPathology,
  removeSecondaryPathology,
  editSecondaryPathology,
  selectSupplementalCoding,
} from '../redux/actions';
import {
  getAttachedConcussionAssessments,
  getEnteredSupplementalPathology,
  getIsBamic,
  getRelatedChronicIssues,
  getSelectedAthlete,
  getSelectedBamicGrade,
  getSelectedBamicSite,
  getSelectedCoding,
  getSelectedDiagnosisDate,
  getSelectedExaminationDate,
  getSelectedIssueType,
  getSelectedOnset,
  getSelectedOnsetDescription,
  getSelectedSide,
  getSelectedCodingSystemSide,
  getSelectedCodingSystemPathology,
  getIsExternalRecurrance,
  getSecondaryPathologies,
  getOnsetFreeText,
  getSelectedSupplementalCoding,
} from '../redux/selectors/addIssueSidePanel';

type Props = {|
  athleteData: AthleteData,
  // Data loaded in parent by rtk
  sides: Array<Side>,
  grades: Array<Grade>,
  injuryStatuses: InjuryStatuses,
  statuses: Array<{ status: string, date: string }>,

  // Permissions
  permissions: {
    medical: MedicalPermissions,
    concussion: ConcussionPermissions,
  },

  // useIssueFieldsHook
  isFieldVisible: Function,
  getFieldLabel: Function,
  invalidFields: Array<string>,
  isFieldVisibleByType: Function,
  getFieldLabelByType: Function,

  // General
  issueIsARecurrence: boolean,
  issueIsAnInjury: boolean,
  issueIsAnIllness: boolean,
  maxPermittedExaminationDate: string,
  isPastAthlete: boolean,
  issueIsAContinuation: boolean,
  isChronicCondition: boolean,
  currentPage: number,
|};

export default (props: Props) => {
  const { organisation } = useOrganisation();
  const dispatch = useDispatch();
  const enteredSupplementalPathology = useSelector(
    getEnteredSupplementalPathology
  );
  const isBamic = useSelector(getIsBamic);
  const relatedChronicIssues = useSelector(getRelatedChronicIssues);
  const selectedBamicSite = useSelector(getSelectedBamicSite);
  const attachedConcussionAssessments = useSelector(
    getAttachedConcussionAssessments
  );
  const selectedAthlete = useSelector(getSelectedAthlete);
  const selectedBamicGrade = useSelector(getSelectedBamicGrade);
  const selectedCoding = useSelector(getSelectedCoding);
  const selectedSupplementalCoding = useSelector(getSelectedSupplementalCoding);
  const selectedDiagnosisDate = useSelector(getSelectedDiagnosisDate);
  const selectedExaminationDate = useSelector(getSelectedExaminationDate);
  const selectedIssueType = useSelector(getSelectedIssueType);
  const selectedOnset = useSelector(getSelectedOnset);
  const selectedOnsetDescription = useSelector(getSelectedOnsetDescription);
  const onsetFreeText = useSelector(getOnsetFreeText);
  const selectedSide = useSelector(getSelectedSide);
  const selectedCodingSystemSide = useSelector(getSelectedCodingSystemSide);
  const selectedCodingSystemPathology = useSelector(
    getSelectedCodingSystemPathology
  );
  const secondaryPathologies = useSelector(getSecondaryPathologies);
  const isNoPriorInjurySelected = useSelector(getIsExternalRecurrance);

  const isMissingPriorInjuryForContinuationOrRecurrence = useMemo(() => {
    if (props.issueIsAContinuation) {
      return !isNoPriorInjurySelected;
    }

    return props.issueIsARecurrence && !isNoPriorInjurySelected;
  }, [props, isNoPriorInjurySelected]);

  return (
    <DiagnosisInformation
      athleteData={props.athleteData}
      isBamic={isBamic}
      isPathologyFieldDisabled={isMissingPriorInjuryForContinuationOrRecurrence}
      attachedConcussionAssessments={attachedConcussionAssessments}
      selectedBamicSite={selectedBamicSite}
      enteredSupplementalPathology={enteredSupplementalPathology}
      relatedChronicIssues={relatedChronicIssues}
      selectedAthlete={selectedAthlete}
      selectedBamicGrade={selectedBamicGrade}
      selectedCoding={selectedCoding}
      selectedSupplementalCoding={selectedSupplementalCoding}
      selectedDiagnosisDate={selectedDiagnosisDate}
      selectedExaminationDate={selectedExaminationDate}
      selectedIssueType={selectedIssueType}
      selectedOnset={selectedOnset}
      onsetFreeText={onsetFreeText}
      selectedOnsetDescription={selectedOnsetDescription}
      selectedSide={selectedSide}
      selectedCodingSystemSide={selectedCodingSystemSide}
      secondaryPathologies={secondaryPathologies}
      selectedCodingSystemPathology={selectedCodingSystemPathology}
      onAddStatus={() => {
        dispatch(addStatus());
      }}
      onEnterSupplementalPathology={(supplementalPathology) =>
        dispatch(enterSupplementalPathology(supplementalPathology))
      }
      onRemoveStatus={(index) => {
        dispatch(removeStatus(index));
      }}
      onRemoveSupplementalPathology={() =>
        dispatch(removeSupplementalPathology())
      }
      onSelectBodyArea={(codingSystem, bodyAreaId) =>
        dispatch(selectBodyArea(codingSystem, bodyAreaId))
      }
      onSelectClassification={(codingSystem, classificationId) =>
        dispatch(selectClassification(codingSystem, classificationId))
      }
      onSelectSupplementalCoding={(coding) => {
        dispatch(selectSupplementalCoding(coding));
      }}
      onSelectCoding={(coding) => {
        if (window.featureFlags['concussion-web-iteration-2']) {
          dispatch(
            fetchGroupAndSelectCoding(coding, organisation.coding_system)
          );
        } else {
          dispatch(selectCoding(coding));
        }
      }}
      onSelectExaminationDate={(date) => dispatch(selectExaminationDate(date))}
      onUpdateAttachedConcussionAssessments={(assessmentIds) =>
        dispatch(updateAttachedConcussionAssessments(assessmentIds))
      }
      onUpdateStatusType={(index, status) =>
        dispatch(updateStatusType(index, status))
      }
      onSelectBamicGrade={(grade) => dispatch(selectBamicGrade(grade))}
      onSelectBamicSite={(site) => dispatch(selectBamicSite(site))}
      onSelectOnset={(onset) => dispatch(selectOnset(onset))}
      onSelectOnsetDescription={(onsetDescription) =>
        dispatch(selectOnsetDescription(onsetDescription))
      }
      onUpdateOnsetFreeText={(freeText) => dispatch(setOnsetFreeText(freeText))}
      onSelectPathology={(pathologyId) => {
        dispatch(selectPathology(pathologyId));
        dispatch(fetchIssueDetails(pathologyId));
      }}
      onSelectCodingSystemPathology={(pathology) => {
        dispatch(selectCodingSystemPathology(pathology));
      }}
      onSelectRelatedChronicIssues={(issueIds) =>
        dispatch(selectRelatedChronicIssues(issueIds))
      }
      onSelectSide={(codingSystem, side) =>
        dispatch(selectSide(codingSystem, side))
      }
      onUpdateStatusDate={(index, date) =>
        dispatch(updateStatusDate(index, date))
      }
      onAddSecondaryPathology={(record) =>
        dispatch(addSecondaryPathology(record))
      }
      onRemoveSecondaryPathology={(index) =>
        dispatch(removeSecondaryPathology(index))
      }
      onEditSecondaryPathology={(secondaryPathology, index) =>
        dispatch(editSecondaryPathology(secondaryPathology, index))
      }
      {...props}
    />
  );
};
