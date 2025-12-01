// @flow
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import AddDiagnosticSidePanel from './AddDiagnosticSidePanel';
import AddMedicalNoteSidePanel from './AddMedicalNoteSidePanel';
import AddMedicalAlertSidePanel from './AddMedicalAlertSidePanel';
import AddModificationSidePanel from './AddModificationSidePanel';
import AddAllergySidePanel from './AddAllergySidePanel';
import AddProcedureSidePanel from './AddProcedureSidePanel';
import AddTreatmentsSidePanel from './AddTreatmentsSidePanel';
import AddTUESidePanel from './AddTUESidePanel';
import AddWorkersCompSidePanelContainer from './AddWorkersCompSidePanelContainer';
import AddOshaFormSidePanelContainer from './AddOshaFormSidePanelContainer';
import AddMedicalDocumentSidePanel from './AddMedicalDocumentSidePanel';
import AddMedicalFileSidePanel from './AddMedicalFileSidePanel';
import { WorkersCompSubmitModalTranslated as WorkersCompSubmitModal } from '../../issues/src/components/WorkersComp/WorkersCompSubmitModal';

type Props = {
  athleteId?: number | null,
  athleteData?: AthleteData,
  issueId?: string | null,
  reloadAthleteData?: (boolean) => void,
  isMedicalDocumentPanelOpen?: boolean,
  setIsMedicalDocumentPanelOpen?: (boolean) => void,
  isMedicalFilePanelOpen?: boolean,
  setIsMedicalFilePanelOpen?: (boolean) => void,
  onSidePanelAction?: () => void,
  hideMedicalFilesSidePanel?: boolean,
};

const MedicalSidePanels = (props: Props) => {
  const { permissions } = usePermissions();
  const { toasts, toastDispatch } = useToasts();

  return (
    <>
      <AddDiagnosticSidePanel
        athleteId={props.athleteId}
        onSaveDiagnostic={props.onSidePanelAction}
      />
      <AddMedicalNoteSidePanel athleteId={props.athleteId} />
      <AddModificationSidePanel
        athleteId={props.athleteId}
        onSaveModification={props.onSidePanelAction}
      />
      <AddAllergySidePanel
        athleteId={props.athleteId}
        enableReloadData={props.reloadAthleteData}
      />
      <AddMedicalAlertSidePanel
        athleteId={props.athleteId}
        enableReloadData={props.reloadAthleteData}
      />
      <AddProcedureSidePanel
        athleteId={props.athleteId}
        onSaveProcedure={props.onSidePanelAction}
      />
      <AddTreatmentsSidePanel
        athleteId={props.athleteId}
        onSaveTreatment={props.onSidePanelAction}
      />
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
      {permissions.medical.documents.canCreate &&
        !props.hideMedicalFilesSidePanel && (
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
  );
};

export default MedicalSidePanels;
