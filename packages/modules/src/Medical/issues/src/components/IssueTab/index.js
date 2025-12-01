// @flow
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { AppStatus, LineLoader } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { saveIssue } from '@kitman/services';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import { useIssue } from '@kitman/modules/src/Medical/shared/contexts/IssueContext';
import { getInvalidFields } from '@kitman/modules/src/Medical/issues/src/utils';

import { IssueDetailsTranslated as IssueDetails } from '@kitman/modules/src/Medical/issues/src/components/IssueDetails';
import { IssueHeaderTranslated as IssueHeader } from '@kitman/modules/src/Medical/issues/src/components/IssueHeader';
import { AdditionalInformationTranslated as AdditionalInformation } from '@kitman/modules/src/Medical/issues/src/components/AdditionalInformation';
import { ActiveModificationsTranslated as ActiveModifications } from '@kitman/modules/src/Medical/issues/src/components/ActiveModifications';
import AvailabilityHistory from '@kitman/modules/src/Medical/issues/src/containers/AvailabilityHistory';
import { WorkersCompTranslated as WorkersComp } from '@kitman/modules/src/Medical/issues/src/components/WorkersComp';
import { OshaCardTranslated as OshaCard } from '@kitman/modules/src/Medical/issues/src/components/OshaCard';
import { EventDetailsTranslated as EventDetails } from '@kitman/modules/src/Medical/issues/src/components/EventDetails';
import useIssueFields from '@kitman/modules/src/Medical/shared/hooks/useIssueFields';
import {
  useIssueTabRequestStatus,
  IssueTabRequestStatusContextProvider,
} from '@kitman/modules/src/Medical/issues/src/hooks/useIssueTabRequestStatus';
import AddDiagnosticSidePanel from '@kitman/modules/src/Medical/shared/containers/AddDiagnosticSidePanel';
import AddMedicalNoteSidePanel from '@kitman/modules/src/Medical/shared/containers/AddMedicalNoteSidePanel';
import AddMedicalAlertSidePanel from '@kitman/modules/src/Medical/shared/containers/AddMedicalAlertSidePanel';
import AddModificationSidePanel from '@kitman/modules/src/Medical/shared/containers/AddModificationSidePanel';
import AddAllergySidePanel from '@kitman/modules/src/Medical/shared/containers/AddAllergySidePanel';
import AddProcedureSidePanel from '@kitman/modules/src/Medical/shared/containers/AddProcedureSidePanel';
import AddTreatmentsSidePanel from '@kitman/modules/src/Medical/shared/containers/AddTreatmentsSidePanel';
import AddTUESidePanel from '@kitman/modules/src/Medical/shared/containers/AddTUESidePanel';
import AddWorkersCompSidePanelContainer from '@kitman/modules/src/Medical/shared/containers/AddWorkersCompSidePanelContainer';
import AddOshaFormSidePanelContainer from '@kitman/modules/src/Medical/shared/containers/AddOshaFormSidePanelContainer';
import useModificationNotes from '@kitman/modules/src/Medical/shared/hooks/useModificationNotes';
import {
  getModificationNotesFilter,
  isInfoEvent,
} from '@kitman/modules/src/Medical/shared/utils';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import { AttachmentsTranslated as Attachments } from '@kitman/modules/src/Medical/issues/src/components/Attachments';
import LinkedIssues from '@kitman/modules/src/Medical/issues/src/containers/LinkedIssues';
import type { IssueLink } from '@kitman/modules/src/Medical/rosters/src/redux/types/actions';
import { PlayerLeftFormTranslated as PlayerLeftForm } from '@kitman/modules/src/Medical/issues/src/components/PlayerLeftForm';
import LinkedChronicIssues from '@kitman/modules/src/Medical/issues/src/containers/LinkedChronicIssues';
import { WorkersCompSubmitModalTranslated as WorkersCompSubmitModal } from '@kitman/modules/src/Medical/issues/src/components/WorkersComp/WorkersCompSubmitModal';
import AddMedicalDocumentSidePanel from '@kitman/modules/src/Medical/shared/containers/AddMedicalDocumentSidePanel';
import AddMedicalFileSidePanel from '@kitman/modules/src/Medical/shared/containers/AddMedicalFileSidePanel';
import MedicalSidePanels from '@kitman/modules/src/Medical/shared/containers/MedicalSidePanels';
import OshaPrintView from '@kitman/modules/src/Medical/issues/src/components/OshaCard/PrintView';
import WorkersCompPrintView from '@kitman/modules/src/Medical/issues/src/components/WorkersComp/PrintView';

