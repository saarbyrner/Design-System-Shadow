// @flow
import { AddFileSidePanelTranslated as AddFileSidePanel } from '../components/AddFileSidePanel';
import type { UnuploadedFile } from '../components/AddTreatmentSidePanel/types';

type Props = {
  files: UnuploadedFile[],
  isOpen: boolean,
  onClose: Function,
  onSave: Function,
};

const AddIssueFileSidePanel = (props: Props) => {
  const onSave = (files) => {
    // TODO: API call to be integrated here.
    props.onSave(files);
    props.onClose();
  };

  return (
    <AddFileSidePanel
      {...props}
      panelTitle="Add File to Injury/Illness"
      onSave={onSave}
    />
  );
};

export default AddIssueFileSidePanel;
