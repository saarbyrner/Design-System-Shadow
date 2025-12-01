// @flow
import { useState, useMemo, useEffect } from 'react';
import uuid from 'uuid';
import moment from 'moment';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import type {
  Coding,
  SecondaryPathology,
} from '@kitman/common/src/types/Coding';
import type {
  Pathologies,
  Classifications,
  BodyAreas,
} from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';
import type { Sides } from '@kitman/services/src/services/medical/getSides';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import {
  getSides,
  getClinicalImpressionsBodyAreas,
  getClinicalImpressionsClassifications,
  getDatalysBodyAreas,
  getDatalysClassifications,
  getIllnessOnset,
  getIllnessOsicsBodyAreas,
  getIllnessOsicsClassifications,
  getIllnessOsicsPathologies,
  getInjuryOnset,
  getInjuryOsicsBodyAreas,
  getInjuryOsicsClassifications,
  getInjuryOsicsPathologies,
  getGrades,
  getOsicsInfo,
  saveIssue,
} from '@kitman/services';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { AppStatus, LineLoader } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Grade } from '@kitman/services/src/services/medical/getGrades';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { IssueType, RequestStatus } from '../../../../shared/types';
import type { ViewType } from '../../types';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import { useIssueTabRequestStatus } from '../../hooks/useIssueTabRequestStatus';
import { HeaderTranslated as Header } from './Header';
import { PresentationViewTranslated as PresentationView } from './PresentationView';
import { EditViewTranslated as EditView } from './EditView';
import {
  filterInactiveSides,
  getFreetextValue,
  isV2MultiCodingSystem,
  updateFreetextComponentResults,
} from '../../../../shared/utils';

export type Details = {
  supplementalPathology: string,
  onset: ?number | string,
  onsetDescription: ?string,
  onsetFreeText?: string,
  examinationDate: ?string,
  occurrenceDate: string,
  concussion_assessments: ?Array<number>,
  bamic_grade_id?: ?number | ?string,
  bamic_site_id?: ?number | ?string,
  coding: Coding,
  supplementaryCoding: string,
  // When emr-multiple-coding-systems is enabled, the side information is in the coding object
  side?: string,
  isBamic: boolean,
  secondaryPathologies: SecondaryPathology[],
  mechanismDescription: string,
  newInjuryToRecurrentInjury?: string,
};

const style = {
  section: css`
    background-color: ${colors.white};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    padding: 24px;
    position: relative;
  `,
  sectionLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
};

const getInitialDetails = (
  issue: IssueOccurrenceRequested,
  issueType: IssueType
): Details => {
  return {
    supplementalPathology: issue.supplementary_pathology,
    // When emr-multiple-coding-systems is enabled, the side information is in the coding object
    ...(window.featureFlags['emr-multiple-coding-systems']
      ? {}
      : { side: issue.side_id }),
    onset:
      issueType === 'Injury'
        ? issue.issue_occurrence_onset_id || issue.onset_type?.id
        : issue.onset_id,
    onsetDescription: issue.onset_description,
    mechanismDescription: issue.mechanism_description,
    onsetFreeText: getFreetextValue(issue, 'issue_occurrence_onsets'),
    examinationDate: issue.examination_date,
    occurrenceDate: issue.occurrence_date,
    concussion_assessments: issue.concussion_assessments,
    bamic_grade_id: issue?.bamic_grade_id,
    bamic_site_id: issue?.bamic_site_id,
    coding: !window.featureFlags['emr-multiple-coding-systems']
      ? { [codingSystemKeys.OSICS_10]: issue.osics }
      : issue.coding,
    isBamic: !!issue.osics?.bamic,
    secondaryPathologies:
      window.featureFlags['multi-part-injury-ci-code'] &&
      issue.coding?.clinical_impressions?.secondary_pathologies
        ? issue.coding?.clinical_impressions?.secondary_pathologies
        : [],
    supplementaryCoding: issue.supplementary_coding,
  };
};

type Props = {
  athleteData: AthleteData,
  editActionDisabled?: boolean,
  onEnterEditMode: (section: ?string) => null,
};

