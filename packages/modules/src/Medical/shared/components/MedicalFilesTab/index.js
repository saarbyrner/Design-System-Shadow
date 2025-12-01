// @flow
import { useEffect, useState } from 'react';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type {
  MedicalFile,
  EntityAttachmentFilters,
} from '@kitman/modules/src/Medical/shared/types/medical';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { ToastId } from '@kitman/components/src/types';
import exportMultiDocument from '@kitman/services/src/services/exports/exportMultiDocument';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import {
  docFileTypes,
  imageFileTypes,
} from '@kitman/common/src/utils/mediaHelper';
import { MassScanningModalTranslated as MassScanningModal } from '@kitman/modules/src/Medical/shared/components/MassScanningModal';
import { isCanceledError } from '@kitman/common/src/utils/services';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  determineMedicalLevelAndTab,
  getDocumentActionElement,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import type {
  RequestStatus,
  FilesFilters as FilesFiltersType,
} from '../../types';
import useDocuments from '../../hooks/useDocuments';
import useEntityAttachments from '../../hooks/useEntityAttachments';
import useAttachmentSelection from '../../hooks/useAttachmentSelection';
import { FilesTableTranslated as FilesTable } from './components/FilesTable';
import ArchiveFileModalContainer from './components/ArchiveFileModal/ArchiveFileModalContainer';
import AddMedicalFileSidePanel from '../../containers/AddMedicalFileSidePanel';
import MedicalSidePanels from '../../containers/MedicalSidePanels';
import { FilesFiltersContainerTranslated as FilesFilters } from '../../containers/FilesFilters';
import useExports from '../../hooks/useExports';

import Toasts from '../../containers/Toasts';
import { ExportWarningModalTranslated as ExportWarningModal } from './components/ExportWarningModal/index';

type Props = {
  athleteId: number | null,
  athleteData?: AthleteData,
  issueId: string | null,
  reloadAthleteData?: (boolean) => void,
  hiddenFilters?: ?Array<string>,
  scopeToLevel?: string,
  isMedicalFilePanelOpen?: boolean,
  setIsMedicalFilePanelOpen?: (boolean) => void,
};

const supportedFileTypes = [...docFileTypes, ...imageFileTypes];
const supportedFileTypesNames = ['png', 'tiff', 'jpeg', 'pdf', 'doc', 'docx']; // For display in modal. Does not need to be extensive

