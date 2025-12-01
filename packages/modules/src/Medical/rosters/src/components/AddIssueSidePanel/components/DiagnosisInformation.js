// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import type {
  Coding,
  SecondaryPathology,
} from '@kitman/common/src/types/Coding';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { InjuryStatuses } from '@kitman/services/src/services/getInjuryStatuses';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { DatePicker, IconButton, Select, TextButton } from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';

import type { Grade } from '@kitman/services/src/services/medical/getGrades';
import type { Side } from '@kitman/services/src/services/medical/getSides';
import type { ConcussionPermissions } from '@kitman/common/src/contexts/PermissionsContext/concussion/types';
import type { MedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical/types';
import type { MultiCodingV2Pathology } from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ChronicIssueQuestionsTranslated as ChronicIssueQuestions } from './ChronicIssueQuestions';
import style from '../AddIssueSidePanelStyle';
import {
  getStatusOptions,
  getCodingSystemFromCoding,
  isV2MultiCodingSystem,
} from '../../../../../shared/utils';
import { ConcussionAssessmentSectionTranslated as ConcussionAssessmentSection } from '../ConcussionAssessmentSection';

import {
  ClinicalImpressions,
  Datalys,
  ICD,
  OSICS10,
  OSIICS15,
} from './codingSystems';

type Props = {
  athleteData: AthleteData,
  // useIssueFieldsHook
  isFieldVisible: Function,
  getFieldLabel: Function,
  invalidFields: Array<string>,

  // Other fields missing
  selectedDiagnosisDate: string,
  maxPermittedExaminationDate: string,
  isPastAthlete: boolean,
  selectedAthlete: number,
  selectedIssueType: string,
  issueIsARecurrence: boolean,
  issueIsAnIllness: boolean,
  issueIsAnInjury: boolean,
  issueIsAContinuation: boolean,
  isPathologyFieldDisabled: boolean,
  selectedCodingSystemPathology: ?MultiCodingV2Pathology,
  onSelectCodingSystemPathology: (pathology: ?MultiCodingV2Pathology) => void,

  // Coding
  selectedCoding: Coding,
  onSelectCoding: Function,
  selectedSupplementalCoding: Coding,
  onSelectSupplementalCoding: Function,
  onSelectPathology: Function,

  // Onset
  selectedOnset: string,
  onSelectOnset: Function,
  onsetFreeText: string,
  onUpdateOnsetFreeText: (string) => void,

  // Onset description
  selectedOnsetDescription: string,
  onSelectOnsetDescription: Function,

  // Sides
  sides: Array<Side>,
  onSelectSide: Function,
  selectedSide: string,
  selectedCodingSystemSide: number,

  // status
  statuses: Array<{ status: string, date: string }>,
  injuryStatuses: InjuryStatuses,
  onUpdateStatusType: Function,
  onUpdateStatusDate: Function,
  onAddStatus: Function,
  onRemoveStatus: Function,

  // Chronic condition
  isChronicCondition: boolean,

  // Chronic issues
  relatedChronicIssues: Array<string>,
  onSelectRelatedChronicIssues: Function,

  // Permissions
  permissions: {
    medical: MedicalPermissions,
    concussion: ConcussionPermissions,
  },

  // supplemental pathology
  enteredSupplementalPathology: string,
  onEnterSupplementalPathology: Function,
  onRemoveSupplementalPathology: Function,

  // classifications
  onSelectClassification: Function,

  // bodyArea
  onSelectBodyArea: Function,

  // Grades
  isBamic: boolean,
  selectedBamicGrade: number,
  grades: Array<Grade>,
  onSelectBamicGrade: Function,
  selectedBamicSite: number,
  onSelectBamicSite: Function,

  // examination date
  selectedExaminationDate: string,
  onSelectExaminationDate: Function,

  // concussion
  attachedConcussionAssessments: Array<number>,
  onUpdateAttachedConcussionAssessments: Function,

  // secondary pathologies / records
  secondaryPathologies: Array<SecondaryPathology>,
  onAddSecondaryPathology: Function,
  onRemoveSecondaryPathology: Function,
  onEditSecondaryPathology: Function,

  currentPage: number,

  selectedCodingSystemPathology: ?MultiCodingV2Pathology,
  onSelectCodingSystemPathology: (?MultiCodingV2Pathology) => void,
};