const IssueDetails = (props: I18nProps<Props>) => {
  const { issue, issueType, isChronicIssue, updateIssue } = useIssue();
  const { updateIssueTabRequestStatus } = useIssueTabRequestStatus();
  const { trackEvent } = useEventTracking();
  const { toasts, toastDispatch } = useToasts();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [viewType, setViewType] = useState<ViewType>('PRESENTATION');
  const [isOptionsLoaded, setIsOptionsLoaded] = useState(false);
  const [pathologies, setPathologies] = useState<Pathologies>([]);
  const [bamicGrades, setBamicGrades] = useState<Array<Grade>>([]);
  const [bodyAreas, setBodyAreas] = useState<BodyAreas>([]);
  const [classifications, setClassifications] = useState<Classifications>([]);
  const [onsets, setOnsets] = useState([]);
  const [sides, setSides] = useState<Sides>([]);
  const [details, setDetails] = useState<Details>(
    getInitialDetails(issue, issueType)
  );
  const [showAssessmentReportSelector, setShowAssessmentReportSelector] =
    useState(
      () =>
        Array.isArray(issue.concussion_assessments) &&
        issue.concussion_assessments.length > 0
    );
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] = useState(
    window.featureFlags['incomplete-injury-fields']
  );

  useEffect(() => {
    setDetails(getInitialDetails(issue, issueType));
  }, [viewType]);

  const issueOptionsEndpoints = useMemo(() => {
    const getOnset = issueType === 'Injury' ? getInjuryOnset : getIllnessOnset;

    if (details.coding[codingSystemKeys.OSICS_10]) {
      return issueType === 'Injury'
        ? [
            getInjuryOsicsBodyAreas,
            getInjuryOsicsClassifications,
            getInjuryOsicsPathologies,
            getOnset,
          ]
        : [
            getIllnessOsicsBodyAreas,
            getIllnessOsicsClassifications,
            getIllnessOsicsPathologies,
            getOnset,
          ];
    }

    if (details.coding[codingSystemKeys.DATALYS]) {
      return [
        getDatalysBodyAreas,
        getDatalysClassifications,
        () => new Promise((resolve) => resolve([])),
        getOnset,
      ];
    }

    if (details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]) {
      return [
        getClinicalImpressionsBodyAreas,
        getClinicalImpressionsClassifications,
        () => new Promise((resolve) => resolve([])),
        getOnset,
      ];
    }

    return [
      () => new Promise((resolve) => resolve([])),
      () => new Promise((resolve) => resolve([])),
      () => new Promise((resolve) => resolve([])),
      getOnset,
    ];
  }, [issueType]);

  const fetchIssueOptions = () => {
    setRequestStatus('PENDING');

    const [getBodyAreas, getClassifications, getPathologies, getOnsets] =
      issueOptionsEndpoints;

    Promise.all([
      getSides(),
      getBodyAreas(),
      getClassifications(),
      getPathologies(),
      getGrades(),
      getOnsets(),
    ]).then(
      ([
        fetchedSides,
        fetchedBodyArea,
        fetchedClassification,
        fetchedPathologies,
        fetchedBAMICGrades,
        fetchedOnsets,
      ]) => {
        setSides(fetchedSides);
        setBodyAreas(fetchedBodyArea);
        setClassifications(fetchedClassification);
        setPathologies(fetchedPathologies);
        setBamicGrades(fetchedBAMICGrades);
        setOnsets(fetchedOnsets);
        setIsOptionsLoaded(true);
        setViewType('EDIT');
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  };

  const selectEditView = () => {
    if (isOptionsLoaded) {
      setViewType('EDIT');
      return;
    }

    fetchIssueOptions();
  };

  const selectOsicsPathology = (pathologyId) => {
    setDetails((prevDetails) => ({ ...prevDetails, pathology: pathologyId }));
    setRequestStatus('PENDING');

    getOsicsInfo(issue.athlete_id, pathologyId).then(
      (fetchedOsicsInfo) => {
        setDetails((prevDetails) => ({
          ...prevDetails,
          coding: {
            // $FlowFixMe prevDetails.coding[codingSystemKeys.OSICS_10] uses the correct structure
            [codingSystemKeys.OSICS_10]: {
              ...prevDetails.coding[codingSystemKeys.OSICS_10],
              osics_id: fetchedOsicsInfo.id,
              osics_body_area_id: fetchedOsicsInfo.osics_body_area_id,
              osics_classification_id: fetchedOsicsInfo.osics_classification_id,
              osics_pathology_id: fetchedOsicsInfo.osics_pathology_id,
            },
          },
          isBamic: fetchedOsicsInfo.bamic,
        }));
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  };

  const selectDetail = (
    detailType: string,
    detailValue: string | number | Array<number>
  ) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      [detailType]: detailValue,
    }));
  };

  const discardChanges = () => {
    if (!window.featureFlags['incomplete-injury-fields'])
      setIsValidationCheckAllowed(false);

    setViewType('PRESENTATION');
  };

  const examinationDateIsBeforeOccurrence = moment(
    details.examinationDate
  ).isBefore(moment(details.occurrenceDate));
  const saveEdit = () => {
    // We want to skip the validation check when this feature flag
    // is turned on as validation is not required on all fields
    if (!window.featureFlags['preliminary-injury-illness']) {
      setIsValidationCheckAllowed(true);

      let selectedValues = [
        // if the issue has recurrence, we validate on the enabled onset field
        ...(issue.has_recurrence ? [details.onset] : []),
      ];

      if (window.featureFlags['examination-date']) {
        selectedValues = [...selectedValues, details.examinationDate];
      }

      if (details.coding[codingSystemKeys.OSICS_10]) {
        selectedValues = [
          ...selectedValues,
          details.coding[codingSystemKeys.OSICS_10].osics_pathology_id,
          details.coding[codingSystemKeys.OSICS_10].osics_body_area_id,
          details.coding[codingSystemKeys.OSICS_10].osics_classification_id,
          details.coding[codingSystemKeys.OSICS_10].osics_id,
          ...(window.featureFlags['emr-multiple-coding-systems']
            ? [details.coding[codingSystemKeys.OSICS_10].side_id]
            : [details.side]),
        ];
      }
      if (details.coding[codingSystemKeys.DATALYS]) {
        selectedValues = [
          details.coding[codingSystemKeys.DATALYS].datalys_body_area_id,
          details.coding[codingSystemKeys.DATALYS].datalys_classification_id,
        ];
      }
      if (details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]) {
        selectedValues = [
          details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS].side_id,
          details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
            .clinical_impression_body_area_id,
          details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
            .clinical_impression_classification_id,
        ];
      }
      let allSelectedValuesAreValid = selectedValues.every((item) => item);

      // Validate that at least one concussion_assessments present if showAssessmentReportSelector true
      if (
        showAssessmentReportSelector &&
        (!details.concussion_assessments ||
          details.concussion_assessments.length < 1)
      ) {
        allSelectedValuesAreValid = false;
      }

      // If the validation fails, abort
      if (!allSelectedValuesAreValid) {
        return;
      }
      // If the validation succeed, save the statuses
    }

    if (
      window.featureFlags['multi-part-injury-ci-code'] &&
      details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
    ) {
      // For multi pathologies, we need to map the secondary pathology
      // into the clinical_impressions coding object

      details.coding = {
        ...details.coding,
        [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
          ...details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS],
          secondary_pathologies:
            details?.secondaryPathologies.map(
              // $FlowIgnore using trimmed down values for PUT request
              (secondaryPathology) => ({
                record: secondaryPathology.record || null,
                side: details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
                  ?.side_id
                  ? // $FlowIgnore misleading type on Side
                    {
                      id: details.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]
                        .side_id,
                    }
                  : null,
              })
            ) || [],
        },
      };
    }

    const uptoDateFreeTexts = updateFreetextComponentResults(
      issue.freetext_components,
      'issue_occurrence_onsets',
      details.onsetFreeText
    );

    setRequestStatus('PENDING');
    updateIssueTabRequestStatus('PENDING');

    let codingSystemData = {
      supplementary_pathology: details.supplementalPathology,
      has_supplementary_pathology: !!details.supplementalPathology,
      ...(window.featureFlags['emr-multiple-coding-systems']
        ? {
            coding: details.coding,
          }
        : {
            osics: {
              ...issue.osics,
              osics_pathology_id:
                details.coding[codingSystemKeys.OSICS_10]?.osics_pathology_id,
              osics_classification_id:
                details.coding[codingSystemKeys.OSICS_10]
                  ?.osics_classification_id,
              osics_body_area_id:
                details.coding[codingSystemKeys.OSICS_10]?.osics_body_area_id,
              osics_id: details.coding[codingSystemKeys.OSICS_10]?.osics_id,
              side_id: details.side,
            },
          }),
      side_id: details.side,
      issue_occurrence_onset_id: issueType === 'Injury' && details.onset,
      onset_id: issueType === 'Illness' && details.onset,
      onset_description: details.onsetDescription,
      mechanism_description: details.mechanismDescription,
      freetext_components: Object.values(uptoDateFreeTexts),
      examination_date: details.examinationDate,
      occurrence_date: details.occurrenceDate ?? null,
      concussion_assessments: details.concussion_assessments,
      issue_contact_type_id: issue.issue_contact_type?.id || null,
      injury_mechanism_id: issue.injury_mechanism_id || null,
      presentation_type_id: issue.presentation_type?.id || null,
      supplementary_coding: details.supplementaryCoding || null,
      bamic_grade_id: details.bamic_grade_id || null,
      bamic_site_id: details.bamic_site_id || null,
    };

    if (
      issue.coding &&
      issue.coding.pathologies &&
      issue.coding.pathologies.length > 0 &&
      issue.coding.pathologies[0]?.coding_system?.key &&
      isV2MultiCodingSystem(issue.coding.pathologies[0]?.coding_system?.key)
    ) {
      const pathology = issue.coding.pathologies[0];
      const detailPathology =
        details.coding.pathologies && details.coding.pathologies.length > 0
          ? details.coding.pathologies[0]
          : null;

      codingSystemData = {
        ...codingSystemData,
        coding: {
          pathologies: [
            {
              // Allow the editing of the pathology
              // But Just in case the edited pathology is null maintain existing pathology
              id: detailPathology?.id ?? pathology.id,
              coding_system_side_id:
                detailPathology?.coding_system_side_id ||
                detailPathology?.coding_system_side?.coding_system_side_id,
            },
          ],
        },
        onset_id: details.onset,
        onset_type: onsets.find((onset) => onset.id === details.onset),
      };
    }
    saveIssue(issueType, issue, codingSystemData, isChronicIssue)
      .then((updatedIssue) => {
        setRequestStatus('SUCCESS');
        updateIssue(updatedIssue);
        discardChanges();
        updateIssueTabRequestStatus('DORMANT');
        trackEvent(
          performanceMedicineEventNames.editedInjuryIllnessPrimaryPathology
        );
      })
      .catch(() => {
        setRequestStatus('FAILURE');
        updateIssueTabRequestStatus('FAILURE');
      })
      .finally(() => {
        props.onEnterEditMode();
        setRequestStatus(null);
        updateIssueTabRequestStatus(null);
        // showToast examinationDateIsBeforeOccurrence
        if (examinationDateIsBeforeOccurrence) {
          toastDispatch({
            type: 'CREATE_TOAST',
            toast: {
              id: uuid.v4(), // Alows each toast to have its own Id so calling the close function doesnt close all toast together
              title: props.t('Examination date is before the Injury date'),
              status: 'ERROR',
            },
          });
        }
      });
  };

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <>
      <section css={style.section} data-testid="IssueDetails">
        <Header
          viewType={viewType}
          onSave={() => {
            saveEdit();
          }}
          onEdit={() => {
            selectEditView();
            props.onEnterEditMode();
          }}
          onDiscardChanges={() => {
            discardChanges();
            props.onEnterEditMode();
          }}
          isRequestPending={requestStatus === 'PENDING'}
          editActionDisabled={props.editActionDisabled}
        />
        {viewType === 'PRESENTATION' ? (
          <PresentationView
            highlightEmptyFields={
              window.featureFlags['incomplete-injury-fields']
            }
          />
        ) : (
          <EditView
            athleteId={issue.athlete_id}
            athleteData={props.athleteData}
            bodyAreas={bodyAreas}
            classifications={classifications}
            details={details}
            occurrenceType={issue.occurrence_type}
            pathologies={pathologies}
            onsetOptions={onsets}
            occurrenceDate={issue.occurrence_date}
            onSelectOsicsPathology={selectOsicsPathology}
            onSelectDetail={(detailType, detailValue) => {
              selectDetail(detailType, detailValue);
            }}
            sides={filterInactiveSides(sides)}
            showAssessmentReportSelector={showAssessmentReportSelector}
            onChangeShowAssessmentReportSelector={
              setShowAssessmentReportSelector
            }
            hasRecurrence={
              issue.has_recurrence && !issue.recurrence_outside_system
            }
            isValidationCheckAllowed={isValidationCheckAllowed}
            isRequestPending={requestStatus === 'PENDING'}
            bamicGrades={bamicGrades}
            isContinuationIssue={!!issue.continuation_issue}
            isChronicIssue={isChronicIssue}
            issueType={issueType}
          />
        )}
        {requestStatus === 'PENDING' && (
          <div
            css={style.sectionLoader}
            data-testid="IssueDetailsLoader|lineLoader"
          >
            <LineLoader />
          </div>
        )}
      </section>

      <ToastDialog
        toasts={toasts}
        onCloseToast={(id) => {
          toastDispatch({
            type: 'REMOVE_TOAST_BY_ID',
            id,
          });
        }}
      />
    </>
  );
};

export const IssueDetailsTranslated = withNamespaces()(IssueDetails);
export default IssueDetails;