const MedicalDocumentsTab = (props: Props) => {
  const { permissions } = usePermissions();
  const { trackEvent } = useEventTracking();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [isAddMedicalDocumentPanelOpen, setIsAddMedicalDocumentPanelOpen] =
    useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showArchiveModal, setShowArchiveModal] = useState<boolean>(false);
  const [showMassScanningModal, setShowMassScanningModal] =
    useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<?MedicalFile>(null);
  const [showArchivedDocuments, setShowArchivedDocuments] =
    useState<boolean>(false);
  const { toasts, toastDispatch } = useToasts();

  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [numExcludedFiles, setNumExcludedFiles] = useState(0);

  const isExportEnabled =
    window.featureFlags['export-multi-doc'] &&
    permissions.medical.issues.canExport;
  const exportProps = useExports(null, isExportEnabled);

  const isMedicalGlobalAddButtonFix =
    window.featureFlags['medical-global-add-button-fix'];

  const showPlayerFilter = props.athleteId === null;

  const enhancedFilesFlow =
    window.featureFlags['medical-files-tab-enhancement'];

  const createIssueOccurrence = (issueId: string | null) => {
    if (issueId === null) return null;

    const [type, id] = issueId.split('_');
    const isChronic = type.toLowerCase().includes('chronic');

    if (isChronic) {
      return {
        id: +id,
        type: enhancedFilesFlow
          ? 'Emr::Private::Models::ChronicIssue'
          : 'chronic_issue',
      };
    }
    return {
      id: +id,
      type: type.toLowerCase(),
    };
  };

  const [filters, setFilters] = useState<FilesFiltersType>({
    athlete_id: props.athleteId,
    filename: '',
    document_date: null,
    document_category_ids: [],
    archived: false,
    issue_occurrence: createIssueOccurrence(props.issueId),
  });

  const [entityAttachmentFilters, setEntityAttachmentFilters] =
    useState<EntityAttachmentFilters>({
      entity_athlete_id: props.athleteId,
      archived: false,
      issue_occurrence: createIssueOccurrence(props.issueId),
      file_types: [],
    });

  const { documents, fetchDocuments, resetDocuments, resetNextPage, nextPage } =
    useDocuments();

  const {
    attachments,
    fetchAttachments,
    resetAttachments,
    resetNextPageToken,
    nextPageToken,
  } = useEntityAttachments();

  const {
    allAttachmentsChecked,
    exportAttachments,
    updateSingleAttachment,
    updateAllAttachments,
  } = useAttachmentSelection();

  const getNextDocuments = useDebouncedCallback(
    ({ resetList = false } = {}) => {
      if (resetList) {
        if (enhancedFilesFlow) {
          resetAttachments();
        } else {
          resetDocuments();
        }
      }

      if (enhancedFilesFlow) {
        fetchAttachments(entityAttachmentFilters, resetList)
          .then(() => setRequestStatus('SUCCESS'))
          .catch((error) =>
            isCanceledError(error)
              ? setRequestStatus('PENDING')
              : setRequestStatus('FAILURE')
          );
      } else {
        fetchDocuments(filters, resetList)
          .then(() => setRequestStatus('SUCCESS'))
          .catch(() => {
            setRequestStatus('FAILURE');
          });
      }
    },
    1000
  );

  useEffect(() => {
    return () => {
      // Do any clean up including debounces
      getNextDocuments?.cancel?.();
    };
  }, [getNextDocuments]);

  const reset = () => {
    setRequestStatus('PENDING');
    if (enhancedFilesFlow) {
      resetAttachments();
      resetNextPageToken();
    } else {
      resetDocuments();
      resetNextPage();
    }
  };

  const buildDocuments = () => {
    reset();
    getNextDocuments({ resetList: true });
  };

  const supportedFilesFilter = ({ filetype, filename }) => {
    // PDF may have filetype "binary/octet-stream" or in some imported files an empty string
    // Cover such pdfs as a special case. As general acceptance of binary/octet-stream not desired.
    // NOTE: Should another item such as an image not have a filetype it would be up to user to exclude though trial and error
    return (
      supportedFileTypes.includes(filetype) ||
      ((filetype === 'binary/octet-stream' || filetype === '') &&
        filename.toLowerCase().endsWith('.pdf'))
    );
  };

  const exportDocuments = () => {
    const exportIds = exportAttachments
      .filter(supportedFilesFilter)
      .map(({ id }) => id);
    exportProps.exportReports(() =>
      exportMultiDocument({
        attachmentIds: exportIds,
      })
    );
    updateAllAttachments(false, documents);
  };

  const onExportDocumentClick = () => {
    const countIncluded = exportAttachments.filter(supportedFilesFilter).length;
    if (countIncluded !== exportAttachments.length) {
      setNumExcludedFiles(exportAttachments.length - countIncluded);
      setWarningModalOpen(true);
    } else {
      exportDocuments();

      trackEvent(performanceMedicineEventNames.exportMedicalDocument, {
        ...determineMedicalLevelAndTab(),
      });
    }
  };

  useEffect(() => {
    buildDocuments();
  }, [filters, entityAttachmentFilters]);

  useEffect(() => {
    // This is needed for when using PlayerSelector as filters don't update with change of athlete
    // or issue. Still persisting filters, so only athlete & issue needs changing.
    // $FlowIgnore Constructing object to match initial filter
    setFilters((prevFilters) => ({
      ...prevFilters,
      athlete_id: props.athleteId || null,
      issue_occurrence: createIssueOccurrence(props.issueId) || null,
    }));

    setEntityAttachmentFilters((prevEntityFilters) => ({
      ...prevEntityFilters,
      entity_athlete_id: props.athleteId,
      issue_occurrence: createIssueOccurrence(props.issueId),
    }));
  }, [props.athleteId, props.issueId]);

  const closeToast = (id: ToastId) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
    exportProps.closeToast(id);
  };

  const updateEntityAttachmentFilters = (
    filterAddition: EntityAttachmentFilters
  ) => {
    // $FlowIgnore[speculation-ambiguous] But objects are EntityAttachmentFilters
    setEntityAttachmentFilters((prev: EntityAttachmentFilters) => {
      return {
        ...prev,
        ...filterAddition,
      };
    });
  };

  return (
    <div style={{ minHeight: '540px' }}>
      <FilesFilters
        requestStatus={requestStatus}
        setIsPanelOpen={(value: boolean) => {
          setIsAddMedicalDocumentPanelOpen(value);
          trackEvent(performanceMedicineEventNames.clickAddMedicalDocument, {
            ...determineMedicalLevelAndTab(),
            ...getDocumentActionElement('Add document button'),
          });
        }}
        showPlayerFilter={showPlayerFilter}
        filters={enhancedFilesFlow ? null : filters}
        enhancedFilters={enhancedFilesFlow ? entityAttachmentFilters : null}
        setFilters={
          enhancedFilesFlow ? updateEntityAttachmentFilters : setFilters
        }
        showArchivedDocuments={showArchivedDocuments}
        setShowArchivedDocuments={setShowArchivedDocuments}
        onExportClick={onExportDocumentClick}
        exportAttachments={exportAttachments}
        hiddenFilters={props.hiddenFilters}
        isAthleteOnTrial={
          props.athleteData?.constraints?.organisation_status ===
          'TRIAL_ATHLETE'
        }
        onScanClick={() => {
          setShowMassScanningModal(true);
        }}
        atIssueLevel={!!props.issueId}
      />
      {showArchivedDocuments ? (
        <FilesTable
          hiddenFilters={props.hiddenFilters}
          documents={enhancedFilesFlow ? attachments : documents}
          nextPage={nextPage || null}
          onReachingEnd={getNextDocuments}
          hasMoreDocuments={
            enhancedFilesFlow ? nextPageToken != null : nextPage != null
          }
          issueId={props.issueId}
          showPlayerColumn={showPlayerFilter}
          setShowArchiveModal={setShowArchiveModal}
          setSelectedRow={setSelectedRow}
          showActions={false}
          permissions={permissions}
          requestStatus={requestStatus}
          setIsEditing={setIsEditing}
          setIsPanelOpen={setIsAddMedicalDocumentPanelOpen}
        />
      ) : (
        <FilesTable
          hiddenFilters={props.hiddenFilters}
          nextPage={nextPage || null}
          documents={enhancedFilesFlow ? attachments : documents}
          onReachingEnd={getNextDocuments}
          hasMoreDocuments={
            enhancedFilesFlow ? nextPageToken != null : nextPage != null
          }
          issueId={props.issueId}
          showPlayerColumn={showPlayerFilter}
          setShowArchiveModal={setShowArchiveModal}
          setSelectedRow={setSelectedRow}
          showActions
          allAttachmentsChecked={allAttachmentsChecked}
          updateAllAttachments={updateAllAttachments}
          exportAttachments={exportAttachments}
          updateAttachment={updateSingleAttachment}
          permissions={permissions}
          requestStatus={requestStatus}
          setIsPanelOpen={setIsAddMedicalDocumentPanelOpen}
          setIsEditing={setIsEditing}
        />
      )}
      {isMedicalGlobalAddButtonFix && props.scopeToLevel === 'issue' && (
        <MedicalSidePanels
          athleteId={props.athleteId}
          athleteData={props.athleteData}
          issueId={props.issueId}
          reloadAthleteData={props.reloadAthleteData}
          isMedicalFilePanelOpen={props.isMedicalFilePanelOpen}
          setIsMedicalFilePanelOpen={props.setIsMedicalFilePanelOpen}
          hideMedicalFilesSidePanel
        />
      )}
      <AddMedicalFileSidePanel
        isPanelOpen={
          isMedicalGlobalAddButtonFix
            ? props.isMedicalFilePanelOpen || isAddMedicalDocumentPanelOpen
            : isAddMedicalDocumentPanelOpen
        }
        setIsPanelOpen={(value) => {
          if (isMedicalGlobalAddButtonFix && props.setIsMedicalFilePanelOpen) {
            props.setIsMedicalFilePanelOpen(value);
          }
          setIsAddMedicalDocumentPanelOpen(value);
        }}
        disablePlayerSelection={!!showPlayerFilter}
        athleteId={props.athleteId}
        issueId={props.issueId}
        getDocuments={buildDocuments}
        toastAction={toastDispatch}
        toasts={toasts}
        selectedFile={selectedRow}
        clearSelectedFile={() => {
          setIsEditing(false);
          setSelectedRow(null);
        }}
        isEditing={isEditing}
      />
      {window.featureFlags['medical-mass-scanning'] &&
        showMassScanningModal && (
          <MassScanningModal
            athleteId={props.athleteId}
            isOpen={showMassScanningModal}
            onClose={() => {
              setShowMassScanningModal(false);
            }}
            onSavedSuccess={buildDocuments}
            toastAction={toastDispatch}
          />
        )}
      {selectedRow && (
        <ArchiveFileModalContainer
          isOpen={showArchiveModal}
          setShowArchiveModal={setShowArchiveModal}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          getDocuments={buildDocuments}
          toastAction={toastDispatch}
          toasts={toasts}
        />
      )}
      <ExportWarningModal
        openModal={warningModalOpen}
        supportedFileTypesNames={supportedFileTypesNames}
        setOpenModal={setWarningModalOpen}
        numExcludedFiles={numExcludedFiles}
        selectedExports={exportAttachments}
        onExport={exportDocuments}
      />
      <Toasts />
      <ToastDialog toasts={exportProps.toasts} onCloseToast={closeToast} />
    </div>
  );
};

export default MedicalDocumentsTab;
