import { useSelector, useDispatch } from 'react-redux';
import {
  closeAddDiagnosticAttachmentSidePanel,
  addToast,
  updateToast,
  removeToast,
} from '../redux/actions';
import { AddDiagnosticAttachmentSidePanelTranslated as AddDiagnosticAttachmentSidePanel } from '../components/AddDiagnosticAttachmentSidePanel';

const AddDiagnosticAttachmentSidePanelContainer = (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.addDiagnosticAttachmentSidePanel.isOpen
  );
  const diagnosticId = useSelector(
    (state) => state.addDiagnosticAttachmentSidePanel.diagnosticId
  );
  const athleteId = useSelector(
    (state) => state.addDiagnosticAttachmentSidePanel.athleteId
  );
  return (
    <AddDiagnosticAttachmentSidePanel
      {...props}
      diagnosticId={diagnosticId}
      athleteId={athleteId}
      isOpen={isOpen}
      onClose={() => dispatch(closeAddDiagnosticAttachmentSidePanel())}
      onFileUploadStart={(fileName, fileSize, fileId) =>
        dispatch(
          addToast({
            title: fileName,
            description: fileSize,
            status: 'LOADING',
            id: fileId,
          })
        )
      }
      onFileUploadSuccess={(fileId) => {
        dispatch(updateToast(fileId, { status: 'SUCCESS' }));
        setTimeout(() => dispatch(removeToast(fileId)), 5000);
      }}
      onFileUploadFailure={(fileId) =>
        dispatch(updateToast(fileId, { status: 'ERROR' }))
      }
    />
  );
};

export default AddDiagnosticAttachmentSidePanelContainer;
