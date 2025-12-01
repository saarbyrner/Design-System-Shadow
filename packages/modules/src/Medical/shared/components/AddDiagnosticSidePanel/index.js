// @flow
import { useState, useRef } from 'react';
import type { ComponentType } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { withNamespaces } from 'react-i18next';
import { updateDiagnostic as updateDiagnosticService } from '@kitman/services/src/services/medical';
import {
  AppStatus,
  SlidingPanelResponsive,
  TextButton,
  FileUploadArea,
} from '@kitman/components';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import { getValidHref } from '@kitman/common/src/utils';
import type { SelectOption as Option } from '@kitman/components/src/types';
import {
  saveDiagnostic,
  saveAttachmentLegacy as saveAttachment,
} from '@kitman/services';
import type { BodyArea } from '@kitman/services/src/services/medical/clinicalImpressions';
import type { OrderProviderType } from '@kitman/services/src/services/medical/getOrderProviders';
import type { OrganisationStatus } from '@kitman/modules/src/Medical/shared/types/medical/Constraints';
import { checkInvalidFileTitles } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus } from '@kitman/common/src/types';
import RedoxOrgForm from './components/RedoxOrgForm';
import NonRedoxOrgForm from './components/NonRedoxOrgForm';
import { useDiagnostic } from '../../contexts/DiagnosticContext';
import useDiagnosticForm from './hooks/useDiagnosticForm';
import useEnrichedAthletesIssues from '../../hooks/useEnrichedAthletesIssues';
import useCurrentUser from '../../hooks/useGetCurrentUser';
import { getFormattedIssueIds, emptyHTMLeditorAltContent } from '../../utils';
import { useIssue } from '../../contexts/IssueContext';
import style from './styles';
import useAthleteData from '../../hooks/useAthleteData';
import { transformQueuedDiagnostics } from './utils/mappers';
import {
  areRequiredLinkFieldsValid,
  isValidCpt,
  areAllCptsValid,
  hasAssociatedInjuryOrIllness,
  needsAssociatedIssueValidation,
} from './utils/validators';
import useInitSidePanelEffect from './hooks/useInitSidePanelEffect';
import useLoadOrderProvidersEffect from './hooks/useLoadOrderProvidersEffect';
import useDefaultPractitionerEffect from './hooks/useDefaultPractitionerEffect';
import usePreloadIssueAndDatesEffect from './hooks/usePreloadIssueAndDatesEffect';
import useDefaultReasonEffect from './hooks/useDefaultReasonEffect';
import useDiagnosticGroupSetsEffect from './hooks/useDiagnosticGroupSetsEffect';
import useLoadNonRedoxDiagnostic from './hooks/useLoadNonRedoxDiagnostic';

type OptionWithOptional = Option & {
  optional: boolean,
  isInjuryIllness: boolean,
};
type MedicalLocationOption = Option & {
  redoxOrderable: boolean,
};
type Props = {
  athleteConstraints?: { organisationStatus: OrganisationStatus },
  diagnosticToUpdate: Object,
  athleteId?: ?number,
  diagnosticId?: ?number,
  covidResultTypes: Array<Option>,
  covidAntibodyResultTypes: Array<Option>,
  diagnosticTypes: Array<OptionWithOptional>,
  initialDataRequestStatus: RequestStatus,
  isAthleteSelectable: boolean,
  isOpen: boolean,
  onClose: Function,
  onFileUploadStart: Function,
  onFileUploadSuccess: Function,
  onFileUploadFailure: Function,
  onSaveSuccessful: Function,
  squadAthletes: Array<Option>,
  staffUsers: Array<Option>,
  medicalLocations?: Array<MedicalLocationOption>,
  diagnosticReasons?: Array<OptionWithOptional>,
};