const mainContentMargin = '1rem';
const sidebarWidth = '434px';
const style = {
  issueTab: {
    display: 'flex',
  },
  mainContent: {
    flex: 1,
    marginRight: mainContentMargin,

    '> section': {
      marginBottom: mainContentMargin,
    },
  },
  sidebar: {
    maxWidth: sidebarWidth,
    minWidth: sidebarWidth,
  },
  sectionLoader: {
    top: 0,
    height: '4px',
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
  },
};

type Props = {
  athleteId: number,
  athleteData: AthleteData,
  reloadData: (boolean) => void,
  issueId: string | null,
  isMedicalDocumentPanelOpen: boolean,
  setIsMedicalDocumentPanelOpen: (boolean) => void,
  isMedicalFilePanelOpen: boolean,
  setIsMedicalFilePanelOpen: (boolean) => void,
};

const IssuesTab = (props: Props) => {
  const { featureFlags } = window;
  const { permissions } = usePermissions();
  const { organisation } = useOrganisation();
  const { issueType, issue, updateIssue, isReadOnly, isContinuationIssue } =
    useIssue();

  const { updateIssueTabRequestStatus } = useIssueTabRequestStatus();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const issueAttachedLinks = issue.attached_links ? issue.attached_links : [];
  const [activeMembers, setActiveMembers] = useState<Set<string>>(new Set()); // Used to track enabled Members within the active Group. Example: ['eventIssue-IssueHeader']

  const isEventIssueDisabled = Array.from(activeMembers).some(
    (key) => !key.startsWith('eventIssue')
  );
  const isAdditionalInfoDisabled = Array.from(activeMembers).some(
    (key) => !key.startsWith('additionalInfo')
  );

  const { toasts, toastDispatch } = useToasts();

  const { modificationNotes, fetchModificationNotes, expireModificationNote } =
    useModificationNotes({
      withPagination: false,
    });

  const filters = getModificationNotesFilter({
    athleteId: props.athleteId || null,
    isModification: true,
  });

  const getModifications = () => {
    setRequestStatus('PENDING');

    fetchModificationNotes({ ...filters, unexpired: true }, true)
      .then(() => setRequestStatus('SUCCESS'))
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  useEffect(() => {
    if (permissions.medical.modifications.canView) {
      getModifications();
    }
  }, []);

  const deactivateModification = (modificationId: number) => {
    expireModificationNote(modificationId)
      .then(() => getModifications())
      .catch(() => setRequestStatus('FAILURE'));
  };

  const updateIssueInfo = (key: string, value: IssueLink[]): void => {
    updateIssueTabRequestStatus('PENDING');

    saveIssue(issueType, issue, { [key]: value })
      .then((updatedIssue) => {
        setRequestStatus(null);
        updateIssue(updatedIssue);
        updateIssueTabRequestStatus('DORMANT');
      })
      .catch(() => {
        setRequestStatus('FAILURE');
        updateIssueTabRequestStatus('DORMANT');
      });
  };

  const shouldShowOshaPrintPreview = Object.values(
    useSelector((state) => state.addOshaFormSidePanel.showPrintPreview)
  ).some((hasPrintPreview) => hasPrintPreview);
  const shouldRenderOsha =
    featureFlags['osha-form'] && issue.osha && permissions.medical.osha.canView;

  const shouldShowWorkersCompPrintPreview = Object.values(
    useSelector((state) => state.addWorkersCompSidePanel.showPrintPreview)
  ).some((hasPrintPreview) => hasPrintPreview);
  const shouldRenderWorkersComp =
    (featureFlags['workers-comp'] || window.getFlag('pm-mls-emr-demo-froi')) &&
    issue.workers_comp &&
    permissions.medical.workersComp.canView;

  const sideName = useSelector(
    (state) => state.addWorkersCompSidePanel.claimInformation.sideName
  );
  const bodyAreaName = useSelector(
    (state) => state.addWorkersCompSidePanel.claimInformation.bodyAreaName
  );

  const { validate, fieldConfigRequestStatus } = useIssueFields({
    issueType: issueType === 'Injury' ? 'injury' : 'illness',
    skip: false,
  });

  const invalidFields = useMemo(() => {
    const fields = getInvalidFields(
      organisation,
      issue,
      issueType,
      isContinuationIssue
    );

    return validate(fields, 'full');
  }, [issue, issueType, validate]);

  // LOGIC behind the below
  /**
   * Issue Owner | Player ORG IDS | ORG Context | player_left_club VALUE | <PlayerLeftForm/>     | BUTTONS |
   * ____________|________________|_____________|________________________|_______________________|_________|
   * United      | [ Madrid ]     | Madrid      |         TRUE           | RENDERED              | HIDDEN  | D
   * United      | [ Madrid ]     | United      |      TRUE | FALSE      | RENDERED              | VISIBLE | E
   * Madrid      | [ United ]     | United      |         TRUE           | RENDERED              | HIDDEN  | F
   * United      | [ United ]     | United      |          N/A           | NOT RENDERED          | HIDDEN  | A
   * Madrid      | [ United ]     | United      |         FALSE          | NOT RENDERED          | HIDDEN  | B
   * United      | [ Madrid ]     | Madrid      |         FALSE          | NOT RENDERED          | HIDDEN  | C
   */

  const isPlayerInCurrentOrg = props.athleteData?.organisation_ids?.includes(
    issue.organisation_id
  );

  const isIssueOwnedByOrg = issue.organisation_id === organisation.id;

  const playerLeftClub = issue.player_left_club;

  const shouldRenderPlayerLeftForm = () => {
    const allowPlayerLeftEditingForClosedIssue = window.getFlag(
      'medical-closed-issue-plc-editing'
    );

    if (issue.closed && !allowPlayerLeftEditingForClosedIssue) {
      return false;
    }

    const allowModifyPlayerLeftClub = window.getFlag(
      'modifiable-player-left-club'
    );

    if (
      isIssueOwnedByOrg &&
      isPlayerInCurrentOrg &&
      allowModifyPlayerLeftClub &&
      featureFlags['display-plc-for-all-injuries'] &&
      fieldConfigRequestStatus &&
      fieldConfigRequestStatus !== 'PENDING'
    ) {
      return true;
    }

    if (
      isIssueOwnedByOrg &&
      isPlayerInCurrentOrg &&
      playerLeftClub &&
      allowModifyPlayerLeftClub
    ) {
      return true;
    }
    if (
      isIssueOwnedByOrg &&
      isPlayerInCurrentOrg &&
      !playerLeftClub &&
      !allowModifyPlayerLeftClub
    ) {
      return false;
    }

    if (
      isIssueOwnedByOrg &&
      isPlayerInCurrentOrg &&
      !allowPlayerLeftEditingForClosedIssue
    ) {
      return false;
    }

    if (!isIssueOwnedByOrg && isPlayerInCurrentOrg && !issue.player_left_club) {
      return false;
    }

    if (
      !isIssueOwnedByOrg &&
      !isPlayerInCurrentOrg &&
      !issue.player_left_club
    ) {
      return false;
    }
    return true;
  };

  const canDeactivateModification = () => {
    if (isReadOnly) return false;
    return permissions.medical.modifications.canEdit;
  };

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  const shouldRenderLinkedChronicIssue = () => {
    return (
      issue.has_recurrence && !!window.featureFlags['chronic-injury-illness']
    );
  };

  // Toggles a Group's edit functionality when the other Group has a Member enter edit mode
  const handleGroupClick = (groupName: string, groupMemberName: string) => {
    const memberKey = `${groupName}-${groupMemberName}`;
    setActiveMembers((currentActiveMembers) => {
      const newActiveMembers = new Set(currentActiveMembers);

      // If already active, deactivate it
      if (newActiveMembers.has(memberKey)) {
        newActiveMembers.delete(memberKey);
      } else {
        // If not active, activate it
        newActiveMembers.add(memberKey);
      }
      return newActiveMembers;
    });
  };

  return (
    <IssueTabRequestStatusContextProvider>
      <div css={style.issueTab}>
        {requestStatus === 'PENDING' && (
          <div data-testid="IssueTab|SectionLoader" css={[style.sectionLoader]}>
            <LineLoader />
          </div>
        )}
        <div css={style.mainContent}>
          <IssueHeader
            athleteData={props.athleteData}
            editActionDisabled={isEventIssueDisabled}
            onEnterEditMode={() =>
              handleGroupClick('eventIssue', 'IssueHeader')
            }
          />
          <IssueDetails
            athleteData={props.athleteData}
            editActionDisabled={isEventIssueDisabled}
            onEnterEditMode={() =>
              handleGroupClick('eventIssue', 'IssueDetails')
            }
          />

          {issueType === 'Injury' && (
            <EventDetails
              organisation={organisation}
              athleteData={props.athleteData}
              editActionDisabled={isEventIssueDisabled}
              onEnterEditMode={() =>
                handleGroupClick('eventIssue', 'EventDetails')
              }
            />
          )}
          {permissions.medical.modifications.canView &&
            modificationNotes.length > 0 && (
              <ActiveModifications
                isLoading={requestStatus === 'PENDING'}
                modifications={modificationNotes}
                deactivateModification={deactivateModification}
                canDeactivate={canDeactivateModification()}
              />
            )}
          {featureFlags['conditional-fields-showing-in-ip'] &&
            !featureFlags['conditional-fields-v1-stop'] &&
            !isContinuationIssue &&
            isInfoEvent(issue.activity_type) && (
              <AdditionalInformation
                editActionDisabled={isAdditionalInfoDisabled}
                onEnterEditMode={() =>
                  handleGroupClick('additionalInfo', 'AdditionalInformation1')
                }
              />
            )}
          {featureFlags['conditional-fields-showing-in-ip'] &&
            featureFlags['conditional-fields-v1-stop'] &&
            !isContinuationIssue && (
              <AdditionalInformation
                editActionDisabled={isAdditionalInfoDisabled}
                onEnterEditMode={() =>
                  handleGroupClick('additionalInfo', 'AdditionalInformation2')
                }
              />
            )}
        </div>
        <div css={style.sidebar}>
          {shouldRenderWorkersComp && <WorkersComp />}

          {shouldRenderWorkersComp && shouldShowWorkersCompPrintPreview && (
            <WorkersCompPrintView
              issue={issue}
              side={sideName}
              bodyArea={bodyAreaName}
            />
          )}

          {shouldRenderOsha && <OshaCard />}

          {shouldRenderOsha && shouldShowOshaPrintPreview && (
            <OshaPrintView issue={issue} />
          )}

          {featureFlags['nfl-player-movement-trade'] &&
            shouldRenderPlayerLeftForm() && (
              <PlayerLeftForm
                issueHasOutstandingFields={invalidFields.length}
                playerTransferRecord={
                  props.athleteData.org_last_transfer_record
                }
                athleteData={props.athleteData}
              />
            )}
          <AvailabilityHistory athleteData={props.athleteData} />
          {featureFlags['linked-injury-illness-performance-medicine'] && (
            <LinkedIssues athleteId={props.athleteId} />
          )}
          {shouldRenderLinkedChronicIssue() && (
            <LinkedChronicIssues athleteId={props.athleteId} />
          )}
          {featureFlags['files-and-links-on-injuries'] && (
            <Attachments
              attachedLinks={issueAttachedLinks}
              onSave={updateIssueInfo}
            />
          )}
        </div>
        {featureFlags['medical-global-add-button-fix'] ? (
          <MedicalSidePanels
            athleteId={props.athleteId}
            athleteData={props.athleteData}
            issueId={props.issueId}
            reloadAthleteData={props.reloadData}
            isMedicalDocumentPanelOpen={props.isMedicalDocumentPanelOpen}
            setIsMedicalDocumentPanelOpen={props.setIsMedicalDocumentPanelOpen}
            isMedicalFilePanelOpen={props.isMedicalFilePanelOpen}
            setIsMedicalFilePanelOpen={props.setIsMedicalFilePanelOpen}
            onSidePanelAction={getModifications}
          />
        ) : (
          <>
            <AddDiagnosticSidePanel athleteId={props.athleteId} />
            <AddMedicalNoteSidePanel athleteId={props.athleteId} />
            <AddModificationSidePanel
              athleteId={props.athleteId}
              onSaveModification={getModifications}
            />
            <AddAllergySidePanel
              athleteId={props.athleteId}
              enableReloadData={props.reloadData}
            />
            <AddMedicalAlertSidePanel
              athleteId={props.athleteId}
              enableReloadData={props.reloadData}
            />
            <AddProcedureSidePanel athleteId={props.athleteId} />
            <AddTreatmentsSidePanel athleteId={props.athleteId} />
            {window.getFlag('pm-show-tue') && (
              <AddTUESidePanel athleteId={props.athleteId} />
            )}
            <AddWorkersCompSidePanelContainer athleteData={props.athleteData} />
            <WorkersCompSubmitModal />
            <AddOshaFormSidePanelContainer athleteData={props.athleteData} />
            {permissions.medical.documents.canCreate && (
              <AddMedicalDocumentSidePanel
                isPanelOpen={props.isMedicalDocumentPanelOpen}
                setIsPanelOpen={props.setIsMedicalDocumentPanelOpen}
                disablePlayerSelection={false}
                athleteId={props.athleteId}
                issueId={props.issueId}
              />
            )}
            {permissions.medical.documents.canCreate && (
              <AddMedicalFileSidePanel
                isPanelOpen={props.isMedicalFilePanelOpen}
                setIsPanelOpen={props.setIsMedicalFilePanelOpen}
                disablePlayerSelection
                athleteId={props.athleteId}
                issueId={props.issueId}
                toastAction={toastDispatch}
                toasts={toasts}
              />
            )}
          </>
        )}
      </div>
    </IssueTabRequestStatusContextProvider>
  );
};

export default IssuesTab;
