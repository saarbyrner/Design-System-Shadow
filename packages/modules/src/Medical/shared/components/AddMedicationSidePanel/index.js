// @flow
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import {
  imageFileTypes,
  pdfFileType,
} from '@kitman/common/src/utils/mediaHelper';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { colors } from '@kitman/common/src/variables';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import {
  AppStatus,
  Checkbox,
  InputTextField,
  Select,
  SlidingPanelResponsive,
  TextButton,
  DatePicker,
  RichTextEditor,
  SegmentedControl,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import ConfirmationModal, {
  modalDescriptionId,
} from '@kitman/playbook/components/ConfirmationModal';
import {
  FilesDock,
  FileUploads,
  DialogContentText,
} from '@kitman/playbook/components';
import {
  createCustomDrug,
  dispenseMedication,
  updateMedication,
  screenAllergyToDrug,
  screenDrugToDrug,
} from '@kitman/services';
import { getMedicationFavorites } from '@kitman/services/src/services/medical';
import { UnlistedMedicationInputTranslated as UnlistedMedicationInput } from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/UnlistedMedicationInput';
// TODO: revisit translation
import MedicationTUE from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/MedicationTUE';

import { MedicationTUEAlertTranslated as MedicationTUEAlert } from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/MedicationTUEAlert';
import LoggedMedicationSelect, {
  customDrugPrefix,
} from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/LoggedMedicationSelect';
import useAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useAthletesIssues';
import style from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/styles';
import useMedicationForm from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/hooks/useMedicationForm';
import {
  getIssueIds,
  getFormattedIssueIds,
  getEditorStateFromValue,
} from '@kitman/modules/src/Medical/shared/utils';
import { useIssue } from '@kitman/modules/src/Medical/shared/contexts/IssueContext';
import {
  getDirectionDropdownOptions,
  getRouteDropdownOptions,
} from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/dropdownOptions';
import { AllergyAlertSectionTranslated as AllergyAlertSection } from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/FormComponents/AllergyAlertSection';
import AthleteConstraints from '@kitman/modules/src/Medical/shared/components/AthleteConstraints';
import { ScreenAllergyToDrugModalTranslated as ScreenAllergyToDrugModal } from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/ScreenDrugsModal';
import useCurrentUser from '@kitman/modules/src/Medical/shared/hooks/useGetCurrentUser';
import {
  lotDispensedExceedsLotQuantity,
  isNumberInvalid,
} from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/InputError/utils';
import InputError from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/InputError';
import { AutofillFromFavSelectTranslated as AutofillFromFavSelect } from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/AutofillFromFavSelect';
import LotSection from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/FormComponents/LotSection';
import DispensedMedicationSelect from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/DispensedMedicationSelect';
import ChoiceEntryQuestion from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/ChoiceEntryQuestion';
import { drugTypesEnum } from '@kitman/modules/src/Medical/shared/types/medical/Medications';
import { UnlistedMedWarningDialogTranslated as UnlistedMedWarningDialog } from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/UnlistedMedWarningDialog';
import { isScannerIntegrationAllowed } from '@kitman/components/src/DocumentScanner/utils';
import useManageFilesForUpload from '@kitman/common/src/hooks/useManageFilesForUpload';
import useManageUploads from '@kitman/common/src/hooks/useManageUploads';

// Types
import type { MedicationTUERefType } from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/MedicationTUE';
import type { ToastLink } from '@kitman/components/src/Toast/types';
import type { ComponentType } from 'react';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type {
  SelectOption as Option,
  Options,
} from '@kitman/components/src/types';
import type { RequestStatus } from '@kitman/common/src/types';
import type {
  StockMedicationData,
  ScreenAllergyToDrugDataResponse,
  ScreenDrugToDrugDataResponse,
  MedicationListSources,
  DrugType,
  DrFirstMedicationsDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';
import type { OrganisationStatus } from '@kitman/modules/src/Medical/shared/types/medical/Constraints';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  FetchedLot,
  Medication,
  FormAction,
} from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/hooks/useMedicationForm';
import type { CustomDrugData } from '@kitman/modules/src/Medical/shared/types/medical/Medications';
import type {
  FileUploadsFile,
  FileValidation,
  FilePondError,
} from '@kitman/playbook/components/FileUploads';
import type { AttachedMedicalFile } from '@kitman/common/src/utils/fileHelper';

type Props = {
  athleteConstraints?: { organisationStatus: OrganisationStatus },
  isOpen: boolean,
  isAthleteSelectable: boolean,
  medicationProviders: {
    staffProviders: Array<Options>,
    locationProviders: Array<Options>,
    otherProviders: Array<Options>,
  },
  defaultAttachmentCategoryIds: Array<number>,
  medicationListSources: ?MedicationListSources,
  initialDataRequestStatus: RequestStatus,
  squadAthletes: Array<Option>,
  stockMedications: Array<Medication>,
  athleteData: AthleteData,
  athleteId?: ?number,
  onClose: () => void,
  onSaveMedicationStart: (drugId: number) => void,
  onSaveMedicationSuccess: (drugId: number, links: ?Array<ToastLink>) => void,
  resetDrFirstMedications: () => void,
  isEditing: boolean,
  selectedMedication: DrFirstMedicationsDataResponse,
  clearSelectedMedication: () => void,
  actionType: 'Dispense' | 'Log',
  setActionType: (actionType: 'Dispense' | 'Log') => void,
  onDeleteMedicationConfigStart: (drugId: number) => void,
  onDeleteMedicationConfigSuccess: (drugId: number) => void,
  onDeleteMedicationConfigFailure: (drugId: number) => void,
};

const DATA_ATTRIBUTE_PREFIX = 'AddMedicationSidePanel';

const AddMedicationSidePanel = ({ t, ...props }: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [lots, setLots] = useState<Array<FetchedLot>>([]);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);
  const [screenAllergyErrors, setScreenAllergyErrors] =
    useState<ScreenAllergyToDrugDataResponse>([]);
  const [screenDrugErrors, setScreenDrugErrors] =
    useState<ScreenDrugToDrugDataResponse>([]);
  const [isScreenAllergyToDrugModalOpen, setIsScreenAllergyToDrugModalOpen] =
    useState(false);
  const [unlistedMedWarningDialogOpen, setUnlistedMedWarningDialogOpen] =
    useState(false);
  const [attachmentsValidationErrors, setAttachmentsValidationErrors] =
    useState<Array<FileValidation>>([]);
  const [isPerformingDrugScreening, setIsPerformingDrugScreening] =
    useState(false);
  const [uploadingFilesStatus, setUploadingFilesStatus] =
    useState<RequestStatus>(null);
  const [medConfigFavorites, setMedConfigFavorites] = useState([]);
  const [selectedMedConfig, setSelectedMedConfig] = useState();
  const [showOptionalText, setShowOptionalText] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [hasNonUploadedFiles, setHasNonUploadedFiles] = useState(false);
  const [readyForClose, setReadyForClose] = useState(false);
  const { permissions } = usePermissions();
  const { currentUser, fetchCurrentUser } = useCurrentUser();
  const { issue, issueType, isChronicIssue } = useIssue();
  const { athleteIssues, fetchAthleteIssues } = useAthletesIssues(
    props.isOpen ? props.athleteId : null
  );
  const { formState, dispatch } = useMedicationForm();

  const editorRef = useRef(null);
  const filePondRef = useRef(null);
  const filesDockRef = useRef(null);
  const validationErrorsAreaRef = useRef(null);
  const medicationTUERef = useRef<MedicationTUERefType>(null);

  const {
    filesToUpload,
    getFilesToUploadDescriptors,
    updateFileStatus,
    clearAndResetManagedFiles,
    handleAddFile,
    handleRemoveFile,
  } = useManageFilesForUpload({ filePondRef, filesDockRef });
  const { uploadAndConfirmAttachments } = useManageUploads();

  const isLoadingDataOrSubmitting =
    isPerformingDrugScreening ||
    requestStatus === 'PENDING' ||
    uploadingFilesStatus === 'PENDING';

  const cleanUpAndClose = (confirmFilesNotUploaded: boolean = true) => {
    setReadyForClose(false);
    if (confirmFilesNotUploaded) {
      const uploadsNotDone =
        uploadingFilesStatus !== 'SUCCESS' && uploadingFilesStatus !== null;

      const filesPending = filesToUpload.some((managedFile) => {
        return managedFile.status === 'pending';
      });
      const needToConfirm = uploadsNotDone || filesPending;
      if (needToConfirm) {
        setHasNonUploadedFiles(needToConfirm);
        setIsConfirmationModalOpen(needToConfirm);
        return;
      }
    }

    if (!isLoadingDataOrSubmitting) {
      props.resetDrFirstMedications();
      props.clearSelectedMedication();

      setHasNonUploadedFiles(false);
      setIsValidationCheckAllowed(false);
      setShowOptionalText(false);

      setScreenAllergyErrors([]);
      setScreenDrugErrors([]);
      setAttachmentsValidationErrors([]);
      setMedConfigFavorites([]);

      setRequestStatus(null);
      setUploadingFilesStatus(null);
      setSelectedMedConfig(null);

      clearAndResetManagedFiles();
      props.onClose();
    }
  };

  useEffect(() => {
    if (readyForClose) {
      cleanUpAndClose();
    }
  }, [readyForClose]);

  const isPastAthlete = !!props.athleteData?.org_last_transfer_record?.left_at;
  const canAddTue =
    window.getFlag('pm-show-tue') &&
    window.getFlag('pm-mls-emr-demo-tue') &&
    permissions.medical?.tue.canCreate &&
    formState.athlete_id &&
    !isPastAthlete;

  const { staffProviders, locationProviders, otherProviders } =
    props.medicationProviders;

  const showPlayerMovementDatePicker =
    window.featureFlags['player-movement-aware-datepicker'];

  const allowAttachments =
    window.featureFlags['medical-medication-attachments'];

  const sortedMedicationProviders =
    (staffProviders &&
      locationProviders &&
      otherProviders && [
        ...staffProviders,
        ...locationProviders,
        ...otherProviders,
      ]) ||
    [];

  const isGeneralAvailabilityOn =
    window.featureFlags['medications-general-availability'];

  const primaryMedicationSourceList = props.medicationListSources?.primary;

  const handleError = (error: FilePondError, file?: ?FileUploadsFile) => {
    const fileValidation: FileValidation = {
      fileId: file?.id,
      fileName: file?.filename,
      issue: `${error.main}.${error.sub ? ` ${error.sub}` : ''}`,
      severity: 'error',
    };

    setAttachmentsValidationErrors((prev) => [
      ...prev.filter((priorError) => !isEqual(priorError, fileValidation)),
      fileValidation,
    ]);
    validationErrorsAreaRef?.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const warnOfUploadFailures = (failureCount: number) => {
    const error: FileValidation = {
      issue:
        failureCount === 1
          ? t('Failed to upload file')
          : t('Failed to upload {{count}} files', { count: failureCount }),
      severity: 'error',
    };
    setAttachmentsValidationErrors([error]);
    validationErrorsAreaRef?.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const onAthleteChange = async (athleteId: number) => {
    dispatch({ type: 'SET_ATHLETE_ID', athleteId });
    setRequestStatus('PENDING');
    try {
      await fetchAthleteIssues(athleteId);
      setRequestStatus('SUCCESS');
    } catch {
      setRequestStatus('FAILURE');
    }
  };

  const getDrugId = (): number => {
    let drugId = formState.medication.value || -1;
    if (drugId && typeof drugId === 'string') {
      if (
        drugId &&
        formState.medication.drug_type === drugTypesEnum.CustomDrug
      ) {
        drugId = drugId.slice(customDrugPrefix.length);
      }
      return parseInt(drugId, 10);
    }

    return drugId;
  };

  const getDrugType = (): 'FdbDispensableDrug' | DrugType => {
    if (isGeneralAvailabilityOn) {
      if (formState.medication?.drug_type) {
        return formState.medication.drug_type;
      }
      if (props.selectedMedication?.drug_type) {
        return props.selectedMedication.drug_type;
      }

      if (primaryMedicationSourceList?.name) {
        // eslint-disable-next-line default-case
        switch (primaryMedicationSourceList?.name) {
          case 'fdb_dispensable_drugs': {
            return 'Emr::Private::Models::FdbDispensableDrug';
          }
          case 'nhs_dmd_drugs': {
            return 'Emr::Private::Models::NhsDmdDrug';
          }
        }
      }
    }

    return 'FdbDispensableDrug';
  };

  const saveUnlistedMedication = () => {
    const unlistedMed = formState.unlistedMed;
    const data: CustomDrugData = {
      brand_name: unlistedMed.brand_name,
      country: unlistedMed.country,
      drug_form: unlistedMed.drug_form,
      med_strength: unlistedMed.med_strength,
      med_strength_unit:
        unlistedMed.med_strength_unit === 'other' &&
        unlistedMed.med_strength_other_unit
          ? unlistedMed.med_strength_other_unit
          : unlistedMed.med_strength_unit,
      name: unlistedMed.name,
    };
    return createCustomDrug(data);
  };

  const getLinks = (): Array<ToastLink> => {
    const baseLink = `/medical/athletes/${
      formState.athlete_id || props.athleteData.id
    }`;
    let linkId = 0;
    const illnessLinks =
      formState.illness_occurrence_ids?.map((id) => {
        linkId += 1;
        return {
          id: linkId,
          link: `${baseLink}/illnesses/${id}#medications`,
          text: t('Illness'),
          withHashParam: true,
        };
      }) || [];

    const injuryLinks =
      formState.injury_occurrence_ids?.map((id) => {
        linkId += 1;
        return {
          id: linkId,
          link: `${baseLink}/injuries/${id}#medications`,
          text: t('Injury'),
          withHashParam: true,
        };
      }) || [];

    const chronicLinks =
      formState.chronic_issue_ids?.map((id) => {
        linkId += 1;
        return {
          id: linkId,
          link: `${baseLink}/chronic_issues/${id}#medications`,
          text: t('Chronic Issue'),
          withHashParam: true,
        };
      }) || [];
    return [...illnessLinks, ...injuryLinks, ...chronicLinks];
  };

  const dispenseOnSave = async () => {
    setRequestStatus('PENDING');
    let drugId;
    let drugType;
    if (formState.unlistedMedOpen) {
      try {
        const createCustomDrugResponse = await saveUnlistedMedication();
        drugId = createCustomDrugResponse.drug.id;
        drugType = drugTypesEnum.CustomDrug;
        setRequestStatus('SUCCESS');
      } catch {
        setRequestStatus('FAILURE');
        return;
      }
    } else {
      drugId = getDrugId();
      drugType = getDrugType();
    }

    props.onSaveMedicationStart(drugId);

    const formatIds = (array, type) => {
      return array.map((injuryIllness) => ({
        type,
        id: injuryIllness,
      }));
    };

    const dispenseData: StockMedicationData = {
      athlete_id: formState.athlete_id,
      prescriber_sgid: formState.prescriber?.id,
      external_prescriber_name: formState.external_prescriber_name,
      prescription_date: formState.prescription_date,
      stock_lots: props.actionType === 'Dispense' ? formState.stock_lots : [],
      directions: formState.directions,
      tapered: formState.tapered,
      dose: formState.tapered ? null : Number(formState.dose).toString(),
      quantity:
        formState.quantity != null && formState.quantity.trim() !== ''
          ? Number(formState.quantity).toString()
          : null,
      frequency: formState.tapered
        ? null
        : Number(formState.frequency).toString(),
      route: formState.route,
      start_date: formState.start_date,
      end_date: formState.end_date,
      duration: formState.duration,
      note: formState.note,
      lot_number: formState.optional_lot_number,
      issues: [
        ...formatIds(formState.illness_occurrence_ids, 'IllnessOccurrence'),
        ...formatIds(formState.injury_occurrence_ids, 'InjuryOccurrence'),
        ...formatIds(formState.chronic_issue_ids, 'ChronicIssue'),
      ],
      type: props.actionType === 'Log' ? 'InternallyLogged' : 'InternalStock',
      drug_type: drugType,
      attachments: getFilesToUploadDescriptors(),
    };

    let response;
    if (props.selectedMedication) {
      try {
        response = await updateMedication(
          props.selectedMedication.id,
          dispenseData
        );
        setRequestStatus('SUCCESS');
        props.onSaveMedicationSuccess(getDrugId(), getLinks());
      } catch {
        setRequestStatus('FAILURE');
        return;
      }
    } else {
      let data = { ...dispenseData };

      if (props.actionType === 'Log') {
        data = {
          ...data,
          drug_id: drugId,
          lot_number: formState.optional_lot_number,
        };
      } else {
        data = {
          ...data,
          drug_id: drugId,
        };
      }

      try {
        response = await dispenseMedication(data);
        props.onSaveMedicationSuccess(drugId, getLinks());
        setRequestStatus('SUCCESS');
      } catch {
        setRequestStatus('FAILURE');
        return;
      }
    }

    if (canAddTue && formState.medicationTUEOpen && medicationTUERef?.current) {
      // Run validation
      if (medicationTUERef.current.checkTUEValidation()) {
        try {
          await medicationTUERef.current?.saveTUE();
          // TODO: later introduce toast for TUE saved
        } catch {
          setRequestStatus('FAILURE');
          return;
        }
      }
    }

    if (allowAttachments && response?.attachments?.length) {
      setUploadingFilesStatus('PENDING');

      // Note: no try catch here as errors captured within uploadAndConfirmAttachments
      const results = await uploadAndConfirmAttachments(
        response.attachments,
        // $FlowIgnore[incompatible-call]
        filesToUpload.map((managedFile) => managedFile.file),
        updateFileStatus
      );
      const rejectedCount = results.reduce((acc, result) => {
        if (result.status !== 'fulfilled') {
          return acc + 1;
        }
        return acc;
      }, 0);

      setUploadingFilesStatus(rejectedCount > 0 ? 'FAILURE' : 'SUCCESS');
      if (rejectedCount > 0) {
        warnOfUploadFailures(rejectedCount);
        return;
      }
    }
    setReadyForClose(true);
  };

  const onSaveMedication = async () => {
    if (canAddTue && formState.medicationTUEOpen && medicationTUERef?.current) {
      // Run validation
      if (!medicationTUERef.current.checkTUEValidation()) {
        return; // Cannot proceed if validation failed
      }
    }

    const requiredFields = [
      formState.athlete_id,
      formState.prescriber.id,
      formState.prescription_date,
      formState.stock_lots,
      formState.route,
      formState.start_date,
      formState.end_date,
    ];
    if (formState.unlistedMedOpen) {
      requiredFields.push(formState.unlistedMed.name?.trim());
      requiredFields.push(formState.unlistedMed.drug_form);
      requiredFields.push(formState.unlistedMed.med_strength?.trim());
      requiredFields.push(formState.unlistedMed.med_strength_unit);

      if (formState.unlistedMed.med_strength_unit === 'other') {
        requiredFields.push(
          formState.unlistedMed.med_strength_other_unit?.trim()
        );
      }
    } else {
      requiredFields.push(formState.medication.value);
    }

    if (!formState.tapered) {
      requiredFields.push(formState.directions);
    }

    if (formState.prescriber.id === 'other') {
      requiredFields.push(formState.external_prescriber_name);
    }

    const requiredNumericInputFields = formState.tapered
      ? [formState.duration]
      : [formState.dose, formState.frequency, formState.duration];

    if (
      props.actionType === 'Dispense' ||
      (formState.quantity && props.actionType === 'Log')
    ) {
      requiredNumericInputFields.push(formState.quantity);
    }

    const allRequiredFieldsAreValid = requiredFields.every((item) => item);

    const allRequiredNumericInputFieldsAreValid =
      requiredNumericInputFields.every((item) => !isNumberInvalid(item, true));
    setIsValidationCheckAllowed(true);

    const areStockQuantitiesValid =
      props.actionType === 'Dispense' &&
      formState.stock_lots.every(
        (stockLot) => !isNumberInvalid(stockLot.dispensed_quantity, true)
      );

    if (
      !allRequiredFieldsAreValid ||
      !allRequiredNumericInputFieldsAreValid ||
      (props.actionType === 'Dispense' && !areStockQuantitiesValid) ||
      (props.actionType === 'Dispense' &&
        !props.isEditing &&
        formState.stock_lots.some(
          (stockLot) =>
            lotDispensedExceedsLotQuantity(
              stockLot,
              lots,
              isValidationCheckAllowed
            ) || !stockLot.dispensed_quantity
        ))
    ) {
      return;
    }

    const drugType = getDrugType();
    if (formState.unlistedMedOpen || drugType === drugTypesEnum.CustomDrug) {
      setUnlistedMedWarningDialogOpen(true);
    } else {
      const screenDrug = {
        athlete_id: props.athleteData.id,
        drug_type: drugType,
        drug_id: getDrugId(),
      };
      setIsPerformingDrugScreening(true);
      try {
        const fetchedScreenAllergyErrors = await screenAllergyToDrug(
          screenDrug
        );
        setScreenAllergyErrors(fetchedScreenAllergyErrors);
        const fetchedScreenDrugErrors = await screenDrugToDrug(screenDrug);
        setIsPerformingDrugScreening(false);
        setScreenDrugErrors(fetchedScreenDrugErrors);
        if (
          fetchedScreenAllergyErrors?.length ||
          fetchedScreenDrugErrors?.length
        ) {
          setIsScreenAllergyToDrugModalOpen(true);
        } else {
          dispenseOnSave();
        }
      } catch {
        setIsPerformingDrugScreening(false);
        setRequestStatus('FAILURE');
      }
    }
  };

  const displayGeneralError = [
    requestStatus,
    props.initialDataRequestStatus,
  ].some((status) => status === 'FAILURE');

  const getAssociatedInjuryIllnessValues = () => {
    return getFormattedIssueIds(
      formState.injury_occurrence_ids,
      formState.illness_occurrence_ids,
      formState.chronic_issue_ids
    );
  };

  const renderLogDispenseButtons = () => {
    return (
      <>
        <div
          css={style.logDispenseButtonContainer}
          data-testid="LogDispenseSegmentedControl"
        >
          <SegmentedControl
            buttons={[
              ...(permissions.medical?.medications?.canLog
                ? [
                    {
                      name: t('Log'),
                      value: 'Log',
                      isDisabled:
                        props.isEditing && props.actionType === 'Dispense',
                    },
                  ]
                : []),
              ...(permissions.medical?.stockManagement?.canDispense
                ? [
                    {
                      name: t('Dispense'),
                      value: 'Dispense',
                      isDisabled: props.isEditing && props.actionType === 'Log',
                    },
                  ]
                : []),
            ]}
            maxWidth={130}
            onClickButton={(id) => {
              props.setActionType(id);
              setIsValidationCheckAllowed(false);
            }}
            isSeparated
            color={colors.grey_200}
            selectedButton={props.actionType}
          />
        </div>
        <div css={style.divider} />
      </>
    );
  };

  const renderAthleteSelector = () => {
    return (
      <AthleteConstraints athleteId={formState.athlete_id}>
        {({ organisationStatus, athleteSelector, isLoading }) => (
          <div
            css={style.player}
            data-testid={`${DATA_ATTRIBUTE_PREFIX}|AthleteSelect`}
          >
            <Select
              label={t('Athlete')}
              onChange={(id) => onAthleteChange(id)}
              value={formState.athlete_id}
              options={
                organisationStatus === 'PAST_ATHLETE'
                  ? athleteSelector
                  : props.squadAthletes
              }
              isDisabled={
                isLoading ||
                (!props.isAthleteSelectable && !!props.athleteId) ||
                props.isEditing
              }
              dataAttribute={`${DATA_ATTRIBUTE_PREFIX}|Athlete label`}
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  const getSaveButtonLabel = (): string => {
    if (props.isEditing) {
      return t('Save');
    }

    return props.actionType === 'Dispense' ? t('Dispense') : t('Log');
  };

  const renderPrescriptionDatePicker = () => {
    return (
      <AthleteConstraints athleteId={formState.athlete_id} disableMaxDate>
        {({ lastActivePeriod, isLoading }) => (
          <div
            css={style.date}
            data-testid={`${DATA_ATTRIBUTE_PREFIX}|PrescriptionDate`}
          >
            <DatePicker
              label={t('Dispensing date')}
              onDateChange={(prescriptionDate) => {
                dispatch({
                  type: 'SET_PRESCRIPTION_DATE',
                  prescription_date: prescriptionDate,
                });
                // clears dates to prevent selecting prescription date after start date
                if (moment(prescriptionDate).isAfter(formState.start_date)) {
                  dispatch({
                    type: 'SET_START_DATE',
                    start_date: '',
                  });
                  dispatch({
                    type: 'SET_END_DATE',
                    end_date: '',
                  });
                }
              }}
              maxDate={lastActivePeriod.end}
              minDate={lastActivePeriod.start}
              value={formState.prescription_date}
              kitmanDesignSystem
              disabled={isLoading}
              invalid={isValidationCheckAllowed && !formState.prescription_date}
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  const renderPrescriptionDatePickerNew = () => {
    return (
      <div
        css={style.date}
        data-testid={`${DATA_ATTRIBUTE_PREFIX}|PrescriptionDate`}
      >
        <MovementAwareDatePicker
          athleteId={formState.athlete_id ?? undefined}
          value={
            formState.prescription_date
              ? moment(formState.prescription_date)
              : null
          }
          onChange={(prescriptionDate) => {
            dispatch({
              type: 'SET_PRESCRIPTION_DATE',
              prescription_date: prescriptionDate,
            });
            // clears dates to prevent selecting prescription date after start date
            if (moment(prescriptionDate).isAfter(formState.start_date)) {
              dispatch({
                type: 'SET_START_DATE',
                start_date: '',
              });
              dispatch({
                type: 'SET_END_DATE',
                end_date: '',
              });
            }
          }}
          name="dispensingDateSelector"
          inputLabel={t('Dispensing date')}
          disabled={requestStatus === 'PENDING'}
          isInvalid={isValidationCheckAllowed && !formState.prescription_date}
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderMedicationSection = () => {
    if (props.actionType === 'Log' && formState.unlistedMedOpen) {
      return null;
    }
    return (
      <>
        {props.actionType === 'Dispense' ? (
          <div
            css={style.medication}
            data-testid={`${DATA_ATTRIBUTE_PREFIX}|MedicationSelect`}
          >
            <DispensedMedicationSelect
              medicationSourceListName={
                (isGeneralAvailabilityOn &&
                  primaryMedicationSourceList?.name) ||
                'fdb_dispensable_drugs'
              }
              label={t('Medication')}
              placeholder={t('Select medication')}
              onChange={(medication) => {
                const stockMedication = props.stockMedications.find(
                  (med) => med.value === medication.value
                );
                if (stockMedication) {
                  dispatch({
                    type: 'SET_MEDICATION',
                    medication: {
                      value: stockMedication.value,
                      stockId: stockMedication.stockId,
                      label: stockMedication.label,
                      dispensable_drug_id: stockMedication.dispensable_drug_id,
                      drug_type: stockMedication.drug_type,
                    },
                  });
                }
              }}
              stockMedicationOptions={props.stockMedications}
              value={formState.medication.value}
              isDisabled={props.isEditing}
              invalid={isValidationCheckAllowed && !formState.medication.value}
            />
          </div>
        ) : (
          <div
            css={style.medication}
            data-testid={`${DATA_ATTRIBUTE_PREFIX}|MedicationAsyncSelect`}
          >
            <LoggedMedicationSelect
              medicationSourceListName={
                (isGeneralAvailabilityOn &&
                  primaryMedicationSourceList?.name) ||
                'fdb_dispensable_drugs'
              }
              label={t('Brand name / drug')}
              placeholder={t('Search by brand name or dosage...')}
              value={formState.medication}
              onChange={(medication) => {
                dispatch({
                  type: 'SET_MEDICATION',
                  medication: {
                    value: medication.value,
                    label: medication.label,
                    localDrugId: medication.id,
                    drug_type: medication.drug_type,
                  },
                });
              }}
              invalid={isValidationCheckAllowed && !formState.medication.value}
              isDisabled={props.isEditing}
            />
          </div>
        )}
      </>
    );
  };

  const getDateDifference = () => {
    const startDate = moment(formState.start_date);
    const endDate = moment(formState.end_date);
    const duration = endDate.diff(startDate, 'days') + 1;
    if (duration) {
      dispatch({
        type: 'SET_DURATION',
        duration,
      });
    }
  };

  const renderStartDatePicker = () => {
    return (
      <AthleteConstraints athleteId={formState.athlete_id} disableMaxDate>
        {({ lastActivePeriod, isLoading }) => (
          <div
            css={style.startDate}
            data-testid={`${DATA_ATTRIBUTE_PREFIX}|StartDate`}
          >
            <DatePicker
              label={t('Start date')}
              onDateChange={(startDate) => {
                dispatch({
                  type: 'SET_START_DATE',
                  start_date: startDate,
                });
                if (moment(startDate).isAfter(formState.end_date)) {
                  dispatch({
                    type: 'SET_END_DATE',
                    end_date: '',
                  });
                }
              }}
              minDate={moment(formState.prescription_date)}
              maxDate={lastActivePeriod.end}
              value={formState.start_date}
              kitmanDesignSystem
              disabled={isLoading || !formState.prescription_date}
              invalid={isValidationCheckAllowed && !formState.start_date}
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  const renderStartDatePickerNew = () => {
    return (
      <div
        css={style.startDate}
        data-testid={`${DATA_ATTRIBUTE_PREFIX}|StartDate`}
      >
        <MovementAwareDatePicker
          athleteId={formState.athlete_id ?? undefined}
          value={formState.start_date ? moment(formState.start_date) : null}
          onChange={(startDate) => {
            dispatch({
              type: 'SET_START_DATE',
              start_date: startDate,
            });
            if (moment(startDate).isAfter(formState.end_date)) {
              dispatch({
                type: 'SET_END_DATE',
                end_date: '',
              });
            }
          }}
          inputLabel={t('Start date')}
          disabled={!formState.prescription_date}
          isInvalid={isValidationCheckAllowed && !formState.start_date}
          minDate={moment(formState.prescription_date)}
          width="auto"
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderEndDatePicker = () => {
    return (
      <div css={style.endDate} data-testid={`${DATA_ATTRIBUTE_PREFIX}|EndDate`}>
        <DatePicker
          label={t('End date')}
          onDateChange={(endDate) => {
            dispatch({
              type: 'SET_END_DATE',
              end_date: endDate,
            });
          }}
          value={formState.end_date}
          minDate={moment(formState.start_date)}
          kitmanDesignSystem
          disabled={!formState.prescription_date || !formState.start_date}
          invalid={isValidationCheckAllowed && !formState.end_date}
        />
      </div>
    );
  };

  const renderEndDatePickerNew = () => {
    return (
      <div css={style.endDate} data-testid={`${DATA_ATTRIBUTE_PREFIX}|EndDate`}>
        <MovementAwareDatePicker
          athleteId={formState.athlete_id ?? undefined}
          value={formState.end_date ? moment(formState.end_date) : null}
          onChange={(endDate) => {
            dispatch({
              type: 'SET_END_DATE',
              end_date: endDate,
            });
          }}
          inputLabel={t('End date')}
          disabled={!formState.prescription_date || !formState.start_date}
          isInvalid={isValidationCheckAllowed && !formState.end_date}
          minDate={moment(formState.start_date)}
          width="auto"
          kitmanDesignSystem
        />
      </div>
    );
  };

  const labelBuilder = (input) => {
    if (input.tapered) {
      return t('as directed, for {{duration}} day(s)', {
        duration: input.duration || '',
      });
    }

    return t(
      '{{directions}} {{dose}} {{route}} {{frequency}} time(s), for {{duration}} day(s)',
      {
        directions: input.directions || '',
        dose: input.dose || '',
        route: input.route || '',
        frequency: input.frequency || '',
        duration: input.duration || '',
      }
    );
  };

  const getPrescriber = ({ prescriber }) => {
    // find the user based on the unique sgid, if none find other
    const findUser = sortedMedicationProviders?.find(
      (user) => user.value === prescriber.sgid || user.value === 'other'
    );
    return { id: findUser?.value, name: findUser?.label };
  };

  const setExternalPrescriber = ({
    external_prescriber_name: externalName,
  }) => {
    if (externalName) {
      setShowOptionalText(true);
    }
    return externalName;
  };

  const populateSelectedMedicationFields = () => {
    dispatch({
      type: 'AUTOPOPULATE_SELECTED_MED',
      frequency: props.selectedMedication?.frequency,
      route: props.selectedMedication?.route,
      prescriber: getPrescriber(props.selectedMedication),
      external_prescriber_name: setExternalPrescriber(props.selectedMedication),
      medication: {
        value: props.selectedMedication?.drug?.id,
        label:
          props.selectedMedication?.display_name ||
          props.selectedMedication?.drug?.name,
        dispensable_drug_id:
          props.selectedMedication?.drug?.dispensable_drug_id, // dispensable_drug_id won't be present with NHS med
        drug_type: props.selectedMedication?.drug_type,
      },
      prescription_date: props.selectedMedication?.prescription_date,
      directions: props.selectedMedication?.directions,
      tapered: props.selectedMedication?.tapered || false,
      dose: props.selectedMedication?.dose,
      end_date: props.selectedMedication?.end_date,
      note: props.selectedMedication?.note,
      quantity: props.selectedMedication.quantity,
      lot_number: props.selectedMedication.lot_number,
      start_date: props.selectedMedication.start_date,
    });

    dispatch({
      type: 'SET_INJURY_IDS',
      injuryIds:
        props.selectedMedication.issues
          ?.filter(
            (selectedMedIssue) => selectedMedIssue.issue_type === 'Injury'
          )
          .map((injuryIssue) => injuryIssue.id) || [],
    });

    dispatch({
      type: 'SET_ILLNESS_IDS',
      illnessIds:
        props.selectedMedication.issues
          ?.filter(
            (selectedMedIssue) => selectedMedIssue.issue_type === 'Illness'
          )
          .map((illnessIssue) => illnessIssue.id) || [],
    });

    dispatch({
      type: 'SET_CHRONIC_IDS',
      chronicIds:
        props.selectedMedication.chronic_issues?.map(
          (chronicIssue) => chronicIssue.id
        ) || [],
    });

    const stockMedication = props.stockMedications.find(
      (med) =>
        med.value === props.selectedMedication?.drug?.id &&
        med.drug_type === props.selectedMedication?.drug_type
    );
    if (stockMedication) {
      dispatch({
        type: 'SET_MEDICATION',
        medication: {
          value: stockMedication.value,
          stockId: stockMedication.stockId,
          label: stockMedication.label,
          drug_type: stockMedication.drug_type,
          dispensable_drug_id: stockMedication.dispensable_drug_id,
        },
      });
    }
    if (
      props.selectedMedication?.medication_stock_lots &&
      props.selectedMedication?.medication_stock_lots.length
    ) {
      dispatch({
        type: 'SET_STOCK_LOTS_AND_QUANTITY',
        stock_lots: props.selectedMedication?.medication_stock_lots.map(
          (lot) => {
            return {
              id: lot.stock_lot.id,
              dispensed_quantity: lot.dispensed_quantity,
            };
          }
        ),
      });
    }
    if (
      props.selectedMedication?.note &&
      props.selectedMedication?.note.length
    ) {
      editorRef.current?.update(
        getEditorStateFromValue(props.selectedMedication.note)
      );
    }
  };

  useEffect(() => {
    if (props.selectedMedication) {
      const { source } = props.selectedMedication;
      populateSelectedMedicationFields();

      if (source === 'Dispensed') {
        props.setActionType('Dispense');
      } else if (source === 'Logged') {
        props.setActionType('Log');
      }
    }
  }, [props.selectedMedication]);

  useEffect(() => {
    const drugType = getDrugType();
    if (drugType === drugTypesEnum.CustomDrug) {
      // There is currently no favoriting of medication values for a custom drug
      return;
    }
    if (formState.medication.value || formState.medication.localDrugId) {
      let drugId;
      if (
        props.actionType === 'Log' &&
        !props.isEditing &&
        formState.medication.localDrugId
      ) {
        drugId = formState.medication.localDrugId;
      } else if (formState.medication.value) {
        drugId = formState.medication.value;
      }
      if (drugId) {
        getMedicationFavorites(Number(drugId), drugType)
          .then((response) =>
            setMedConfigFavorites(
              response.map((favorite) => ({
                ...favorite,
                label: labelBuilder(favorite),
                value: favorite.id,
              }))
            )
          )
          .catch(() => {
            setMedConfigFavorites([]);
          });
      }
    }
  }, [formState.medication]);

  useEffect(() => {
    getDateDifference();
  }, [formState.start_date, formState.end_date]);

  const isRedoxOrg =
    // eslint-disable-next-line dot-notation
    window.featureFlags['redox'] && window.featureFlags['redox-iteration-1'];

  useEffect(() => {
    const userExists =
      sortedMedicationProviders?.filter(
        (staffUser) => staffUser.value === currentUser.id
      ).length > 0;

    if (
      props.isOpen &&
      currentUser &&
      userExists &&
      !isRedoxOrg &&
      !formState.prescriber.id
    ) {
      dispatch({
        type: 'SET_PRESCRIBER',
        prescriber: { id: currentUser.id, name: currentUser.fullname },
      });
    }
  }, [props.isOpen, currentUser, sortedMedicationProviders]);

  useEffect(() => {
    // because we default to 'Log', if the user does not have 'Log' but has 'Dispense', switch the initial action type
    if (
      !permissions.medical?.medications?.canLog &&
      permissions.medical?.stockManagement?.canDispense
    ) {
      props.setActionType('Dispense');
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    if (props.athleteId) {
      dispatch({ type: 'SET_ATHLETE_ID', athleteId: props.athleteId });
    }

    if (
      props.isOpen &&
      !props.isEditing &&
      props.athleteConstraints?.organisationStatus === 'CURRENT_ATHLETE'
    ) {
      dispatch({
        type: 'SET_PRESCRIPTION_DATE',
        prescription_date: moment().startOf('day').format(dateTransferFormat),
      });

      dispatch({
        type: 'SET_START_DATE',
        start_date: moment().startOf('day').format(dateTransferFormat),
      });
    }

    if (!props.isOpen) {
      editorRef.current?.update(getEditorStateFromValue(''));
      setIsValidationCheckAllowed(false);
      dispatch({ type: 'CLEAR_FORM' });
    }

    if (props.isOpen && !props.selectedMedication && issue?.id && issueType) {
      const issueIds = [issue.id];
      if (isChronicIssue) {
        dispatch({ type: 'SET_CHRONIC_IDS', chronicIds: issueIds });
      } else if (issueType === 'Injury') {
        dispatch({ type: 'SET_INJURY_IDS', injuryIds: issueIds });
      } else if (issueType === 'Illness') {
        dispatch({ type: 'SET_ILLNESS_IDS', illnessIds: issueIds });
      }
    }
  }, [props.athleteId, props.isOpen]);

  const renderConfirmationModal = () => (
    <ConfirmationModal
      isModalOpen={isConfirmationModalOpen}
      isLoading={false}
      onConfirm={() => cleanUpAndClose(false)}
      onCancel={() => setIsConfirmationModalOpen(false)}
      onClose={() => setIsConfirmationModalOpen(false)}
      dialogContent={
        <DialogContentText id={modalDescriptionId}>
          {t(
            'WARNING: All attachments have not been uploaded. Do you want to proceed without them?'
          )}
        </DialogContentText>
      }
      translatedText={{
        title: t('Attachments not completed'),
        actions: { ctaButton: t('Confirm'), cancelButton: t('Cancel') },
      }}
    />
  );

  const onAddFileForUpload = (filePondFile) => {
    const {
      file,
      id,
      fileSize,
      fileTitle,
      fileType,
      filename,
      filenameWithoutExtension,
    } = filePondFile;
    // Extract just what is needed from filePond file for management via useManageFilesForUpload
    const attachedMedicalFile: AttachedMedicalFile = {
      file,
      fileSize,
      fileTitle,
      fileType,
      filename,
      filenameWithoutExtension,
      id,
      medical_attachment_category_ids: props.defaultAttachmentCategoryIds,
    };
    handleAddFile(attachedMedicalFile);
  };

  return (
    <div css={style.sidePanel} data-testid={`${DATA_ATTRIBUTE_PREFIX}|Root`}>
      <ScreenAllergyToDrugModal
        openModal={isScreenAllergyToDrugModalOpen}
        setOpenModal={setIsScreenAllergyToDrugModalOpen}
        screenAllergyErrors={screenAllergyErrors}
        screenDrugErrors={screenDrugErrors}
        dispenseOnSave={dispenseOnSave}
      />
      <UnlistedMedWarningDialog
        isOpen={unlistedMedWarningDialogOpen}
        onCancel={() => {
          setUnlistedMedWarningDialogOpen(false);
        }}
        onConfirm={() => {
          setUnlistedMedWarningDialogOpen(false);
          dispenseOnSave();
        }}
      />
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={props.isEditing ? t('Edit medication') : t('Add medication')}
        onClose={cleanUpAndClose}
        width={659}
      >
        <div css={style.content}>
          {(permissions.medical?.medications?.canLog ||
            permissions.medical?.stockManagement?.canDispense) &&
            renderLogDispenseButtons()}
          {renderAthleteSelector()}
          <AllergyAlertSection athleteData={props.athleteData} />
          <div css={style.divider} />
          <div
            css={style.practitioner}
            data-testid={`${DATA_ATTRIBUTE_PREFIX}|Prescriber`}
          >
            <ChoiceEntryQuestion
              choiceLabel={t('Dispenser')}
              choiceValue={formState.prescriber.id}
              choiceOptions={[
                {
                  value: 1,
                  label: t('Internal providers'),
                  options: staffProviders,
                },
                {
                  value: 2,
                  label: t('External providers'),
                  options: [...locationProviders, ...otherProviders],
                },
              ]}
              choiceOnChange={({ value }) => {
                const prescriber = sortedMedicationProviders?.find(
                  (user) => user.value === value
                );

                dispatch({
                  type: 'SET_PRESCRIBER',
                  prescriber: {
                    id: prescriber?.value,
                    name: prescriber?.label,
                  },
                });
                if (!prescriber?.requiresText) {
                  dispatch({
                    type: 'SET_EXTERNAL_PRESCRIBER_NAME',
                    external_prescriber_name: '',
                  });
                  setShowOptionalText(false);
                } else {
                  setShowOptionalText(true);
                }
              }}
              isSelectDisabled={props.initialDataRequestStatus === 'PENDING'}
              isSelectInvalid={
                isValidationCheckAllowed && !formState.prescriber.id
              }
              isOptionalTextInvalid={
                isValidationCheckAllowed && !formState.external_prescriber_name
              }
              renderOptionalTextField={showOptionalText}
              optionalTextInputValue={formState?.external_prescriber_name}
              optionalTextLabel={t('Other')}
              optionalTextInputOnChange={(e) => {
                dispatch({
                  type: 'SET_EXTERNAL_PRESCRIBER_NAME',
                  external_prescriber_name: e.target.value,
                });
              }}
            />
          </div>

          {showPlayerMovementDatePicker
            ? renderPrescriptionDatePickerNew()
            : renderPrescriptionDatePicker()}
          <div css={style.divider} />
          <div
            css={style.injuryIllness}
            data-testid={`${DATA_ATTRIBUTE_PREFIX}|Injury/Illness`}
          >
            <Select
              label={t('Injury / illness')}
              onChange={(ids) => {
                dispatch({
                  type: 'SET_ILLNESS_IDS',
                  illnessIds: getIssueIds('Illness', ids),
                });
                dispatch({
                  type: 'SET_INJURY_IDS',
                  injuryIds: getIssueIds('Injury', ids),
                });
                dispatch({
                  type: 'SET_CHRONIC_IDS',
                  chronicIds: getIssueIds('ChronicInjury', ids),
                });
              }}
              options={athleteIssues}
              value={getAssociatedInjuryIllnessValues()}
              optional={window.organisationSport !== 'nfl'}
              isMulti
              appendToBody
              dataAttribute={`${DATA_ATTRIBUTE_PREFIX}|Injury / illness label`}
            />
          </div>
          {renderMedicationSection()}
          {window.featureFlags['medical-unlisted-meds'] &&
            permissions.medical?.medications?.canAdmin &&
            props.actionType === 'Log' &&
            !props.isEditing && (
              <div css={[style.fullWidth]}>
                <UnlistedMedicationInput
                  isValidationCheckAllowed={isValidationCheckAllowed}
                  isOpen={formState.unlistedMedOpen}
                  toggleOpen={() => {
                    dispatch({ type: 'TOGGLE_UNLISTED_MED_OPEN' });
                  }}
                  unlistedMed={formState.unlistedMed}
                  updateUnlistedMed={(action: FormAction) => {
                    dispatch(action);
                  }}
                  isDisabled={false}
                />
              </div>
            )}
          {canAddTue && (
            <>
              <div css={[style.fullWidth]}>
                <MedicationTUEAlert
                  isUnlistedMed={
                    formState.unlistedMedOpen ||
                    formState.medication?.drug_type === drugTypesEnum.CustomDrug
                  }
                  localDrugId={getDrugId()}
                  drugName={formState.medication?.label}
                />
              </div>
              {formState.athlete_id && (
                <div css={[style.fullWidth]}>
                  <MedicationTUE
                    ref={medicationTUERef}
                    athleteId={formState.athlete_id}
                    isOpen={formState.medicationTUEOpen}
                    toggleOpen={() => {
                      dispatch({ type: 'TOGGLE_MEDICATION_TUE_OPEN' });
                    }}
                    isDisabled={false}
                    t={t} // TODO: Struggled to setup withNamespaces for translation and forward ref together
                  />
                </div>
              )}
            </>
          )}
          {medConfigFavorites?.length ? (
            <div css={style.injuryIllness} data-testid="AutofillSelect">
              <AutofillFromFavSelect
                medConfigFavorites={medConfigFavorites}
                setMedConfigFavorites={setMedConfigFavorites}
                selectedMedConfig={selectedMedConfig}
                isDisabled={
                  (formState.prescription_date == null ||
                    formState.prescription_date?.length <= 0) &&
                  formState.medication.value != null
                }
                onChange={(item) => {
                  setSelectedMedConfig(item);
                  dispatch({
                    type: 'AUTOFILL_FROM_FAVORITE',
                    ...item,
                  });
                }}
                onStart={props.onDeleteMedicationConfigStart}
                onSuccess={props.onDeleteMedicationConfigSuccess}
                onFailure={props.onDeleteMedicationConfigFailure}
              />
            </div>
          ) : (
            <></>
          )}
          <LotSection
            t={t}
            actionType={props.actionType}
            formState={formState}
            dispatch={dispatch}
            isValidationCheckAllowed={isValidationCheckAllowed}
            setRequestStatus={setRequestStatus}
            isEditing={props.isEditing}
            lots={lots}
            setLots={setLots}
          />

          <div
            css={style.directions}
            data-testid={`${DATA_ATTRIBUTE_PREFIX}|Directions`}
          >
            <Select
              label={t('Directions')}
              onChange={(directions) =>
                dispatch({
                  type: 'SET_DIRECTIONS',
                  directions,
                })
              }
              value={formState.directions}
              options={getDirectionDropdownOptions()}
              invalid={
                !formState.tapered &&
                isValidationCheckAllowed &&
                !formState.directions
              }
              isDisabled={formState.tapered}
              dataAttribute={`${DATA_ATTRIBUTE_PREFIX}|Directions label`}
            />
          </div>
          <div css={style.dose} data-testid={`${DATA_ATTRIBUTE_PREFIX}|Dose`}>
            <span
              className={classNames('kitmanReactSelect__label', {
                'kitmanReactSelect__label--disabled': formState.tapered,
              })}
            >
              {t('Dose')}
            </span>
            <InputTextField
              value={formState.dose || ''}
              disabled={formState.tapered}
              onChange={(e) => {
                dispatch({
                  type: 'SET_DOSE',
                  dose: e.target.value,
                });
              }}
              inputType="number"
              kitmanDesignSystem
              invalid={
                !formState.tapered &&
                (isNumberInvalid(formState.dose, isValidationCheckAllowed) ||
                  (isValidationCheckAllowed && formState.dose === null))
              }
            />
            <InputError
              isEditing={props.isEditing}
              t={t}
              formItem={formState.dose}
              isValidationCheckAllowed={isValidationCheckAllowed}
            />
          </div>
          <div
            css={style.frequency}
            data-testid={`${DATA_ATTRIBUTE_PREFIX}|Frequency`}
          >
            <span
              className={classNames('kitmanReactSelect__label', {
                'kitmanReactSelect__label--disabled': formState.tapered,
              })}
            >
              {t('Frequency (per day)')}
            </span>
            <InputTextField
              value={formState.frequency || ''}
              disabled={formState.tapered}
              onChange={(e) => {
                dispatch({
                  type: 'SET_FREQUENCY',
                  frequency: e.target.value,
                });
              }}
              inputType="number"
              kitmanDesignSystem
              invalid={
                !formState.tapered &&
                isNumberInvalid(formState.frequency, isValidationCheckAllowed)
              }
            />
            <InputError
              isEditing={props.isEditing}
              t={t}
              formItem={formState.frequency}
              isValidationCheckAllowed={isValidationCheckAllowed}
            />
          </div>
          <div css={style.route} data-testid={`${DATA_ATTRIBUTE_PREFIX}|Route`}>
            <Select
              label={t('Route')}
              onChange={(route) =>
                dispatch({
                  type: 'SET_ROUTE',
                  route,
                })
              }
              value={formState.route}
              options={getRouteDropdownOptions()}
              invalid={isValidationCheckAllowed && !formState.route}
              dataAttribute={`${DATA_ATTRIBUTE_PREFIX}|Route label`}
            />
          </div>
          {window.featureFlags['tapered-meds'] && (
            <div
              css={style.tapered}
              data-testid={`${DATA_ATTRIBUTE_PREFIX}|AsDirected`}
            >
              <Checkbox.New
                id="tapered"
                checked={formState.tapered}
                name="tapered"
                onClick={() => {
                  dispatch({
                    type: 'TOGGLE_TAPERED',
                  });
                }}
              />
              <label htmlFor="tapered" css={style.checkboxLabel}>
                {t('As directed')}
              </label>
            </div>
          )}
          {showPlayerMovementDatePicker
            ? renderStartDatePickerNew()
            : renderStartDatePicker()}
          {showPlayerMovementDatePicker
            ? renderEndDatePickerNew()
            : renderEndDatePicker()}

          {formState.start_date && formState.end_date && (
            <div
              css={style.duration}
              data-testid={`${DATA_ATTRIBUTE_PREFIX}|Duration`}
            >
              <span className="kitmanReactSelect__label">
                {t('Duration (days)')}
              </span>
              <div css={style.textField}>{formState.duration}</div>
            </div>
          )}
          {formState.duration && formState.frequency && formState.dose ? (
            <div
              css={style.total}
              data-testid={`${DATA_ATTRIBUTE_PREFIX}|TotalPrescribed`}
            >
              <span className="kitmanReactSelect__label">{t('Total')}</span>
              <div css={style.textField}>
                {parseFloat(formState.duration) *
                  parseFloat(formState.frequency) *
                  parseFloat(formState.dose)}
              </div>
            </div>
          ) : null}
          <div css={[style.fullWidth]}>
            <div css={style.divider} />
            <RichTextEditor
              label={t('Note')}
              onChange={(note) =>
                dispatch({
                  type: 'SET_NOTE',
                  note,
                })
              }
              forwardedRef={editorRef}
              value={formState.note}
              kitmanDesignSystem
              optionalText={t('Optional')}
            />
            {allowAttachments && (
              <>
                <FileUploads
                  filePondRef={filePondRef}
                  acceptedFileTypes={[...imageFileTypes, pdfFileType]}
                  acceptedFileTypesLabel={t('{{a}} or {{b}}', {
                    a: 'PNG, JPG, GIF, TIFF',
                    b: 'PDF',
                  })}
                  allowScanning={isScannerIntegrationAllowed()}
                  onAddFile={onAddFileForUpload}
                  onError={handleError}
                  validationErrorsAreaRef={validationErrorsAreaRef}
                  validationErrors={attachmentsValidationErrors}
                  resetValidation={() => setAttachmentsValidationErrors([])}
                  disabled={isLoadingDataOrSubmitting}
                />
                <FilesDock
                  hideTitle
                  filesDockRef={filesDockRef}
                  filesToUpload={filesToUpload}
                  handleRemoveFile={handleRemoveFile}
                  hideRemoveAction={isLoadingDataOrSubmitting}
                />
              </>
            )}
          </div>
        </div>

        <div css={style.actions}>
          <TextButton
            onClick={onSaveMedication}
            text={getSaveButtonLabel()}
            isLoading={isLoadingDataOrSubmitting}
            type="primary"
            kitmanDesignSystem
            isDisabled={isLoadingDataOrSubmitting}
          />
        </div>
        {displayGeneralError && <AppStatus status="error" />}
        {hasNonUploadedFiles && renderConfirmationModal()}
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddMedicationSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddMedicationSidePanel);
export default AddMedicationSidePanel;