const AddDiagnosticSidePanel = (props: I18nProps<Props>) => {
  const isRedoxOrg =
    window.getFlag('redox') && window.getFlag('redox-iteration-1');
  const isMultiFaveSelect = window.getFlag('multi-fave-select');
  const showAnnotationDatePicker = window.getFlag(
    'pm-diagnostic-add-flow-annotation-date'
  );
  const isBillingCpt = window.getFlag(
    'medical-diagnostics-iteration-3-billing-cpt'
  );
  const isMultipleCpt = window.getFlag('diagnostics-multiple-cpt');
  const isCovid19MedicalDiagnostic = window.getFlag(
    'covid-19-medical-diagnostic'
  );
  const athleteId = props.athleteId;
  const { permissions } = usePermissions();
  const { issue, issueType, isChronicIssue } = useIssue();
  const { formState, dispatch } = useDiagnosticForm();
  const { currentUser, fetchCurrentUser } = useCurrentUser();
  const { diagnostic: currDiagnostic, updateDiagnostic } = useDiagnostic();
  const { enrichedAthleteIssues, fetchAthleteIssues } =
    useEnrichedAthletesIssues({
      athleteId: props.isOpen ? athleteId : null,
    });
  const { organisation } = useOrganisation();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [requestIssuesStatus, setRequestIssuesStatus] =
    useState<RequestStatus>(null);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);

  const [isLinkValidationCheckAllowed, setIsLinkValidationCheckAllowed] =
    useState(false);

  const [
    isMultiLinkValidationCheckAllowed,
    setIsMultiLinkValidationCheckAllowed,
  ] = useState<Array<boolean>>([]);
  const [bodyAreas, setBodyAreas] = useState<Array<BodyArea>>([]);
  const [orderProviders, setOrderProviders] = useState<OrderProviderType>({});

  const { fetchAthleteData, athleteData, isPastAthlete } = useAthleteData();

  const editorRefs = useRef([]);
  const isEditing =
    (isRedoxOrg && props.diagnosticToUpdate && props.isOpen) ||
    (!isRedoxOrg && !!props.diagnosticId && props.isOpen);

  useInitSidePanelEffect({
    isOpen: props.isOpen,
    athleteId,
    fetchCurrentUser,
    fetchAthleteData,
    setBodyAreas,
    dispatch,
    editorRefs,
    setIsValidationCheckAllowed,
  });

  useLoadOrderProvidersEffect({
    isEditing,
    diagnosticToUpdate: props.diagnosticToUpdate,
    dispatch,
    setOrderProviders,
    setRequestStatus,
    isOpen: props.isOpen,
  });

  useLoadNonRedoxDiagnostic({
    isRedoxOrg,
    isOpen: props.isOpen,
    athleteId,
    diagnosticId: props.diagnosticId,
    setRequestStatus,
    dispatch,
  });

  useDefaultPractitionerEffect({
    isOpen: props.isOpen,
    currentUser,
    staffUsers: props.staffUsers,
    isRedoxOrg,
    hasUserId: !!formState.userId,
    dispatch,
  });

  /**
   * Preload the Associated injury/ illness drop-down with issue
   * that it has been toggled open from.
   * AddDiagnosticSidePanel uses {issue.issue_id} prop, not {issue.id}
   */

  usePreloadIssueAndDatesEffect({
    isOpen: props.isOpen,
    isEditing,
    organisationStatus: props.athleteConstraints?.organisationStatus,
    issue,
    issueType,
    isChronicIssue,
    dateTransferFormat,
    dispatch,
  });

  const injuryIllnessReasonId = props.diagnosticReasons?.find(
    ({ isInjuryIllness }) => isInjuryIllness
  )?.value;

  useDefaultReasonEffect({
    isEditing,
    athleteId,
    enrichedAthleteIssues,
    issueId: issue.id,
    injuryIllnessReasonId,
    dispatch,
  });

  const [diagnosticGroupSets, setDiagnosticGroupSets] = useState([]);

  useDiagnosticGroupSetsEffect({
    locationId: formState.locationId,
    setDiagnosticGroupSets,
    setRequestIssuesStatus,
  });

  const extraCovidFieldIds = [67];
  const extraCovidAntibodyFieldIds = [70];
  const extraMedicationFieldIds = [24];

  const getSelectOption = (idx: number): any => {
    if (isMultiFaveSelect && !isEditing) {
      const multi = formState?.queuedDiagnostics[idx]?.diagnosticTypes
        ? formState.queuedDiagnostics[idx]?.diagnosticTypes
        : [];
      return multi;
    }
    const single =
      formState?.queuedDiagnostics[idx]?.diagnosticType &&
      formState.queuedDiagnostics[idx].diagnosticType?.label &&
      formState.queuedDiagnostics[idx].diagnosticType?.value
        ? {
            label: formState.queuedDiagnostics[idx].diagnosticType?.label,
            value: formState.queuedDiagnostics[idx].diagnosticType?.value,
          }
        : null;
    return single;
  };

  const isAnnotationDateInvalid = () => {
    return !(
      formState.annotationContent === emptyHTMLeditorAltContent ||
      (formState.annotationContent?.length ?? 0) < 8
    );
  };

  const onAthleteChange = (newAthleteId: number) => {
    dispatch({ type: 'SET_ATHLETE_ID', athleteId: newAthleteId });
    setRequestIssuesStatus('PENDING');

    fetchAthleteData(newAthleteId);
    fetchAthleteIssues({
      selectedAthleteId: newAthleteId,
      useOccurrenceIdValue: false,
      includeDetailedIssue: false,
      issueFilter: null,
      includeIssue: true,
      includeGrouped: true,
    })
      .then(() => setRequestIssuesStatus('SUCCESS'))
      .catch(() => {
        setRequestIssuesStatus('FAILURE');
      });
  };

  const performUpload = (attachment) => {
    return new Promise((resolve, reject) => {
      const file = attachment.file;
      const fileName = file.name;
      const fileSize = fileSizeLabel(file.size, true);
      const fileId =
        isMultiFaveSelect && !isEditing
          ? _uniqueId(attachment.id)
          : attachment.id;

      props.onFileUploadStart(fileName, fileSize, fileId);

      saveAttachment(file, attachment.fileTitle)
        .then((response) => {
          resolve(response.attachment_id);
          props.onFileUploadSuccess(fileId);
        })
        .catch(() => {
          reject();
          props.onFileUploadFailure(fileId);
        });
    });
  };

  const uploadAttachmentsAndSave = async (queuedAttachments) => {
    setRequestStatus('PENDING');

    await Promise.all(queuedAttachments.map(performUpload)).then(
      (attachmentIds) => {
        saveDiagnostic(formState, attachmentIds)
          .then(() => {
            dispatch({ type: 'CLEAR_FORM' });
            props.onSaveSuccessful();
            setRequestStatus('SUCCESS');
            props.onClose();
          })
          .catch(() => {
            setRequestStatus('FAILURE');
          });
      }
    );
  };

  const onSaveLink = () => {
    setIsLinkValidationCheckAllowed(true);

    const allRequiredLinkFieldsAreValid = areRequiredLinkFieldsValid(
      formState.linkTitle,
      formState.linkUri
    );

    // If the validation fails, abort
    if (!allRequiredLinkFieldsAreValid) {
      return;
    }
    // If validation passes, dispatch
    dispatch({
      type: 'UPDATE_QUEUED_LINKS',
      queuedLinks: [
        {
          title: formState.linkTitle,
          uri: getValidHref(formState.linkUri),
        },
      ],
    });
    dispatch({
      type: 'SET_LINK_URI',
      linkUri: '',
    });
    dispatch({
      type: 'SET_LINK_TITLE',
      linkTitle: '',
    });
    setIsLinkValidationCheckAllowed(false);
  };

  const onSave = async () => {
    setIsValidationCheckAllowed(true);

    // validation on 'Add Link' when saving diagnostic will confuse user and is not necessary
    setIsLinkValidationCheckAllowed(false);

    const associatedInjuryOrIllness = hasAssociatedInjuryOrIllness(formState);
    const enableAssociatedIssueValidation = needsAssociatedIssueValidation(
      formState.reasonId,
      injuryIllnessReasonId
    );

    const medicationDateRequired = extraMedicationFieldIds.includes(
      formState.diagnosticType?.value
    );

    const requiredFields = [
      formState.diagnosticType,
      formState.athleteId,
      formState.diagnosticDate,
      isRedoxOrg ? formState.orderProviderSGID : formState.userId,
      formState.reasonId,
      enableAssociatedIssueValidation ? associatedInjuryOrIllness : true,
      medicationDateRequired ? formState.medicationCourseStartedAt : true,
      formState.medicationCourseCompleted
        ? formState.medicationCourseCompletedAt
        : true,
      isBillingCpt && formState.cptCode.length > 0
        ? isValidCpt(formState.cptCode)
        : true,
    ];

    if (showAnnotationDatePicker && isAnnotationDateInvalid()) {
      requiredFields.push(formState.annotationDate);
    }
    if (extraCovidFieldIds.includes(formState.diagnosticType?.value))
      requiredFields.push(formState.covidTestDate, formState.covidTestResult);
    if (extraCovidAntibodyFieldIds.includes(formState.diagnosticType?.value))
      requiredFields.push(
        formState.covidAntibodyTestDate,
        formState.covidAntibodyTestResult
      );
    if (extraMedicationFieldIds.includes(formState.diagnosticType?.value))
      requiredFields.push(
        formState.medicationType,
        formState.medicationDosage,
        formState.medicationFrequency
      );

    if (isMultipleCpt) {
      requiredFields.push(areAllCptsValid(formState.queuedBillableItems));
    }

    const allRequiredFieldsAreValid = requiredFields.every(
      (item) => item && item !== emptyHTMLeditorAltContent
    );

    // If the validation fails, abort
    if (
      !allRequiredFieldsAreValid ||
      (formState.queuedAttachmentTypes?.includes('FILE') &&
        checkInvalidFileTitles(formState.queuedAttachments))
    ) {
      return;
    }

    setRequestStatus('PENDING');

    if (isEditing) {
      try {
        const { diagnostic } = await updateDiagnosticService(
          props.diagnosticToUpdate.id,
          formState
        );
        updateDiagnostic({ ...currDiagnostic, ...diagnostic });
        props.onSaveSuccessful();
        setRequestStatus('SUCCESS');
        props.onClose();
      } catch (error) {
        setRequestStatus('FAILURE');
      }
    } else {
      uploadAttachmentsAndSave(formState.queuedAttachments);
    }
  };

  const onSaveMultiLink = (index) => {
    setIsMultiLinkValidationCheckAllowed((prev) => {
      const copyPrevState = prev.slice();
      copyPrevState[index] = true;
      return copyPrevState;
    });

    const allRequiredLinkFieldsAreValid = areRequiredLinkFieldsValid(
      formState.queuedDiagnostics[index].linkTitle,
      formState.queuedDiagnostics[index].linkUri
    );

    // If the validation fails, abort
    if (!allRequiredLinkFieldsAreValid) {
      return;
    }

    // If validation passes, dispatch
    dispatch({
      type: 'UPDATE_MULTI_QUEUED_LINKS',
      index,
      queuedLinks: [
        {
          title: formState.queuedDiagnostics[index].linkTitle,
          uri: getValidHref(formState.queuedDiagnostics[index].linkUri),
        },
      ],
    });
    dispatch({
      type: 'SET_MULTI_LINK_URI',
      index,
      linkUri: '',
    });
    dispatch({
      type: 'SET_MULTI_LINK_TITLE',
      index,
      linkTitle: '',
    });
    setIsMultiLinkValidationCheckAllowed((prev) => {
      const copyPrevState = prev.slice();
      copyPrevState[index] = false;
      return copyPrevState;
    });
  };

  const onMultiSave = () => {
    setIsValidationCheckAllowed(true);

    const copiedQueuedDiagnostics =
      isMultiFaveSelect && !isEditing
        ? transformQueuedDiagnostics(formState.queuedDiagnostics.slice())
        : formState.queuedDiagnostics.slice();

    // validation on 'Add Link' when saving diagnostic will confuse user and is not necessary
    // for multi diagnostics, an empty array is initialState
    setIsMultiLinkValidationCheckAllowed([]);

    const associatedInjuryOrIllness = hasAssociatedInjuryOrIllness(formState);
    const enableAssociatedIssueValidation = needsAssociatedIssueValidation(
      formState.reasonId,
      injuryIllnessReasonId
    );

    const requiredFields = [
      // no need to iterate, same for every diagnostic:
      formState.athleteId,
      formState.locationId,
      formState.reasonId,

      enableAssociatedIssueValidation ? associatedInjuryOrIllness : true,

      // per diagnostic, all these need to be validated:
      formState.queuedDiagnostics.every(
        (diagnostic) => diagnostic.orderProviderSGID
      ),
      formState.queuedDiagnostics.every(
        (diagnostic) => diagnostic.diagnosticDate
      ),
      isMultiFaveSelect && !isEditing
        ? formState.queuedDiagnostics.every(
            (diagnostic) => diagnostic.diagnosticTypes.length
          )
        : formState.queuedDiagnostics.every(
            (diagnostic) => diagnostic.diagnosticType
          ),
      formState.queuedDiagnostics.every((diagnostic) => diagnostic.orderDate),

      formState.queuedDiagnostics.every((diagnostic) => {
        if (diagnostic.diagnosticType?.laterality_required) {
          return (
            diagnostic.lateralityId === 0 ||
            diagnostic.lateralityId === 1 ||
            diagnostic.lateralityId === 2
          );
        }

        return true;
      }),
      formState.queuedDiagnostics.every((diagnostic) => {
        if (
          diagnostic.diagnosticType?.diagnostic_type_questions?.length &&
          diagnostic.diagnosticType?.diagnostic_type_questions.some(
            (question) => question.required
          )
        ) {
          if (diagnostic.answers.length) {
            return diagnostic.answers.every((answer) => {
              // if answer requires optional text, must have both optionalText and a value
              if (answer.optionalTextRequired) {
                return answer.optionalText && answer.value;
              }
              if (answer.required) {
                return answer.value;
              }
              return true;
            });
          }
          // if any questions require answers and answers.length is falsy, then return false
          return false;
        }
        // if no questions require answers, then return true
        return true;
      }),
    ];

    const allRequiredFieldsAreValid = requiredFields.every(
      (item) => item && item !== emptyHTMLeditorAltContent
    );

    const allFilesAddedValid = formState.queuedDiagnostics.some(
      (diagnostic) =>
        diagnostic.queuedAttachmentTypes.includes('FILE') &&
        checkInvalidFileTitles(diagnostic.queuedAttachments)
    );

    // If the validation fails, abort
    if (!allRequiredFieldsAreValid || allFilesAddedValid) {
      return;
    }

    setRequestStatus('PENDING');
    // for every queued diagnostic (where I know it's queuedAttachments)
    // uploadAttachment AND SAVE!

    const arrayOfArrayOfPromises = copiedQueuedDiagnostics.map((diagnostic) =>
      // $FlowFixMe
      diagnostic.queuedAttachments.map((attachment) =>
        performUpload(attachment)
      )
    );

    const promiseArray = arrayOfArrayOfPromises.map((arrayOfPromises) =>
      Promise.all(arrayOfPromises)
    );

    Promise.all(promiseArray).then((data) => {
      const transformedQueuedDiagnostics = copiedQueuedDiagnostics.map(
        (diagnostic, index) => ({
          ...diagnostic,
          queuedAttachments: data[index],
        })
      );
      if (isEditing) {
        updateDiagnosticService(props.diagnosticToUpdate.id, formState)
          .then((res) => {
            updateDiagnostic({ ...currDiagnostic, ...res.diagnostic });
            setRequestStatus('SUCCESS');
            props.onClose();
          })
          .catch(() => {
            setRequestStatus('FAILURE');
          });
      }
      if (!isEditing) {
        saveDiagnostic(
          {
            ...formState,
            // $FlowFixMe
            queuedDiagnostics: transformedQueuedDiagnostics || [],
          },
          [],
          true
        )
          .then(() => {
            dispatch({ type: 'CLEAR_FORM' });
            props.onSaveSuccessful();
            setRequestStatus('SUCCESS');
            props.onClose();
          })
          .catch(() => {
            setRequestStatus('FAILURE');
          });
      }
    });
  };

  const getDiagnosticTypeOptions = () => {
    if (isCovid19MedicalDiagnostic) {
      return props.diagnosticTypes;
    }
    return props.diagnosticTypes.filter(
      (diagnosticType) =>
        diagnosticType.label !== 'COVID-19 Antibody Test' &&
        diagnosticType.label !== 'COVID-19 Test'
    );
  };

  const getDiagnosticReasonsOptions = () => {
    if (
      enrichedAthleteIssues[0]?.options.length > 0 ||
      enrichedAthleteIssues[1]?.options.length > 0 ||
      enrichedAthleteIssues[2]?.options.length > 0
    ) {
      return props.diagnosticReasons || [];
    }
    return (
      props.diagnosticReasons?.filter(
        ({ isInjuryIllness }) => !isInjuryIllness
      ) || []
    );
  };

  const getAssociatedInjuryIllnessValues = () => {
    return getFormattedIssueIds(
      formState.injuryIds,
      formState.illnessIds,
      formState.chronicIssueIds
    );
  };

  const isAssociatedRelatedInjuryIllnessValid = (): boolean => {
    return (
      isValidationCheckAllowed &&
      formState.injuryIds.length < 1 &&
      formState.illnessIds.length < 1 &&
      formState.chronicIssueIds.length < 1 &&
      formState.reasonId === injuryIllnessReasonId
    );
  };

  // this function should return true when status is pending, unreconciled, incomplete, or preliminary
  // in order to disable editing of certain fields in side panel
  const shouldDisableEditing = () => {
    if (props.diagnosticToUpdate) {
      const diagnosticStatus = props.diagnosticToUpdate.status?.text;
      return (
        diagnosticStatus === 'Pending' ||
        diagnosticStatus === 'Unreconciled' ||
        diagnosticStatus === 'Incomplete' ||
        diagnosticStatus === 'Preliminary'
      );
    }

    // if there is no diagnosticToUpdate then everything is editable
    return false;
  };

  // If an index is passed in then it its actions act as the multi attachment type version.
  const renderFileUploadArea = (index?: number) => (
    <FileUploadArea
      areaTitle={props.t('Attach file(s)')}
      showActionButton
      actionIcon="icon-bin"
      testIdPrefix="AddDiagnosticSidePanel"
      isFileError={false}
      onClickActionButton={() =>
        index !== undefined
          ? dispatch({
              type: 'REMOVE_MULTI_ATTACHMENT_TYPE',
              index,
              queuedAttachmentType: 'FILE',
            })
          : dispatch({
              type: 'REMOVE_ATTACHMENT_TYPE',
              queuedAttachmentType: 'FILE',
            })
      }
      updateFiles={(queuedAttachments) =>
        index !== undefined
          ? dispatch({
              type: 'UPDATE_MULTI_QUEUED_ATTACHMENTS',
              index,
              queuedAttachments,
            })
          : dispatch({
              type: 'UPDATE_QUEUED_ATTACHMENTS',
              queuedAttachments,
            })
      }
      attachedFiles={
        index !== undefined
          ? formState.queuedDiagnostics[index].queuedAttachments
          : formState.queuedAttachments
      }
      removeFiles={props.isOpen}
      acceptedFileTypeCode="diagnostics"
    />
  );

  const commonFormProps = {
    isPastAthlete,
    athleteData,
    formState,
    isValidationCheckAllowed,
    requestStatus,
    requestIssuesStatus,
    isAthleteSelectable: props.isAthleteSelectable,
    athleteId,
    permissions,
    squadAthletes: props.squadAthletes,
    medicalLocations: props.medicalLocations,
    enrichedAthleteIssues,
    injuryIllnessReasonId,
    dispatch,
    onAthleteChange,
    getDiagnosticReasonsOptions,
    getAssociatedInjuryIllnessValues,
    isAssociatedRelatedInjuryIllnessValid,
    renderFileUploadArea,
  };

  return (
    <div>
      <div css={style.sidePanel}>
        <SlidingPanelResponsive
          isOpen={props.isOpen}
          onClose={props.onClose}
          kitmanDesignSystem
          title={
            isEditing ? props.t('Edit diagnostic') : props.t('Add diagnostic')
          }
          width={659}
          intercomTarget="Add diagnostic - Sliding panel"
        >
          {isRedoxOrg ? (
            <RedoxOrgForm
              {...commonFormProps}
              isEditing={isEditing}
              organisation={organisation}
              orderProviders={orderProviders}
              editorRefs={editorRefs}
              isMultiLinkValidationCheckAllowed={
                isMultiLinkValidationCheckAllowed
              }
              diagnosticGroupSets={diagnosticGroupSets}
              bodyAreas={bodyAreas}
              setOrderProviders={setOrderProviders}
              setRequestStatus={setRequestStatus}
              setIsMultiLinkValidationCheckAllowed={
                setIsMultiLinkValidationCheckAllowed
              }
              shouldDisableEditing={shouldDisableEditing}
              onSaveMultiLink={onSaveMultiLink}
              getSelectOption={getSelectOption}
            />
          ) : (
            <NonRedoxOrgForm
              {...commonFormProps}
              isEditing={isEditing}
              staffUsers={props.staffUsers}
              isLinkValidationCheckAllowed={isLinkValidationCheckAllowed}
              covidResultTypes={props.covidResultTypes}
              covidAntibodyResultTypes={props.covidAntibodyResultTypes}
              extraCovidFieldIds={extraCovidFieldIds}
              extraCovidAntibodyFieldIds={extraCovidAntibodyFieldIds}
              extraMedicationFieldIds={extraMedicationFieldIds}
              initialDataRequestStatus={props.initialDataRequestStatus}
              getDiagnosticTypeOptions={getDiagnosticTypeOptions}
              setIsLinkValidationCheckAllowed={setIsLinkValidationCheckAllowed}
              onSaveLink={onSaveLink}
            />
          )}
          <div css={style.actions}>
            <TextButton
              onClick={isRedoxOrg ? onMultiSave : onSave}
              text={
                // eslint-disable-next-line no-nested-ternary
                formState.redoxOrderStatus === 1
                  ? props.t('Send')
                  : isEditing
                  ? props.t('Update')
                  : props.t('Save')
              }
              type="primary"
              isLoading={requestStatus === 'PENDING'}
              kitmanDesignSystem
            />
          </div>
          {(requestStatus === 'FAILURE' ||
            requestIssuesStatus === 'FAILURE' ||
            props.initialDataRequestStatus === 'FAILURE') && (
            <AppStatus status="error" />
          )}
        </SlidingPanelResponsive>
      </div>
    </div>
  );
};

export const AddDiagnosticSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddDiagnosticSidePanel);
export default AddDiagnosticSidePanel;
