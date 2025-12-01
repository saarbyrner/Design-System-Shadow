import { useSelector, useDispatch } from 'react-redux';
import {
  closeAddProcedureAttachmentSidePanel,
  addToast,
  updateToast,
  removeToast,
} from '../redux/actions';
import { AddProcedureAttachmentSidePanelTranslated as AddProcedureAttachmentSidePanel } from '../components/AddProcedureAttachmentSidePanel';

const AddProcedureAttachmentSidePanelContainer = (props) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state) => state.addProcedureAttachmentSidePanel.isOpen
  );

  const procedureId = useSelector(
    (state) => state.addProcedureAttachmentSidePanel.procedureId
  );

  const athleteId = useSelector(
    (state) => state.addProcedureAttachmentSidePanel.athleteId
  );

  return (
    <AddProcedureAttachmentSidePanel
      {...props}
      procedureId={procedureId}
      athleteId={athleteId}
      isOpen={isOpen}
      onClose={() => dispatch(closeAddProcedureAttachmentSidePanel())}
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

export default AddProcedureAttachmentSidePanelContainer;
