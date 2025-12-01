// @flow
import { useState, useEffect } from 'react';
import _uniqueId from 'lodash/uniqueId';

import { Divider } from '@kitman/playbook/components';
import massUpload from '@kitman/modules/src/shared/MassUpload/services/massUpload';
import getSourceFormData, {
  type SourceFormDataResponse,
} from '@kitman/modules/src/shared/MassUpload/services/getSourceFormData';
import getIntegrationData, {
  type IntegrationDataResponse,
} from '@kitman/modules/src/shared/MassUpload/services/getIntegrationData';
import uploadAttachment from '@kitman/services/src/services/uploadAttachment';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import i18n from '@kitman/common/src/utils/i18n';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import { type ToastStatus } from '@kitman/components/src/Toast/types';

import Stepper from './components/Stepper';
import { UploaderTranslated as Uploader } from './components/Uploader';
import type { ImportConfig } from './types';

type Props = {
  importType: $Values<typeof IMPORT_TYPES>,
  importConfig: ImportConfig,
  eventType: string | null,
};

const MassUploadNew = ({ importType, importConfig, eventType }: Props) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [hasPartialErrors, setHasPartialErrors] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [integrationData, setIntegrationData] =
    useState<SourceFormDataResponse | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<{
    id: number | string | null,
    name: string | null,
  }>({ id: null, name: null });
  const [selectedVendor, setSelectedVendor] = useState<{
    id: ?number,
    label: ?string,
  } | null>(null);
  const [apiData, setApiData] = useState<IntegrationDataResponse | null>(null);
  const [selectedApiImport, setSelectedApiImport] = useState<Date | null>(null);

  const { toasts, toastDispatch } = useToasts();

  const locationAssign = useLocationAssign();

  const eventId = new URLSearchParams(window.location.search).get('event_id');
  const eventTime = new URLSearchParams(window.location.search).get(
    'event_time'
  );
  const uploadSteps = importConfig.customSteps ?? [
    { title: i18n.t('Upload file'), caption: i18n.t('Must be a .CSV') },
    { title: i18n.t('Preview import'), caption: i18n.t('Check for errors') },
  ];

  const canImportWithPartialErrors =
    importConfig.canImportWithErrors && hasPartialErrors;

  const isImportValid =
    (Boolean(attachedFile) && !hasErrors) || canImportWithPartialErrors;

  const dispatchToast = (
    id: string | number,
    status: ToastStatus,
    title: string,
    description?: string
  ) => {
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id,
        status,
        title,
        description,
        removalDelay: 'LongRemovalDelay',
      },
    });
  };

  const onUploadCSV = async () => {
    if (attachedFile || selectedApiImport) {
      try {
        setIsLoading(true);
        if (typeof importConfig.customImportService === 'function') {
          const selectedImport = apiData?.events.find(
            (data) => data.event?.unique_identifier === selectedApiImport
          );
          // $FlowIgnore[not-a-function]
          await importConfig.customImportService({
            event: { id: eventId },
            sourceData: {
              fileData: {
                file: attachedFile?.file,
                source: selectedVendor?.id,
              },
              integrationData: { id: selectedIntegration.id },
              eventData: {
                event: {
                  integrationDate: selectedImport?.event?.integration_date,
                  uniqueIdentifier: selectedImport?.event?.unique_identifier,
                },
              },
              type: attachedFile ? 'FILE' : 'INTEGRATION',
            },
          });
        } else if (attachedFile) {
          const response = await uploadAttachment(
            attachedFile.file,
            attachedFile.filename
          );
          await massUpload(response.attachment_id, `${importType}_import`);
        }
        setIsLoading(false);
        locationAssign(importConfig.redirectUrl);
      } catch {
        setIsLoading(false);
        dispatchToast(
          attachedFile?.id ?? _uniqueId(),
          'ERROR',
          i18n.t('Import failed'),
          attachedFile?.filename
        );
      }
    }
  };

  useEffect(() => {
    if (
      hasErrors &&
      !(activeStep === 0 && importType === IMPORT_TYPES.EventData)
    ) {
      dispatchToast(
        attachedFile?.id ?? 1,
        canImportWithPartialErrors ? 'WARNING' : 'ERROR',
        canImportWithPartialErrors ? i18n.t('Warning') : i18n.t('Errors found'),
        canImportWithPartialErrors
          ? i18n.t(
              'File can be imported, but some entries will be skipped due to errors highlighted'
            )
          : i18n.t('Fix errors in the .CSV and try again')
      );
    }
  }, [hasErrors]);

  // Remove toast when user navigates back to previous step
  // and if error toast exists
  useEffect(() => {
    if (
      activeStep === 0 &&
      toasts.some((toast) => toast.id === attachedFile?.id)
    ) {
      toastDispatch({
        type: 'REMOVE_TOAST_BY_ID',
        id: attachedFile?.id ?? _uniqueId(),
      });
    }
  }, [activeStep]);

  // Clear all selections when selectedIntegration changes
  useEffect(() => {
    if (selectedIntegration) {
      setSelectedVendor(null);
      setAttachedFile(null);
      setSelectedApiImport(null);
      setApiData(null);
      setHasErrors(false);
    }
  }, [selectedIntegration]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedIntegration.id && eventTime) {
        const data = await getIntegrationData({
          integrationId: selectedIntegration.id,
          eventDate: eventTime,
        });
        if (data.success) {
          setApiData(data);
        } else {
          setActiveStep(0);
          setHasErrors(true);
        }
      }
    };

    if (
      importType === IMPORT_TYPES.EventData &&
      selectedIntegration.name !== 'CSV' &&
      activeStep === 1
    ) {
      try {
        setIsLoading(true);
        fetchData();
      } catch {
        setIsLoading(false);
        setHasErrors(true);
      }
      setIsLoading(false);
    }
  }, [importType, selectedIntegration, activeStep, eventTime]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSourceFormData();
      setIntegrationData(data);
      setIsLoading(false);
    };
    if (importType === IMPORT_TYPES.EventData) {
      try {
        setIsLoading(true);
        fetchData();
      } catch {
        setIsLoading(false);
      }
    }
  }, [importType]);

  return (
    <>
      <Stepper
        activeStep={activeStep}
        onChange={setActiveStep}
        canProceed={
          (isImportValid && importType !== IMPORT_TYPES.EventData) ||
          (Boolean(selectedIntegration.id) &&
            activeStep === 0 &&
            (!hasErrors || !apiData?.success)) ||
          (Boolean(selectedApiImport) &&
            activeStep === 1 &&
            apiData?.events?.some(
              (apiEvent) => apiEvent.athletes.length > 0
            )) ||
          (Boolean(selectedApiImport) && activeStep === 2) ||
          (Boolean(isImportValid) && Boolean(selectedVendor))
        }
        onImport={onUploadCSV}
        isLoading={isLoading}
        importType={importType}
        uploadSteps={uploadSteps}
      />
      <Divider />
      <Uploader
        useGrid={importConfig.grid}
        importType={importType}
        expectedHeaders={importConfig.expectedHeaders}
        allowAdditionalHeaders={importConfig.allowAdditionalHeaders}
        optionalExpectedHeaders={importConfig.optionalExpectedHeaders}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        setAttachedFile={setAttachedFile}
        attachedFile={attachedFile}
        setHasErrors={setHasErrors}
        hasErrors={hasErrors}
        setHasPartialErrors={setHasPartialErrors}
        integrationData={integrationData}
        setSelectedIntegration={setSelectedIntegration}
        selectedIntegration={selectedIntegration}
        setSelectedVendor={setSelectedVendor}
        selectedVendor={selectedVendor}
        uploadSteps={uploadSteps}
        integrationEvents={apiData?.events}
        selectedApiImport={selectedApiImport}
        setSelectedApiImport={setSelectedApiImport}
        eventTime={eventTime}
        eventType={eventType}
        toastDispatch={toastDispatch}
        toasts={toasts}
      />
    </>
  );
};

export default MassUploadNew;
