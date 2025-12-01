// @flow
import { useEffect, useRef, useState, type ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import {
  DatePicker,
  InputTextField,
  InputNumeric,
  RichTextEditor,
  Select,
  SlidingPanelResponsive,
  TextButton,
  TimePicker,
  TooltipMenu,
  FileUploadArea,
} from '@kitman/components';
import { Typography } from '@kitman/playbook/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { organisationAssociations } from '@kitman/common/src/variables';
import { saveProcedure, updateProcedure, uploadFile } from '@kitman/services';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { checkInvalidFileTitles } from '@kitman/common/src/utils/fileHelper';
import {
  validateURL,
  getValidHref,
  containsWhitespace,
} from '@kitman/common/src/utils';
import { useProcedure } from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext';
import {
  emptyHTMLeditorContent,
  getEditorStateFromValue,
  getFormattedIssueIds,
  getIssueIds,
} from '@kitman/modules/src/Medical/shared/utils';
import useEnrichedAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues';
import useProcedureForm from '@kitman/modules/src/Medical/shared/components/AddProcedureSidePanel/hooks/useProcedureForm';
import style from '@kitman/modules/src/Medical/shared/components/AddProcedureSidePanel/styles';
import { useIssue } from '@kitman/modules/src/Medical/shared/contexts/IssueContext';
import AthleteConstraints from '@kitman/modules/src/Medical/shared/components/AthleteConstraints';
import ProcedureTypeSelect from '@kitman/modules/src/Medical/shared/components/AddProcedureSidePanel/components/ProcedureTypeSelect';
import { LinksTranslated as Links } from '@kitman/modules/src/Medical/shared/components/AddProcedureSidePanel/components/Links';
import type { OrganisationStatus } from '@kitman/modules/src/Medical/shared/types/medical/Constraints';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import type { BodyArea } from '@kitman/services/src/services/medical/clinicalImpressions';
import type { OrderProviderType } from '@kitman/services/src/services/medical/getOrderProviders';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { ProceduresFormDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';
import type {
  ProcedureType,
  ProcedureResponseData,
} from '@kitman/modules/src/Medical/shared/types/medical/Procedures';

type Props = {
  athleteConstraints?: { organisationStatus: OrganisationStatus },
  athleteId: number,
  bodyAreas: Array<BodyArea>,
  initialDataRequestStatus: RequestStatus,
  isOpen: boolean,
  locationId: number,
  orderProviders: OrderProviderType,
  proceduresFormData: ProceduresFormDataResponse,
  procedureToUpdate: Object,
  squadAthletes: Array<Option>,
  onClose: Function,
  onFileUploadFailure: Function,
  onFileUploadStart: Function,
  onFileUploadSuccess: Function,
  onSaveProcedure: Function,
};

const AddProcedureSidePanel = (props: I18nProps<Props>) => {
  const { formState, dispatch } = useProcedureForm();
  const { updateProcedure: updateSingleProcedure } = useProcedure();
  const { issue, isChronicIssue, issueType } = useIssue();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [saveRequestStatus, setSaveRequestStatus] =
    useState<RequestStatus>(null);
  const { enrichedAthleteIssues, fetchAthleteIssues } =
    useEnrichedAthletesIssues({
      athleteId: props.isOpen && props.athleteId ? props.athleteId : null,
      useOccurrenceId: true,
    });

  const [procedureReasons, setProcedureReasons] = useState<Array<Option>>([]);
  const [procedureComplications, setProcedureComplications] = useState<
    Array<Option>
  >([]);
  const [showComplications, setShowComplications] = useState<boolean>(false);
  const [isLinkValidationCheckAllowed, setIsLinkValidationCheckAllowed] =
    useState<Array<boolean>>([]);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);

  const { data: organisation } = useGetOrganisationQuery();
  const shouldShowCopyright = [organisationAssociations.nfl].includes(
    organisation?.association_name
  );

  const editorRefs = useRef([]);

  const isMultiFaveSelect = window.featureFlags['multi-fave-select'];
  const isEditing = props.procedureToUpdate && props.isOpen;

  const showPlayerMovementDatePicker = () => {
    return window.featureFlags['player-movement-aware-datepicker'];
  };

  const onClose = () => {
    setRequestStatus(null);
    setSaveRequestStatus(null);
    setIsValidationCheckAllowed(false);
    props.onClose();
  };

  const getReasonDisabledStatus = (index) => {
    return isMultiFaveSelect && !isEditing
      ? requestStatus === 'PENDING' ||
          props.initialDataRequestStatus === 'FAILURE' ||
          !formState.locationId ||
          !formState.queuedProcedures[index].providerSgid ||
          !formState.queuedProcedures[index].procedureTypes.length
      : requestStatus === 'PENDING' ||
          props.initialDataRequestStatus === 'FAILURE' ||
          !formState.locationId ||
          !formState.queuedProcedures[index].providerSgid ||
          !formState.queuedProcedures[index].procedureType;
  };

  const updateIssueIds = (index: number) => {
    if (isChronicIssue) {
      dispatch({
        type: 'SET_CHRONIC_IDS',
        index,
        chronicIssueIds: [issue.id],
      });
    } else if (issueType === 'Injury' && issue.id) {
      dispatch({ type: 'SET_INJURY_IDS', index, injuryIds: [issue.id] });
    } else if (issueType === 'Illness' && issue.id) {
      dispatch({ type: 'SET_ILLNESS_IDS', index, illnessIds: [issue.id] });
    }
  };

  // Map & sort procedure types for <Select />
  const sortAndOrderSelectOptions = (optionsArray: Array<any>) => {
    return optionsArray
      ?.map(({ id, name }) => ({
        value: id,
        label: name,
      }))
      .sort((a, b) => {
        const lowercaseA = a.label.toLowerCase();
        const lowercaseB = b.label.toLowerCase();
        return lowercaseA.localeCompare(lowercaseB);
      });
  };

  // List of Complications that are intravenous === true
  const intravenousComplicationsArray =
    props.proceduresFormData?.procedure_complications?.filter(
      (procedure) => procedure.intravenous
    );

  const isProcedureIntravenous = (procedureType: ProcedureType) =>
    procedureType.intravenous;

  // Procedure Complications
  const getProcedureComplications = (procedureType: ProcedureType) => {
    if (procedureType.intravenous) {
      const sortedIntravenousComplications = sortAndOrderSelectOptions(
        intravenousComplicationsArray
      );

      sortedIntravenousComplications?.push({
        value: -1,
        label: 'Other',
      });

      setProcedureComplications(sortedIntravenousComplications);
      return;
    }
    // Non intravenous Procedure Reasons
    const sortedDefaultComplications = sortAndOrderSelectOptions(
      props.proceduresFormData?.procedure_complications?.filter(
        ({ intravenous }) => !intravenous
      )
    );

    sortedDefaultComplications?.push({
      value: -1,
      label: 'Other',
    });

    setProcedureComplications(sortedDefaultComplications);
  };

  // List of Procedures that are intravenous === true
  const intravenousReasonsArray =
    props.proceduresFormData?.procedure_reasons?.filter(
      (procedure) => procedure.intravenous
    );

  // Pull out Procedure Reasons that ore marked as 'intravenous'
  // TODO: Clean up this code to reduce bloat & repetition
  const getProcedureReasons = (procedureType: ProcedureType) => {
    const procedureIsIntravenous = procedureType.intravenous;

    if (procedureIsIntravenous) {
      const sortedIntravenousProcedureReasons = sortAndOrderSelectOptions(
        intravenousReasonsArray
      );

      sortedIntravenousProcedureReasons.push({
        value: -1,
        label: 'Other',
      });

      setProcedureReasons(sortedIntravenousProcedureReasons);
      return;
    }

    // Non intravenous Procedure Reasons
    const sortedDefaultProcedureReasons = sortAndOrderSelectOptions(
      props.proceduresFormData?.procedure_reasons?.filter(
        ({ intravenous }) => !intravenous
      )
    );

    sortedDefaultProcedureReasons.push({
      value: -1,
      label: 'Other',
    });

    setProcedureReasons(sortedDefaultProcedureReasons);
  };

  useEffect(() => {
    if (props.isOpen) {
      // Default Procedure Order Date <DatePicker /> to today's date for current athletes, on initial open
      if (
        !isEditing &&
        props.athleteConstraints?.organisationStatus === 'CURRENT_ATHLETE'
      ) {
        dispatch({
          type: 'SET_PROCEDURE_ORDER_DATE',
          index: 0,
          procedureOrderDate: moment()
            .startOf('day')
            .format(dateTransferFormat),
        });

        dispatch({
          type: 'SET_PROCEDURE_DATE',
          index: 0,
          procedureDate: moment().startOf('day').format(dateTransferFormat),
        });
      }

      if (props.athleteId) {
        fetchAthleteIssues({
          selectedAthleteId: props.athleteId,
          useOccurrenceIdValue: true,
          includeDetailedIssue: false,
          issueFilter: null,
          includeIssue: true,
          includeGrouped: true,
        })
          .then(() => setRequestStatus('SUCCESS'))
          .catch(() => setRequestStatus('FAILURE'));

        dispatch({
          type: 'SET_ATHLETE_ID',
          athleteId: props.athleteId,
        });
      }

      if (props.locationId) {
        dispatch({
          type: 'SET_LOCATION_ID',
          locationId: props.locationId,
        });
      }

      if (issue.id && issueType) {
        updateIssueIds(0);
      }
    }

    if (!props.isOpen) {
      // clear all unsaved notes, order of operation matters!
      // NOTE: if we ever change from RichTextEditor to RichTextEditorAlt, we need to change this to use setContent instead of update
      editorRefs.current?.forEach((ref) =>
        ref?.update(getEditorStateFromValue(''))
      );
      setIsValidationCheckAllowed(false);
      dispatch({ type: 'CLEAR_FORM' });
    }
  }, [props.isOpen, props.athleteId, props.locationId, issue]);

  useEffect(() => {
    if (props.proceduresFormData) {
      dispatch({
        type: 'SET_FORM_DATA',
        formData: props.proceduresFormData,
      });
    }
  }, [props.proceduresFormData]);

  /**
   * Editing a Procedure flow - currently opening sidepanel from entity view & populating with
   * the values of the props.procedureToUpdate (procedure) being passed down
   * TODO: Look at switching editing experience to normal editing-in-place view & cleaning up
   */
  useEffect(() => {
    if (isEditing) {
      const procedureToUpdate: ProcedureResponseData = props.procedureToUpdate;

      getProcedureComplications(procedureToUpdate.procedure_type);

      getProcedureReasons(procedureToUpdate.procedure_type);

      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: procedureToUpdate.athlete.id,
      });

      dispatch({
        type: 'SET_PROCEDURE_DATE',
        index: 0,
        procedureDate: procedureToUpdate.procedure_date,
      });

      dispatch({
        type: 'SET_PROCEDURE_ORDER_DATE',
        index: 0,
        procedureOrderDate: procedureToUpdate.order_date,
      });
      dispatch({
        type: 'SET_PROVIDER_SGID',
        index: 0,
        providerSgid: procedureToUpdate.other_provider
          ? -1
          : procedureToUpdate?.provider?.sgid,
        isMulti: isMultiFaveSelect && !isEditing,
      });

      dispatch({
        type: 'SET_OTHER_PROVIDER',
        index: 0,
        otherProvider: procedureToUpdate.other_provider,
      });

      dispatch({
        type: 'SET_PROCEDURE_TYPE',
        index: 0,
        procedureType: {
          ...procedureToUpdate.procedure_type,
          value: procedureToUpdate.procedure_type.id,
          label: procedureToUpdate.procedure_type.name,
        },
      });

      dispatch({
        type: 'SET_PROCEDURE_REASON',
        index: 0,
        procedureReason: procedureToUpdate?.other_reason
          ? -1
          : procedureToUpdate?.procedure_reason?.id,
      });
      dispatch({
        type: 'SET_PROCEDURE_REASON_OTHER',
        index: 0,
        procedureReasonOther: procedureToUpdate?.other_reason,
      });
      dispatch({
        type: 'SET_PROCEDURE_DESCRIPTION',
        index: 0,
        procedureDescription: procedureToUpdate?.procedure_type_description,
      });

      if (props.procedureToUpdate.procedure_complications?.length) {
        setShowComplications(true);

        if (props.procedureToUpdate.other_complication?.length) {
          dispatch({
            type: 'SET_PROCEDURE_COMPLICATION_OTHER',
            index: 0,
            procedureComplicationOther: procedureToUpdate.other_complication,
          });
        }

        dispatch({
          type: 'SET_PROCEDURE_COMPLICATION_IDS',
          index: 0,
          procedureComplicationIds: [
            ...props.procedureToUpdate.procedure_complications.map(
              (complication) => complication.id
            ),
            props.procedureToUpdate.other_complication ? -1 : null,
          ],
        });
      }

      if (procedureToUpdate?.issue_occurrences?.length) {
        dispatch({
          type: 'SET_ILLNESS_IDS',
          index: 0,
          illnessIds: procedureToUpdate?.issue_occurrences
            ?.filter((item) => item.issue_type === 'Illness')
            .map((item) => item.id),
        });

        dispatch({
          type: 'SET_INJURY_IDS',
          index: 0,
          injuryIds: procedureToUpdate?.issue_occurrences
            ?.filter((item) => item.issue_type === 'Injury')
            .map((item) => item.id),
        });
      }

      dispatch({
        type: 'SET_BODY_AREA_ID',
        index: 0,
        bodyAreaId: procedureToUpdate?.body_area?.id,
      });

      dispatch({
        type: 'SET_PROCEDURE_DURATION',
        index: 0,
        procedureDuration: procedureToUpdate?.duration,
      });

      dispatch({
        type: 'SET_PROCEDURE_IV_AMOUNT',
        index: 0,
        procedureAmount: procedureToUpdate?.total_amount,
      });

      dispatch({
        type: 'SET_PROCEDURE_IV_AMOUNT_USED',
        index: 0,
        procedureAmountUsed: procedureToUpdate?.amount_used,
      });

      dispatch({
        type: 'SET_PROCEDURE_IV_URINE_GRAVITY',
        index: 0,
        procedureUrineGravity: procedureToUpdate?.urine_specific_gravity,
      });

      dispatch({
        type: 'SET_PROCEDURE_TIMING_OTHER',
        index: 0,
        procedureTimingOther: procedureToUpdate?.other_timing,
      });

      dispatch({
        type: 'SET_PROCEDURE_TIMING',
        index: 0,
        procedureTiming: procedureToUpdate?.timing,
      });

      dispatch({
        type: 'SET_BODY_AREA_ID',
        index: 0,
        bodyAreaId: procedureToUpdate?.body_area?.id,
      });
    }
  }, [isEditing, props.isOpen, props.proceduresFormData]);

  // Append 'Other' option to External Providers - should probably look at different approach in future
  const getExternalProviderOptions = (providers) => {
    const sortedProviders =
      providers?.location_providers?.map(({ sgid, fullname }) => ({
        value: sgid,
        label: fullname,
      })) || [];

    sortedProviders.push({
      label: props.t('Other'),
      value: -1,
    });

    return sortedProviders;
  };

  // Check if chosen Provider / Procedure / Timing / Complcation option is 'Other' - to be cleaned up
  const isProviderOther = (provider) => provider === -1;
  const isProcedureReasonOther = (reasonId) => reasonId === -1;
  const isTimingOther = (timing) => timing === 'other';
  const isComplicationOther = (complications) => complications?.includes(-1);

  const isAssociatedIssueRequired = props.proceduresFormData?.procedure_reasons
    ?.filter((procedure) => procedure.issue_required)
    .map((item) => item.id);

  const onAthleteChange = (athleteId: number) => {
    fetchAthleteIssues({
      selectedAthleteId: athleteId,
      useOccurrenceIdValue: true,
      includeDetailedIssue: false,
      issueFilter: null,
      includeIssue: true,
      includeGrouped: true,
    })
      .then(() => setRequestStatus('SUCCESS'))
      .catch(() => setRequestStatus('FAILURE'));

    dispatch({ type: 'SET_ATHLETE_ID', athleteId });
  };

  const getProcedureSelectOption = (idx) => {
    if (isMultiFaveSelect && !isEditing) {
      return formState?.queuedProcedures[idx]?.procedureTypes
        ? formState.queuedProcedures[idx]?.procedureTypes
        : [];
    }
    return formState.queuedProcedures[idx].procedureType
      ? {
          value: formState.queuedProcedures[idx].procedureType.id,
          label: formState.queuedProcedures[idx].procedureType.label,
        }
      : null;
  };

  const uploadFiles = (
    unConfirmedFiles,
    procedureIndex,
    copiedQueuedProcedures
  ) => {
    unConfirmedFiles.forEach((unConfirmedFile, unconfirmedFileIndex) => {
      const unUploadedFile =
        // $FlowFixMe
        copiedQueuedProcedures[procedureIndex].queuedAttachments[
          unconfirmedFileIndex
        ].file;

      const fileName = unUploadedFile.name;
      const fileSize = fileSizeLabel(unUploadedFile.size, true);
      const fileId = unConfirmedFile.id;
      props.onFileUploadStart(fileName, fileSize, fileId);

      uploadFile(
        unUploadedFile,
        unConfirmedFile.id,
        unConfirmedFile.presigned_post
      )
        .then(() => props.onFileUploadSuccess(fileId))
        .catch(() => props.onFileUploadFailure(fileId));
    });
  };

  // Procedure Save
  const onSave = () => {
    setIsValidationCheckAllowed(true);

    const transformQueuedProcedures = (arrayOfQueuedProcedures) => {
      return arrayOfQueuedProcedures
        .map((item) =>
          item.procedureTypes.map((type) => {
            return {
              ...item,
              procedureType: type,
              procedureTypes: [],
            };
          })
        )
        .flat(Infinity);
    };

    const copiedQueuedProcedures =
      isMultiFaveSelect && !isEditing
        ? transformQueuedProcedures(formState.queuedProcedures.slice())
        : formState.queuedProcedures.slice();

    const proceduresWithReasonsThatRequireOther =
      formState.queuedProcedures.filter(
        (procedure) => procedure.procedureReason === -1
      );

    const proceduresProviderThatRequireOther =
      formState.queuedProcedures.filter(
        (procedure) => procedure.providerSgid === -1
      );

    const proceduresComplicationsThatRequireOther =
      formState.queuedProcedures.filter((procedure) =>
        procedure.procedureComplicationIds?.includes(-1)
      );

    const proceduresNeedingTiming = formState.queuedProcedures.filter(
      (procedure) =>
        procedure.procedureType &&
        isProcedureIntravenous(procedure.procedureType)
    );

    const requiredFields = [
      formState.athleteId,
      formState.locationId,
      // per procedure, all these need to be validated:
      formState.queuedProcedures.every((procedure) => procedure.providerSgid),
      formState.queuedProcedures.every((procedure) => procedure.procedureType),
      formState.queuedProcedures.every((procedure) => procedure.procedureDate),
      formState.queuedProcedures.every(
        (procedure) => procedure.procedureOrderDate
      ),
      formState.queuedProcedures.every(
        (procedure) => procedure.procedureReason
      ),

      proceduresNeedingTiming.length > 0
        ? proceduresNeedingTiming.every(
            (procedure) => procedure.procedureTiming
          )
        : true,

      proceduresWithReasonsThatRequireOther.length > 0
        ? proceduresWithReasonsThatRequireOther.every(
            (procedure) => procedure.procedureReasonOther
          )
        : true,

      proceduresProviderThatRequireOther.length > 0
        ? proceduresProviderThatRequireOther.every(
            (procedure) => procedure.otherProvider
          )
        : true,

      proceduresComplicationsThatRequireOther.length > 0
        ? proceduresComplicationsThatRequireOther.every(
            (procedure) => procedure.procedureComplicationOther
          )
        : true,

      formState.queuedProcedures.every((procedure) =>
        isAssociatedIssueRequired?.includes(procedure.procedureReason)
          ? procedure.injuryIds.length > 0 ||
            procedure.illnessIds.length > 0 ||
            procedure.chronicIssueIds.length > 0
          : true
      ),
      formState.queuedProcedures.every(
        (procedure) => !checkInvalidFileTitles(procedure.queuedAttachments)
      ),
    ];

    const allRequiredFieldsAreValid = requiredFields.every(
      (item) => item && item !== emptyHTMLeditorContent
    );

    // If the validation fails, abort
    if (!allRequiredFieldsAreValid) {
      return;
    }

    if (props.procedureToUpdate) {
      updateProcedure(props.procedureToUpdate.id, formState)
        .then((data) => {
          updateSingleProcedure(data);
          onClose();
          props.onSaveProcedure?.();
        })
        .catch(() => setRequestStatus('FAILURE'));

      return;
    }
    setSaveRequestStatus('PENDING');
    // $FlowFixMe
    saveProcedure({ ...formState, queuedProcedures: copiedQueuedProcedures })
      .then((response) => {
        setSaveRequestStatus('SUCCESS');
        response.forEach((createdProcedure, index) => {
          const attachments = createdProcedure.attachments;
          if (attachments) {
            const unconfirmedFiles = attachments.filter((f) => !f.confirmed);

            if (unconfirmedFiles.length > 0) {
              uploadFiles(unconfirmedFiles, index, copiedQueuedProcedures);
            }
          }
        });

        setRequestStatus(null);

        setSaveRequestStatus(null);
        onClose();
        props.onSaveProcedure?.();
      })
      .catch(() => {
        setSaveRequestStatus('FAILURE');
        setRequestStatus('FAILURE');
      });
  };

  const onSaveLink = (index) => {
    setIsLinkValidationCheckAllowed((prev) => {
      const copyPrevState = prev.slice();
      copyPrevState[index] = true;
      return copyPrevState;
    });

    const requiredLinkFields = [
      formState.queuedProcedures[index].linkTitle.length > 0,
      validateURL(formState.queuedProcedures[index].linkUri) &&
        !containsWhitespace(formState.queuedProcedures[index].linkUri),
    ];

    const allRequiredLinkFieldsAreValid = requiredLinkFields.every(
      (item) => item
    );

    // If the validation fails, abort
    if (
      !allRequiredLinkFieldsAreValid ||
      (formState.queuedProcedures[index].queuedAttachmentTypes.includes(
        'FILE'
      ) &&
        checkInvalidFileTitles(
          formState.queuedProcedures[index].queuedAttachments
        ))
    ) {
      return;
    }

    // If validation passes, dispatch
    dispatch({
      type: 'UPDATE_QUEUED_LINKS',
      index,
      queuedLinks: [
        {
          title: formState.queuedProcedures[index].linkTitle,
          uri: getValidHref(formState.queuedProcedures[index].linkUri),
        },
      ],
    });

    dispatch({
      type: 'SET_LINK_URI',
      index,
      linkUri: '',
    });

    dispatch({
      type: 'SET_LINK_TITLE',
      index,
      linkTitle: '',
    });

    setIsLinkValidationCheckAllowed((prev) => {
      const copyPrevState = prev.slice();
      copyPrevState[index] = false;
      return copyPrevState;
    });
  };

  const getAssociatedInjuryIllnessValues = (index) => {
    return getFormattedIssueIds(
      formState.queuedProcedures[index]?.injuryIds || [],
      formState.queuedProcedures[index]?.illnessIds || [],
      formState.queuedProcedures[index]?.chronicIssueIds || []
    );
  };

  const renderPlayerSelector = () => {
    return (
      <AthleteConstraints athleteId={formState.athleteId}>
        {({ organisationStatus, athleteSelector, isLoading }) => (
          <div
            css={[style.player, style.gridRow1]}
            data-testid="AddProcedureSidePanel|Athlete"
          >
            <Select
              label={props.t('Player')}
              onChange={(id) => onAthleteChange(id)}
              value={formState.athleteId}
              options={
                organisationStatus === 'PAST_ATHLETE'
                  ? athleteSelector
                  : props.squadAthletes
              }
              invalid={isValidationCheckAllowed && !formState.athleteId}
              isDisabled={
                !!props.athleteId ||
                isLoading ||
                requestStatus === 'PENDING' ||
                props.initialDataRequestStatus === 'FAILURE'
              }
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  // Pass through procedureIndex to determine which procedure in queuedProcedures we're dealing with
  const renderProcedureOrderDatePicker = (procedureIndex) => {
    return (
      <AthleteConstraints athleteId={formState.athleteId}>
        {({ lastActivePeriod, isLoading }) => (
          <div data-testid="AddProcedureSidePanel|ProcedureOrderDate">
            <DatePicker
              label={props.t('Procedure order date')}
              onDateChange={(date) => {
                dispatch({
                  type: 'SET_PROCEDURE_ORDER_DATE',
                  index: procedureIndex,
                  procedureOrderDate: moment(date).format(dateTransferFormat),
                });
              }}
              value={
                formState.queuedProcedures[procedureIndex].procedureOrderDate
                  ? moment(
                      formState.queuedProcedures[procedureIndex]
                        .procedureOrderDate
                    ).format(dateTransferFormat)
                  : null
              }
              invalid={
                isValidationCheckAllowed &&
                !formState.queuedProcedures[procedureIndex].procedureOrderDate
              }
              disabled={
                isLoading ||
                requestStatus === 'PENDING' ||
                !formState.athleteId ||
                !formState.locationId
              }
              maxDate={lastActivePeriod.end}
              minDate={lastActivePeriod.start}
              kitmanDesignSystem
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  const renderProcedureOrderDatePickerNew = (procedureIndex) => {
    const procedureOrderDate =
      formState.queuedProcedures[procedureIndex].procedureOrderDate;
    const formattedOrderDate = procedureOrderDate
      ? moment(procedureOrderDate)
      : null;

    return (
      <MovementAwareDatePicker
        athleteId={formState.athleteId || undefined}
        value={formattedOrderDate}
        onChange={(date) => {
          dispatch({
            type: 'SET_PROCEDURE_ORDER_DATE',
            index: procedureIndex,
            procedureOrderDate: moment(date).format(dateTransferFormat),
          });
        }}
        name="ProcedureOrderDate"
        inputLabel={props.t('Procedure order date')}
        isInvalid={isValidationCheckAllowed && !procedureOrderDate}
        disabled={
          requestStatus === 'PENDING' ||
          !formState.athleteId ||
          !formState.locationId
        }
        disableFuture
        width="auto"
        kitmanDesignSystem
      />
    );
  };

  const renderProcedureAppointmentDatePicker = (procedureIndex) => {
    return (
      <AthleteConstraints athleteId={formState.athleteId} disableMaxDate>
        {({ lastActivePeriod, isLoading }) => (
          <div data-testid="AddProcedureSidePanel|ProcedureDate">
            <DatePicker
              label={props.t('Procedure appt. date')}
              onDateChange={(date) => {
                dispatch({
                  type: 'SET_PROCEDURE_DATE',
                  index: procedureIndex,
                  procedureDate: moment(date).format(dateTransferFormat),
                });
              }}
              value={
                formState.queuedProcedures[procedureIndex].procedureDate
                  ? moment(
                      formState.queuedProcedures[procedureIndex].procedureDate
                    )
                  : null
              }
              minDate={moment(
                formState.queuedProcedures[procedureIndex].procedureOrderDate
              ).format(dateTransferFormat)}
              invalid={
                isValidationCheckAllowed &&
                !formState.queuedProcedures[procedureIndex].procedureDate
              }
              disabled={
                isLoading ||
                requestStatus === 'PENDING' ||
                !formState.athleteId ||
                !formState.locationId
              }
              kitmanDesignSystem
              maxDate={lastActivePeriod.end}
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  const renderProcedureAppointmentDatePickerNew = (procedureIndex) => {
    const procedureDate =
      formState.queuedProcedures[procedureIndex].procedureDate;
    const formattedApptDate = procedureDate ? moment(procedureDate) : null;
    const procedureOrderDate =
      formState.queuedProcedures[procedureIndex].procedureOrderDate;
    const formattedOrderDate = procedureOrderDate
      ? moment(procedureOrderDate)
      : null;

    return (
      <MovementAwareDatePicker
        athleteId={formState.athleteId || undefined}
        value={formattedApptDate}
        onChange={(date) => {
          dispatch({
            type: 'SET_PROCEDURE_DATE',
            index: procedureIndex,
            procedureDate: moment(date).format(dateTransferFormat),
          });
        }}
        name="ProcedureApptDate"
        inputLabel={props.t('Procedure appt. date')}
        isInvalid={isValidationCheckAllowed && !procedureDate}
        minDate={formattedOrderDate}
        width="auto"
        kitmanDesignSystem
      />
    );
  };

  const onAddAnotherProcedure = () => {
    dispatch({
      type: 'ADD_ANOTHER_PROCEDURE',
      athleteId: formState.athleteId,
    });
    updateIssueIds(formState.queuedProcedures.length);
  };

  const setFormProcedureReason = (procedureReason, index) => {
    dispatch({
      type: 'SET_PROCEDURE_REASON_OTHER',
      index,
      procedureReasonOther: '',
    });
    dispatch({
      type: 'SET_PROCEDURE_REASON',
      index,
      procedureReason,
    });
  };

  return (
    <div data-testid="AddProcedureSidePanel|Parent">
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        onClose={onClose}
        kitmanDesignSystem
        title={
          props.procedureToUpdate
            ? props.t('Edit Procedure')
            : props.t('Add procedure')
        }
        width={659}
        intercomTarget="Add procedure - Sliding panel"
      >
        <div css={style.content}>
          {renderPlayerSelector()}

          {formState.queuedProcedures?.map((procedure, index) => (
            <div
              key={procedure.key}
              css={[
                style.proceduresContainer,
                style.span3,
                index > 0 ? style.marginTopMulti : null,
              ]}
            >
              {formState.queuedProcedures.length > 1 && (
                <div css={[style.linksHeader, style.span3]}>
                  <h3>
                    {props.t('Procedure {{orderNumber}}', {
                      orderNumber: index + 1,
                    })}
                  </h3>
                  <div
                    css={[
                      !isEditing && isMultiFaveSelect && style.buttonContainer,
                    ]}
                  >
                    {index === 0 && !isEditing && isMultiFaveSelect && (
                      <div css={[style.setForAllButton]}>
                        <TextButton
                          text={props.t('Set for all')}
                          onClick={() => {
                            dispatch({
                              type: 'SET_FOR_ALL',
                            });
                          }}
                          disabled={requestStatus === 'PENDING'}
                          type="secondary"
                          kitmanDesignSystem
                        />
                      </div>
                    )}

                    <TextButton
                      onClick={() => {
                        dispatch({
                          type: 'REMOVE_PROCEDURE',
                          index,
                        });
                      }}
                      disabled={requestStatus === 'PENDING'}
                      iconBefore="icon-bin"
                      type="subtle"
                      kitmanDesignSystem
                    />
                  </div>
                </div>
              )}

              <div
                css={[style.provider, style.gridRow5]}
                data-testid="AddProcedureSidePanel|Provider"
              >
                <Select
                  label={props.t('Provider')}
                  onChange={(providerSgid) => {
                    dispatch({
                      type: 'SET_PROVIDER_SGID',
                      index,
                      providerSgid,
                      isMulti: isMultiFaveSelect && !isEditing,
                    });
                    dispatch({
                      type: 'SET_OTHER_PROVIDER',
                      index,
                      otherProvider: '',
                    });
                  }}
                  value={formState.queuedProcedures[index].providerSgid}
                  options={
                    [
                      {
                        value: 1,
                        label: 'Internal providers',
                        options:
                          props.orderProviders?.staff_providers?.map(
                            ({ sgid, fullname }) => ({
                              value: sgid,
                              label: fullname,
                            })
                          ) || [],
                      },
                      {
                        value: 2,
                        label: 'External providers',
                        options:
                          getExternalProviderOptions(props.orderProviders) ||
                          [],
                      },
                    ] || []
                  }
                  isGrouped
                  isDisabled={
                    requestStatus === 'PENDING' || !formState.locationId
                  }
                  invalid={
                    isValidationCheckAllowed &&
                    !formState.queuedProcedures[index].providerSgid
                  }
                />
              </div>

              {isProviderOther(
                formState.queuedProcedures[index].providerSgid
              ) && (
                <div
                  css={[style.gridRow5]}
                  data-testid="AddProcedureSidePanel|OtherProvider"
                >
                  <InputTextField
                    label={props.t('Other External Provider')}
                    value={
                      formState.queuedProcedures[index].otherProvider || ''
                    }
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_OTHER_PROVIDER',
                        index,
                        otherProvider: e.target.value,
                      })
                    }
                    inputType="text"
                    disabled={!formState.locationId}
                    invalid={
                      isValidationCheckAllowed &&
                      !formState.queuedProcedures[index].otherProvider
                    }
                    kitmanDesignSystem
                  />
                </div>
              )}

              {showPlayerMovementDatePicker() ? (
                <>
                  {renderProcedureOrderDatePickerNew(index)}
                  {renderProcedureAppointmentDatePickerNew(index)}
                </>
              ) : (
                <div css={[style.procedureDates, style.gridRow6]}>
                  {renderProcedureOrderDatePicker(index)}
                  {renderProcedureAppointmentDatePicker(index)}
                </div>
              )}

              <div
                css={[style.procedure, style.gridRow7, style.span3]}
                data-testid="AddProcedureSidePanel|Procedure"
              >
                <ProcedureTypeSelect
                  label={props.t('Procedure type')}
                  formState={formState}
                  procedureIndex={index}
                  isMulti={isMultiFaveSelect && !isEditing}
                  value={getProcedureSelectOption(index)}
                  placeholder={props.t('Search procedure types ...')}
                  onTypeChange={(procedureType) => {
                    if (!isMultiFaveSelect || isEditing) {
                      dispatch({
                        type: 'SET_PROCEDURE_TYPE',
                        index,
                        procedureType,
                      });
                    }
                    if (isMultiFaveSelect && !isEditing) {
                      dispatch(
                        // $FlowFixMe
                        {
                          type: 'SET_MULTI_PROCEDURE_TYPES',
                          index,
                          procedureTypes: procedureType,
                        }
                      );
                    }
                    if (!isMultiFaveSelect || isEditing) {
                      getProcedureReasons(procedureType);
                      getProcedureComplications(procedureType);
                    }
                    if (
                      procedureType.default_procedure_reason_id &&
                      !isMultiFaveSelect
                    ) {
                      setFormProcedureReason(
                        procedureType.default_procedure_reason_id,
                        index
                      );
                    }
                    if (
                      !procedureType.default_procedure_reason_id &&
                      !isMultiFaveSelect
                    ) {
                      setFormProcedureReason(null, index);
                    }
                    if (!isProcedureIntravenous(procedureType)) {
                      dispatch({
                        type: 'CLEAR_PROCEDURE_IV_FIELDS',
                        index,
                      });
                    }
                  }}
                  invalid={
                    (isValidationCheckAllowed &&
                      !formState.queuedProcedures[index].procedureType) ||
                    (isValidationCheckAllowed &&
                      !formState.queuedProcedures[index].procedureTypes
                        .length &&
                      isMultiFaveSelect &&
                      !isEditing) ||
                    (isValidationCheckAllowed &&
                      isEditing &&
                      !formState.queuedProcedures[index].procedureType)
                  }
                />
                {shouldShowCopyright && (
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="secondary.dark"
                    sx={{
                      lineHeight: 2,
                      fontSize: '12px',
                      fontStyle: 'italic',
                    }}
                  >
                    {props.t(
                      'CPT copyright 2023 American Medical Association. All rights reserved.'
                    )}
                  </Typography>
                )}
              </div>

              <div
                css={[style.procedureDescription, style.gridRow8, style.span3]}
                data-testid="AddProcedureSidePanel|ProcedureDescription"
              >
                <InputTextField
                  label={props.t('Procedure description')}
                  value={formState.queuedProcedures[index].procedureDescription}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_PROCEDURE_DESCRIPTION',
                      index,
                      procedureDescription: e.target.value,
                    })
                  }
                  inputType="text"
                  disabled={
                    !formState.locationId ||
                    !formState.queuedProcedures[index].providerSgid
                  }
                  optional
                  kitmanDesignSystem
                />
              </div>

              <div
                css={[style.procedureReason, style.gridRow9]}
                data-testid="AddProcedureSidePanel|ProcedureReason"
              >
                <Select
                  label={props.t('Reason')}
                  onChange={(procedureReason) =>
                    setFormProcedureReason(procedureReason, index)
                  }
                  value={formState.queuedProcedures[index].procedureReason}
                  options={
                    isMultiFaveSelect && !isEditing
                      ? formState.queuedProcedures[index].procedureReasons
                      : procedureReasons || []
                  }
                  invalid={
                    isValidationCheckAllowed &&
                    !formState.queuedProcedures[index].procedureReason
                  }
                  isDisabled={getReasonDisabledStatus(index)}
                />
              </div>

              {isProcedureReasonOther(
                formState.queuedProcedures[index].procedureReason
              ) && (
                <div
                  css={[style.procedureReasonOther, style.gridRow9]}
                  data-testid="AddProcedureSidePanel|ProcedureReasonOther"
                >
                  <InputTextField
                    label={props.t('Other reason')}
                    value={
                      formState.queuedProcedures[index].procedureReasonOther ||
                      ''
                    }
                    onChange={(e) => {
                      dispatch({
                        type: 'SET_PROCEDURE_REASON_OTHER',
                        index,
                        procedureReasonOther: e.target.value,
                      });
                    }}
                    inputType="text"
                    invalid={
                      isValidationCheckAllowed &&
                      isProcedureReasonOther(
                        formState.queuedProcedures[index].procedureReason
                      ) &&
                      !formState.queuedProcedures[index].procedureReasonOther
                    }
                    kitmanDesignSystem
                  />
                </div>
              )}

              <div
                css={[style.associatedIssues, style.gridRow10]}
                data-testid="AddProcedureSidePanel|AssociatedIssues"
              >
                <Select
                  label={props.t('Linked injury / illness')}
                  onChange={(ids) => {
                    const injuryIds = getIssueIds('Injury', ids);
                    const illnessIds = getIssueIds('Illness', ids);
                    const chronicIssueIds = getIssueIds('ChronicInjury', ids);

                    dispatch({ type: 'SET_INJURY_IDS', index, injuryIds });
                    dispatch({ type: 'SET_ILLNESS_IDS', index, illnessIds });
                    dispatch({
                      type: 'SET_CHRONIC_IDS',
                      index,
                      chronicIssueIds,
                    });
                  }}
                  value={getAssociatedInjuryIllnessValues(index)}
                  options={enrichedAthleteIssues || []}
                  isMulti
                  invalid={
                    isValidationCheckAllowed &&
                    isAssociatedIssueRequired?.includes(
                      formState.queuedProcedures[index].procedureReason
                    ) &&
                    !(
                      formState.queuedProcedures[index].illnessIds.length ||
                      formState.queuedProcedures[index].injuryIds.length ||
                      formState.queuedProcedures[index].chronicIssueIds.length
                    )
                  }
                  optional={
                    !isAssociatedIssueRequired?.includes(
                      formState.queuedProcedures[index].procedureReason
                    )
                  }
                  isDisabled={
                    requestStatus === 'PENDING' ||
                    props.initialDataRequestStatus === 'FAILURE' ||
                    !formState.athleteId ||
                    !formState.queuedProcedures[index].procedureReason
                  }
                />
              </div>

              <div
                css={[style.bodyArea, style.gridRow11]}
                data-testid="AddProcedureSidePanel|BodyArea"
              >
                <Select
                  label={props.t('Body area')}
                  onChange={(bodyAreaId) => {
                    dispatch({
                      type: 'SET_BODY_AREA_ID',
                      index,
                      bodyAreaId,
                    });
                  }}
                  value={formState.queuedProcedures[index].bodyAreaId}
                  options={
                    props.bodyAreas.map(({ id, name }) => ({
                      value: id,
                      label: name,
                    })) || []
                  }
                  isDisabled={
                    requestStatus === 'PENDING' ||
                    !formState.queuedProcedures[index].procedureType
                  }
                  appendToBody
                  optional
                />
              </div>

              {formState.queuedProcedures[index]?.procedureType &&
                isProcedureIntravenous(
                  formState.queuedProcedures[index].procedureType
                ) && (
                  <>
                    <div
                      css={[style.timing, style.gridRow13]}
                      data-testid="AddProcedureSidePanel|Timing"
                    >
                      <Select
                        label={props.t('Timing')}
                        onChange={(procedureTiming) => {
                          dispatch({
                            type: 'SET_PROCEDURE_TIMING_OTHER',
                            index,
                            procedureTimingOther: '',
                          });

                          dispatch({
                            type: 'SET_PROCEDURE_TIMING',
                            index,
                            procedureTiming,
                          });
                        }}
                        value={
                          formState.queuedProcedures[index].procedureTiming
                        }
                        options={
                          props.proceduresFormData?.procedure_timings?.map(
                            ({ key, name }) => ({
                              value: key,
                              label: name,
                            })
                          ) || []
                        }
                        invalid={
                          isValidationCheckAllowed &&
                          formState.queuedProcedures[index].procedureType &&
                          isProcedureIntravenous(
                            formState.queuedProcedures[index].procedureType
                          ) &&
                          !formState.queuedProcedures[index].procedureTiming
                        }
                      />
                      {isTimingOther(
                        formState.queuedProcedures[index].procedureTiming
                      ) && (
                        <div
                          css={style.span2}
                          data-testid="AddProcedureSidePanel|TimingOther"
                        >
                          <InputTextField
                            label={props.t('Other timing')}
                            value={
                              formState.queuedProcedures[index]
                                .procedureTimingOther || ''
                            }
                            onChange={(e) => {
                              dispatch({
                                type: 'SET_PROCEDURE_TIMING_OTHER',
                                index,
                                procedureTimingOther: e.target.value,
                              });
                            }}
                            inputType="text"
                            disabled={false}
                            invalid={
                              isValidationCheckAllowed &&
                              isTimingOther &&
                              !formState.queuedProcedures[index]
                                .procedureTimingOther
                            }
                            optional
                            kitmanDesignSystem
                          />
                        </div>
                      )}
                      <div css={[style.timingRow2, style.gridRow14]}>
                        <TimePicker
                          name="start_time"
                          value={
                            formState.queuedProcedures[index].procedureStartTime
                              ? moment(
                                  formState.queuedProcedures[index]
                                    .procedureStartTime
                                )
                              : moment()
                          }
                          label={props.t('Start Time')}
                          onChange={(procedureStartTime) => {
                            dispatch({
                              type: 'SET_PROCEDURE_START_TIME',
                              index,
                              procedureStartTime:
                                moment(procedureStartTime).format(),
                            });
                          }}
                          kitmanDesignSystem
                        />

                        <InputNumeric
                          label={props.t('Duration')}
                          name="procedure-duration"
                          value={
                            formState.queuedProcedures[index].procedureDuration
                          }
                          onChange={(e) => {
                            dispatch({
                              type: 'SET_PROCEDURE_DURATION',
                              index,
                              procedureDuration: parseFloat(e),
                            });
                          }}
                          t={props.t}
                          kitmanDesignSystem
                          optional
                        />
                      </div>

                      <div css={[style.timingRow3, style.gridRow15]}>
                        <InputNumeric
                          label={props.t('Total Amount (ml)')}
                          value={
                            formState.queuedProcedures[index].procedureAmount
                          }
                          onChange={(e) => {
                            dispatch({
                              type: 'SET_PROCEDURE_IV_AMOUNT',
                              index,
                              procedureAmount: parseFloat(e),
                            });
                          }}
                          t={props.t}
                          kitmanDesignSystem
                          optional
                        />

                        <InputNumeric
                          label={props.t('Amount used (ml)')}
                          value={
                            formState.queuedProcedures[index]
                              .procedureAmountUsed
                          }
                          onChange={(e) => {
                            dispatch({
                              type: 'SET_PROCEDURE_IV_AMOUNT_USED',
                              index,
                              procedureAmountUsed: parseFloat(e),
                            });
                          }}
                          t={props.t}
                          kitmanDesignSystem
                          optional
                        />

                        <InputNumeric
                          label={props.t('Pre IV Urine specific gravity')}
                          value={
                            formState.queuedProcedures[index]
                              .procedureUrineGravity
                          }
                          onChange={(e) => {
                            dispatch({
                              type: 'SET_PROCEDURE_IV_URINE_GRAVITY',
                              index,
                              procedureUrineGravity: parseFloat(e),
                            });
                          }}
                          t={props.t}
                          kitmanDesignSystem
                          optional
                        />
                      </div>
                    </div>
                  </>
                )}

              <hr
                css={[
                  style.hr,
                  style.span3,
                  style.gridRow15,
                  style.marginTopNone,
                ]}
              />

              <div
                css={[style.complications, style.gridRow16, style.span3]}
                data-testid="AddProcedureSidePanel|Complications"
              >
                <div css={[style.complicationAddButton]}>
                  {!showComplications ? (
                    <TextButton
                      onClick={() => setShowComplications(true)}
                      text={props.t('Add complications')}
                      type="secondary"
                      isDisabled={
                        !formState.queuedProcedures[index].procedureType
                      }
                      kitmanDesignSystem
                    />
                  ) : (
                    <Select
                      label={props.t('Complications')}
                      onChange={(procedureComplicationIds) => {
                        dispatch({
                          type: 'SET_PROCEDURE_COMPLICATION_IDS',
                          index,
                          procedureComplicationIds,
                        });
                      }}
                      value={
                        formState.queuedProcedures[index]
                          .procedureComplicationIds
                      }
                      options={
                        isMultiFaveSelect && !isEditing
                          ? formState.queuedProcedures[index]
                              .procedureComplications
                          : procedureComplications || []
                      }
                      isDisabled={
                        !formState.queuedProcedures[index].procedureType
                      }
                      // invalid={isValidationCheckAllowed}
                      isMulti
                    />
                  )}
                </div>

                {isComplicationOther(
                  formState.queuedProcedures[index].procedureComplicationIds
                ) && (
                  <div>
                    <InputTextField
                      label={props.t('Other Complication')}
                      value={
                        formState.queuedProcedures[index]
                          .procedureComplicationOther || ''
                      }
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_PROCEDURE_COMPLICATION_OTHER',
                          index,
                          procedureComplicationOther: e.target.value,
                        })
                      }
                      inputType="text"
                      invalid={
                        isValidationCheckAllowed &&
                        formState.queuedProcedures[
                          index
                        ].procedureComplicationIds?.includes(-1) &&
                        !formState.queuedProcedures[index]
                          .procedureComplicationOther.length
                      }
                      disabled={false}
                      optional
                      kitmanDesignSystem
                    />
                  </div>
                )}
                {showComplications && (
                  <>
                    <div css={[style.complicationClearButton]}>
                      <TextButton
                        onClick={() => {
                          setShowComplications(false);
                          dispatch({
                            type: 'SET_PROCEDURE_COMPLICATION_IDS',
                            index,
                            procedureComplicationIds: [],
                          });
                          dispatch({
                            type: 'SET_PROCEDURE_COMPLICATION_OTHER',
                            index,
                            procedureComplicationOther: '',
                          });
                        }}
                        iconBefore="icon-bin"
                        type="subtle"
                        kitmanDesignSystem
                      />
                    </div>
                  </>
                )}
              </div>
              {!isEditing && (
                <>
                  <div
                    css={[style.gridRow18, style.span3]}
                    data-testid="AddProcedureSidePanel|NoteInput"
                  >
                    <div css={style.note}>
                      <RichTextEditor
                        label={props.t('Note')}
                        value={
                          formState.queuedProcedures[index].noteContent || ''
                        }
                        forwardedRef={(el) => {
                          editorRefs.current[index] = el;
                        }}
                        onChange={(noteContent) =>
                          dispatch({
                            type: 'SET_NOTE_CONTENT',
                            index,
                            noteContent,
                          })
                        }
                        disabled={requestStatus === 'PENDING'}
                        optionalText="Optional"
                        kitmanDesignSystem
                        t={props.t}
                      />
                    </div>
                  </div>
                  <hr css={[style.hr, style.span3, style.gridRow17]} />
                  <div
                    css={[style.gridRow19, style.span3]}
                    data-testid="AddProcedureSidePanel|Attachments"
                  >
                    {formState.queuedProcedures[
                      index
                    ].queuedAttachmentTypes?.includes('FILE') && (
                      <div css={[style.fileAttachmentContainer]}>
                        <FileUploadArea
                          areaTitle={props.t('Attach file(s)')}
                          actionIcon="icon-bin"
                          showActionButton
                          testIdPrefix="AddProcedureSidePanel"
                          isFileError={false}
                          onClickActionButton={() => {
                            dispatch({
                              type: 'REMOVE_ATTACHMENT_TYPE',
                              index,
                              queuedAttachmentType: 'FILE',
                            });
                            dispatch({
                              type: 'UPDATE_QUEUED_ATTACHMENTS',
                              index,
                              queuedAttachments: [],
                            });
                          }}
                          removeFiles={props.isOpen}
                          updateFiles={(queuedAttachments) => {
                            dispatch({
                              type: 'UPDATE_QUEUED_ATTACHMENTS',
                              index,
                              queuedAttachments,
                            });
                          }}
                          attachedFiles={
                            formState.queuedProcedures[index].queuedAttachments
                          }
                        />
                        <hr css={style.hr} />
                      </div>
                    )}

                    {formState.queuedProcedures[
                      index
                    ].queuedAttachmentTypes?.includes('LINK') && (
                      <Links
                        formState={formState}
                        procedureIndex={index}
                        isLinkValidationCheckAllowed={
                          isLinkValidationCheckAllowed
                        }
                        onClearQueuedLinks={() => {
                          dispatch({
                            type: 'REMOVE_ATTACHMENT_TYPE',
                            index,
                            queuedAttachmentType: 'LINK',
                          });

                          dispatch({
                            type: 'CLEAR_QUEUED_LINKS',
                            index,
                          });

                          setIsLinkValidationCheckAllowed((prev) => {
                            const copyPrevState = prev.slice();
                            copyPrevState[index] = false;
                            return copyPrevState;
                          });
                        }}
                        onSetLinkTitle={(title) => {
                          dispatch({
                            type: 'SET_LINK_TITLE',
                            index,
                            linkTitle: title,
                          });
                        }}
                        onSetLinkUri={(uri) => {
                          dispatch({
                            type: 'SET_LINK_URI',
                            index,
                            linkUri: uri,
                          });
                        }}
                        onSaveLink={(linkToAdd) => onSaveLink(linkToAdd)}
                        onRemoveLink={(linkId) => {
                          dispatch({
                            type: 'REMOVE_QUEUED_LINK',
                            index,
                            id: linkId,
                          });
                        }}
                        setIsLinkValidationCheckAllowed={(pindex) => {
                          setIsLinkValidationCheckAllowed((prev) => {
                            const copyPrevState = prev.slice();
                            copyPrevState[pindex] = false;
                            return copyPrevState;
                          });
                        }}
                      />
                    )}

                    <TooltipMenu
                      tooltipTriggerElement={
                        <TextButton
                          text={props.t('Attach')}
                          type="secondary"
                          iconAfter="icon-chevron-down"
                          kitmanDesignSystem
                        />
                      }
                      menuItems={[
                        {
                          description: props.t('File'),
                          onClick: () => {
                            dispatch({
                              type: 'UPDATE_ATTACHMENT_TYPE',
                              index,
                              queuedAttachmentType: 'FILE',
                            });
                          },
                        },
                        {
                          description: props.t('Link'),
                          onClick: () => {
                            dispatch({
                              type: 'UPDATE_ATTACHMENT_TYPE',
                              index,
                              queuedAttachmentType: 'LINK',
                            });
                          },
                        },
                      ]}
                      placement="bottom-start"
                      appendToParent
                      kitmanDesignSystem
                    />
                  </div>
                </>
              )}
            </div>
          ))}
          <div css={[style.gridRow21, style.addAnotherProcedureButton]}>
            <TextButton
              data-testid="AddProcedureSidePanel|AddAnotherProcedure"
              text={props.t('Add another procedure')}
              type="secondary"
              onClick={onAddAnotherProcedure}
              isDisabled={!formState.locationId || !formState.athleteId}
              kitmanDesignSystem
            />
          </div>
        </div>

        <div css={style.actions} data-testid="AddProcedureSidePanel|Actions">
          <TextButton
            onClick={onSave}
            text={props.procedureToUpdate ? props.t('Update') : props.t('Save')}
            type="primary"
            isLoading={saveRequestStatus === 'PENDING'}
            kitmanDesignSystem
          />
        </div>
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddProcedureSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddProcedureSidePanel);
export default AddProcedureSidePanel;