function DiagnosisInformation(props: I18nProps<Props>) {
  const { organisation } = useOrganisation();
  const [showAssessmentReportSelector, setShowAssessmentReportSelector] =
    useState(false);

  const bamicSiteOptions = props.selectedBamicGrade
    ? props.grades
        .find((grade) => grade.id === props.selectedBamicGrade)
        ?.sites.map((site) => ({
          value: site.id,
          label: site.name,
        }))
    : [];

  // TODO these should probably be referenced in the useIssueFields hook
  // But at the time of writing useIssueFields hook does not cache its endpoint
  // fetch so I don't want to be calling it often
  const { isFieldVisible, getFieldLabel } = props;
  const showPlayerMovementDatePicker = () => {
    return window.featureFlags['player-movement-aware-datepicker'];
  };

  const isBAMIC = !!(
    window.featureFlags['include-bamic-on-injury'] &&
    ((props.isBamic && props.selectedIssueType === 'INJURY') ||
      props.selectedBamicGrade)
  );

  const isChronic = !!(
    window.featureFlags['chronic-injury-illness'] &&
    (props.selectedIssueType === 'CHRONIC_INJURY' ||
      props.selectedIssueType === 'CHRONIC_ILLNESS')
  );

  const renderAvailabilityStatus = () => {
    const maxPermittedStatusDate = props.isPastAthlete
      ? props.maxPermittedExaminationDate
      : null;

    const ensureMoment = (date) => {
      return date && !moment.isMoment(date) ? moment(date) : date;
    };

    return (
      <div css={style.section}>
        <div css={[style.row, style.borderTop, style.borderBottom]}>
          <div style={style.flexCell}>
            {props.statuses.map(({ status, date }, index) => {
              const minimumDate =
                index > 0 ? props.statuses[index - 1].date : null;
              const previousStatus = props.statuses[index - 1];

              return (
                // temporarily using index as key here - just to get rid of console error
                // TODO: use status id once we know what it is
                <div
                  className="addIssueSidePanel__status"
                  css={style.status}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                >
                  <div css={[style.statusRow]}>
                    <span
                      className="addIssueSidePanel__statusNumber"
                      css={style.statusNumber}
                    >
                      {index + 1}
                    </span>
                    <div css={[style.flexCell, style.marginLeftAndRight]}>
                      <Select
                        appendToBody
                        value={status}
                        invalid={props.invalidFields.includes(
                          `events_${index}`
                        )}
                        label={getFieldLabel('events')}
                        options={getStatusOptions({
                          currentIndex: index,
                          statuses: props.injuryStatuses,
                          previousId: previousStatus?.status,
                          excludeResolvers:
                            window.featureFlags['preliminary-injury-illness'] ||
                            !previousStatus,
                        })}
                        onChange={(value) =>
                          props.onUpdateStatusType(index, value)
                        }
                        placeholder={props.t('Select status')}
                      />
                    </div>

                    {showPlayerMovementDatePicker() ? (
                      <div css={[style.flexCell]}>
                        <MovementAwareDatePicker
                          athleteId={props.selectedAthlete}
                          value={ensureMoment(
                            index === 0 ? props.selectedDiagnosisDate : date
                          )}
                          onChange={(statusDate) => {
                            props.onUpdateStatusDate(
                              index,
                              moment(statusDate).format('YYYY-MM-DD')
                            );
                          }}
                          name="statusDate"
                          inputLabel={props.t('Date')}
                          disabled={index === 0}
                          minDate={minimumDate && moment(minimumDate)}
                          disableFuture
                          kitmanDesignSystem
                        />
                      </div>
                    ) : (
                      <DatePicker
                        label={props.t('Date')}
                        minDate={minimumDate}
                        maxDate={maxPermittedStatusDate}
                        name="statusDate"
                        onDateChange={(statusDate) => {
                          props.onUpdateStatusDate(
                            index,
                            moment(statusDate).format('YYYY-MM-DD')
                          );
                        }}
                        value={index === 0 ? props.selectedDiagnosisDate : date}
                        disableFutureDates
                        kitmanDesignSystem
                        disabled={index === 0}
                      />
                    )}

                    {index !== 0 && (
                      <IconButton
                        icon="icon-bin"
                        isTransparent
                        onClick={() => {
                          props.onRemoveStatus(index);
                        }}
                      />
                    )}
                  </div>
                  {index > 0 &&
                    props.invalidFields.includes(`events_${index}`) &&
                    status === props.statuses[index - 1].status && (
                      <span css={style.statusError}>
                        {props.t(
                          'This status is identical to the previous status'
                        )}
                      </span>
                    )}
                </div>
              );
            })}
            <TextButton
              onClick={() => props.onAddStatus()}
              text={props.t('Add status')}
              kitmanDesignSystem
            />
          </div>
        </div>
      </div>
    );
  };

  const renderChronicIssueQuestions = () => {
    return (
      <ChronicIssueQuestions
        selectedIssueType={props.selectedIssueType}
        selectedAthlete={props.selectedAthlete}
        relatedChronicIssues={props.relatedChronicIssues}
        onSelectRelatedChronicIssues={props.onSelectRelatedChronicIssues}
      />
    );
  };

  const renderConcussionMedicalArea = () => {
    return (
      <ConcussionAssessmentSection
        athleteId={props.selectedAthlete}
        showAssessmentReportSelector={showAssessmentReportSelector}
        setShowAssessmentReportSelector={setShowAssessmentReportSelector}
        invalidFields={props.invalidFields}
        onUpdateAttachedConcussionAssessments={
          props.onUpdateAttachedConcussionAssessments
        }
        attachedConcussionAssessments={props.attachedConcussionAssessments}
      />
    );
  };

  const commonProps = {
    athleteId: props.selectedAthlete,
    athleteData: props.athleteData,
    issueIsAnInjury: props.issueIsAnInjury,
    issueIsAnIllness: props.issueIsAnIllness,
    selectedIssueType: props.selectedIssueType,
    invalidFields: props.invalidFields,
    issueType: props.issueIsAnInjury ? 'injury' : 'illness',
    issueIsARecurrence: props.issueIsARecurrence,
    issueIsAContinuation: props.issueIsAContinuation,
    isChronicIssue: isChronic,
    isBamic: isBAMIC,

    // examination date
    selectedExaminationDate: props.selectedExaminationDate,
    selectedDiagnosisDate: props.selectedDiagnosisDate,
    onSelectExaminationDate: props.onSelectExaminationDate,
    maxPermittedExaminationDate: props.maxPermittedExaminationDate,

    // supplemental pathology
    enteredSupplementalPathology: props.enteredSupplementalPathology,
    onEnterSupplementalPathology: props.onEnterSupplementalPathology,
    onRemoveSupplementalPathology: props.onRemoveSupplementalPathology,

    // coding system
    selectedCoding: props.selectedCoding,
    onSelectCoding: props.onSelectCoding,
    onSelectPathology: props.onSelectPathology,
    onSelectClassification: props.onSelectClassification,
    onSelectBodyArea: props.onSelectBodyArea,
    selectedSupplementalCoding: props.selectedSupplementalCoding,
    onSelectSupplementalCoding: props.onSelectSupplementalCoding,
    isPathologyFieldDisabled: props.isPathologyFieldDisabled,
    selectedCodingSystemPathology: props.selectedCodingSystemPathology,
    selectedCodingSystemSide: props.selectedCodingSystemSide,
    onSelectCodingSystemPathology: props.onSelectCodingSystemPathology,

    // onset
    selectedOnset: props.selectedOnset,
    onSelectOnset: props.onSelectOnset,
    onsetFreeText: props.onsetFreeText,
    selectedOnsetDescription: props.selectedOnsetDescription,
    onSelectOnsetDescription: props.onSelectOnsetDescription,
    onUpdateOnsetFreeText: props.onUpdateOnsetFreeText,

    // side
    sides: props.sides,
    onSelectSide: props.onSelectSide,
    selectedSide: props.selectedSide,

    // secondary pathologies
    secondaryPathologies: props.secondaryPathologies,
    onAddSecondaryPathology: props.onAddSecondaryPathology,
    onRemoveSecondaryPathology: props.onRemoveSecondaryPathology,
    onEditSecondaryPathology: props.onEditSecondaryPathology,

    // bamic
    selectedBamicGrade: props.selectedBamicGrade,
    grades: props.grades,
    selectedBamicSite: props.selectedBamicSite,
    onSelectBamicGrade: props.onSelectBamicGrade,
    onSelectBamicSite: props.onSelectBamicSite,
    bamicSiteOptions,
  };

  const renderClinicalImpressions = () => {
    return (
      <ClinicalImpressions
        athleteId={props.selectedAthlete}
        examinationDateProps={{
          selectedExaminationDate: commonProps.selectedExaminationDate,
          selectedDiagnosisDate: commonProps.selectedDiagnosisDate,
          onSelectExaminationDate: commonProps.onSelectExaminationDate,
          maxPermittedExaminationDate: commonProps.maxPermittedExaminationDate,
        }}
        ciCodeProps={{
          selectedCoding: commonProps.selectedCoding,
          onSelectCoding: commonProps.onSelectCoding,
          selectedSupplementalCoding: commonProps.selectedSupplementalCoding,
          onSelectSupplementalCoding: commonProps.onSelectSupplementalCoding,
          isPathologyFieldDisabled: commonProps.isPathologyFieldDisabled,
        }}
        supplementalPathologyProps={{
          enteredSupplementalPathology:
            commonProps.enteredSupplementalPathology,
          onEnterSupplementalPathology:
            commonProps.onEnterSupplementalPathology,
          onRemoveSupplementalPathology:
            commonProps.onRemoveSupplementalPathology,
        }}
        codingSystemProps={{
          selectedCoding: commonProps.selectedCoding,
          onSelectCoding: commonProps.onSelectCoding,
          onSelectPathology: commonProps.onSelectPathology,
          onSelectClassification: commonProps.onSelectClassification,
          onSelectBodyArea: commonProps.onSelectBodyArea,
        }}
        onsetProps={{
          selectedOnset: commonProps.selectedOnset,
          onSelectOnset: commonProps.onSelectOnset,
          onsetFreeText: commonProps.onsetFreeText,
          onUpdateOnsetFreeText: commonProps.onUpdateOnsetFreeText,
        }}
        onsetDescriptionProps={{
          selectedOnsetDescription: commonProps.selectedOnsetDescription,
          onSelectOnsetDescription: commonProps.onSelectOnsetDescription,
        }}
        sideProps={{
          sides: commonProps.sides,
          onSelectSide: commonProps.onSelectSide,
          selectedSide: commonProps.selectedSide,
        }}
        secondaryPathologyProps={{
          secondaryPathologies: commonProps.secondaryPathologies,
          onAddSecondaryPathology: commonProps.onAddSecondaryPathology,
          onRemoveSecondaryPathology: commonProps.onRemoveSecondaryPathology,
          onEditSecondaryPathology: commonProps.onEditSecondaryPathology,
        }}
        issueType={commonProps.issueType}
        invalidFields={commonProps.invalidFields}
        issueIsARecurrence={commonProps.issueIsARecurrence}
        issueIsAContinuation={commonProps.issueIsAContinuation}
        isChronicIssue={commonProps.isChronicIssue}
      />
    );
  };

  const renderDatalys = () => {
    return (
      <Datalys
        athleteId={props.selectedAthlete}
        examinationDateProps={{
          selectedExaminationDate: commonProps.selectedExaminationDate,
          selectedDiagnosisDate: commonProps.selectedDiagnosisDate,
          onSelectExaminationDate: commonProps.onSelectExaminationDate,
          maxPermittedExaminationDate: commonProps.maxPermittedExaminationDate,
        }}
        datalysCodeProps={{
          selectedCoding: commonProps.selectedCoding,
          onSelectCoding: commonProps.onSelectCoding,
          isPathologyFieldDisabled: commonProps.isPathologyFieldDisabled,
        }}
        supplementalPathologyProps={{
          enteredSupplementalPathology:
            commonProps.enteredSupplementalPathology,
          onEnterSupplementalPathology:
            commonProps.onEnterSupplementalPathology,
          onRemoveSupplementalPathology:
            commonProps.onRemoveSupplementalPathology,
        }}
        codingSystemProps={{
          selectedCoding: commonProps.selectedCoding,
          onSelectCoding: commonProps.onSelectCoding,
          onSelectPathology: commonProps.onSelectPathology,
          onSelectClassification: commonProps.onSelectClassification,
          onSelectBodyArea: commonProps.onSelectBodyArea,
        }}
        onsetProps={{
          selectedOnset: commonProps.selectedOnset,
          onSelectOnset: commonProps.onSelectOnset,
          onsetFreeText: commonProps.onsetFreeText,
          onUpdateOnsetFreeText: commonProps.onUpdateOnsetFreeText,
        }}
        sideProps={{
          sides: commonProps.sides,
          onSelectSide: commonProps.onSelectSide,
          selectedSide: commonProps.selectedSide,
        }}
        bamicProps={{
          selectedBamicGrade: commonProps.selectedBamicGrade,
          grades: commonProps.grades,
          selectedBamicSite: commonProps.selectedBamicSite,
          bamicSiteOptions: commonProps.bamicSiteOptions,
          onSelectBamicGrade: commonProps.onSelectBamicGrade,
          onSelectBamicSite: commonProps.onSelectBamicSite,
        }}
        issueType={commonProps.issueType}
        invalidFields={commonProps.invalidFields}
        issueIsARecurrence={commonProps.issueIsARecurrence}
        isBamic={commonProps.isBamic}
      />
    );
  };

  const renderICD = () => {
    return (
      <ICD
        athleteId={commonProps.athleteId}
        examinationDateProps={{
          selectedExaminationDate: commonProps.selectedExaminationDate,
          selectedDiagnosisDate: commonProps.selectedDiagnosisDate,
          onSelectExaminationDate: commonProps.onSelectExaminationDate,
          maxPermittedExaminationDate: commonProps.maxPermittedExaminationDate,
        }}
        icdCodeProps={{
          selectedCoding: commonProps.selectedCoding,
          onSelectCoding: commonProps.onSelectCoding,
          isPathologyFieldDisabled: commonProps.isPathologyFieldDisabled,
        }}
        supplementalPathologyProps={{
          enteredSupplementalPathology:
            commonProps.enteredSupplementalPathology,
          onEnterSupplementalPathology:
            commonProps.onEnterSupplementalPathology,
          onRemoveSupplementalPathology:
            commonProps.onRemoveSupplementalPathology,
        }}
        onsetProps={{
          selectedOnset: commonProps.selectedOnset,
          onSelectOnset: commonProps.onSelectOnset,
          onsetFreeText: commonProps.onsetFreeText,
          onUpdateOnsetFreeText: commonProps.onUpdateOnsetFreeText,
        }}
        bamicProps={{
          selectedBamicGrade: commonProps.selectedBamicGrade,
          grades: commonProps.grades,
          selectedBamicSite: commonProps.selectedBamicSite,
          bamicSiteOptions: commonProps.bamicSiteOptions,
          onSelectBamicGrade: commonProps.onSelectBamicGrade,
          onSelectBamicSite: commonProps.onSelectBamicSite,
        }}
        issueType={commonProps.issueType}
        invalidFields={commonProps.invalidFields}
        issueIsARecurrence={commonProps.issueIsARecurrence}
        isBamic={commonProps.isBamic}
      />
    );
  };

  const renderOSICS10 = () => {
    return (
      <OSICS10
        athleteId={commonProps.athleteId}
        examinationDateProps={{
          selectedExaminationDate: commonProps.selectedExaminationDate,
          selectedDiagnosisDate: commonProps.selectedDiagnosisDate,
          onSelectExaminationDate: commonProps.onSelectExaminationDate,
          maxPermittedExaminationDate: commonProps.maxPermittedExaminationDate,
        }}
        osics10CodeProps={{
          selectedCoding: commonProps.selectedCoding,
          onSelectCoding: commonProps.onSelectCoding,
          isPathologyFieldDisabled: commonProps.isPathologyFieldDisabled,
        }}
        supplementalPathologyProps={{
          enteredSupplementalPathology:
            commonProps.enteredSupplementalPathology,
          onEnterSupplementalPathology:
            commonProps.onEnterSupplementalPathology,
          onRemoveSupplementalPathology:
            commonProps.onRemoveSupplementalPathology,
        }}
        codingSystemProps={{
          selectedCoding: commonProps.selectedCoding,
          onSelectCoding: commonProps.onSelectCoding,
          onSelectPathology: commonProps.onSelectPathology,
          onSelectClassification: commonProps.onSelectClassification,
          onSelectBodyArea: commonProps.onSelectBodyArea,
        }}
        onsetProps={{
          selectedOnset: commonProps.selectedOnset,
          onSelectOnset: commonProps.onSelectOnset,
          onsetFreeText: commonProps.onsetFreeText,
          onUpdateOnsetFreeText: commonProps.onUpdateOnsetFreeText,
        }}
        sideProps={{
          sides: commonProps.sides,
          onSelectSide: commonProps.onSelectSide,
          selectedSide: commonProps.selectedSide,
        }}
        bamicProps={{
          selectedBamicGrade: commonProps.selectedBamicGrade,
          grades: commonProps.grades,
          selectedBamicSite: commonProps.selectedBamicSite,
          bamicSiteOptions: commonProps.bamicSiteOptions,
          onSelectBamicGrade: commonProps.onSelectBamicGrade,
          onSelectBamicSite: commonProps.onSelectBamicSite,
        }}
        issueType={commonProps.issueType}
        invalidFields={commonProps.invalidFields}
        issueIsAnInjury={commonProps.issueIsAnInjury}
        issueIsAnIllness={commonProps.issueIsAnIllness}
        selectedIssueType={commonProps.selectedIssueType}
        selectedAthlete={commonProps.athleteId}
        issueIsARecurrence={commonProps.issueIsARecurrence}
        isBamic={commonProps.isBamic}
      />
    );
  };

  const renderOSIICS15 = () => {
    return (
      <OSIICS15
        onSelectDetail={() => {}}
        // $FlowIgnore - I need to find out if this new issueExaminationDatePicker is needed in the sidebar too
        details={{}}
        athleteId={commonProps.athleteId}
        athleteData={commonProps.athleteData}
        codingSystemProps={{
          onSelectCodingSystemPathology:
            commonProps.onSelectCodingSystemPathology,
          selectedCodingSystemPathology:
            commonProps.selectedCodingSystemPathology,
          isPathologyFieldDisabled: commonProps.isPathologyFieldDisabled,
        }}
        isEditMode={false}
        issueType={commonProps.issueType}
        invalidFields={commonProps.invalidFields}
        issueIsAnInjury={commonProps.issueIsAnInjury}
        issueIsAnIllness={commonProps.issueIsAnIllness}
        selectedIssueType={commonProps.selectedIssueType}
        isChronicCondition={commonProps.isChronicIssue}
        sideProps={{
          onSelectSide: (sideId) => {
            commonProps.onSelectSide(organisation.coding_system_key, sideId);
          },
          selectedSide: commonProps.selectedCodingSystemSide,
        }}
        examinationDateProps={{
          selectedExaminationDate: commonProps.selectedExaminationDate,
          selectedDiagnosisDate: commonProps.selectedDiagnosisDate,
          onSelectExaminationDate: commonProps.onSelectExaminationDate,
          maxPermittedExaminationDate: commonProps.maxPermittedExaminationDate,
        }}
        onsetProps={{
          selectedOnset: commonProps.selectedOnset,
          onSelectOnset: commonProps.onSelectOnset,
          onsetFreeText: commonProps.onsetFreeText,
          onUpdateOnsetFreeText: commonProps.onUpdateOnsetFreeText,
        }}
      />
    );
  };

  const renderCodingSystemContent = () => {
    if (
      organisation.coding_system_key === codingSystemKeys.CLINICAL_IMPRESSIONS
    ) {
      return renderClinicalImpressions();
    }
    if (organisation.coding_system_key === codingSystemKeys.DATALYS) {
      return renderDatalys();
    }
    if (organisation.coding_system_key === codingSystemKeys.ICD) {
      return renderICD();
    }
    if (isV2MultiCodingSystem(organisation.coding_system_key)) {
      return renderOSIICS15();
    }
    return renderOSICS10();
  };

  return (
    <div>
      <div css={style.section}>
        {props.currentPage === 2 && renderCodingSystemContent()}
      </div>

      {!isChronic && renderAvailabilityStatus()}
      {isChronic && renderChronicIssueQuestions()}

      {window.featureFlags['concussion-medical-area'] &&
        getCodingSystemFromCoding(props.selectedCoding)?.groups?.includes(
          'concussion'
        ) &&
        (props.permissions.concussion.canManageConcussionAssessments ||
          props.permissions.concussion.canAttachConcussionAssessments) &&
        isFieldVisible('concussion_assessments') &&
        renderConcussionMedicalArea()}
    </div>
  );
}

export const DiagnosisInformationTranslated: ComponentType<Props> =
  withNamespaces()(DiagnosisInformation);
export default DiagnosisInformation;
