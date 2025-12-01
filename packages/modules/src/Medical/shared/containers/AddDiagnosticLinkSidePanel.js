import { useSelector, useDispatch } from 'react-redux';
import { closeAddDiagnosticLinkSidePanel } from '../redux/actions';
import { AddDiagnosticLinkSidePanelTranslated as AddDiagnosticLinkSidePanel } from '../components/AddDiagnosticLinkSidePanel';

const AddDiagnosticLinkSidePanelContainer = (props) => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state) => state.addDiagnosticLinkSidePanel?.isOpen
  );
  const diagnosticId = useSelector(
    (state) => state.addDiagnosticLinkSidePanel?.diagnosticId
  );
  const athleteId = useSelector(
    (state) => state.addDiagnosticLinkSidePanel?.athleteId
  );
  return (
    <AddDiagnosticLinkSidePanel
      {...props}
      diagnosticId={diagnosticId}
      athleteId={athleteId}
      isOpen={isOpen}
      onClose={() => dispatch(closeAddDiagnosticLinkSidePanel())}
    />
  );
};

export default AddDiagnosticLinkSidePanelContainer;
