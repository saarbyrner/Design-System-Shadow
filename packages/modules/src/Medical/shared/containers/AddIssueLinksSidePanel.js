// @flow
import { useState } from 'react';
import { AddLinksSidePanelTranslated as AddLinksSidePanel } from '../components/AddLinksSidePanel';
import type { IssueLink } from '../../rosters/src/redux/types/actions';

type Props = {
  isOpen: boolean,
  onClose: () => void,
  onSave: (string, IssueLink[]) => void,
};

const AddIssueLinksSidePanel = (props: Props) => {
  const { onClose, onSave } = props;

  const [localIssueLinks, setLocalIssueLinks] = useState<IssueLink[]>([]);

  const addLink = (value: IssueLink[]) => setLocalIssueLinks(value);

  const removeLink = (link: IssueLink) => {
    const filteredLinks = localIssueLinks.filter(
      (currLink) => currLink.title !== link.title
    );
    setLocalIssueLinks(filteredLinks);
  };

  const resetLinks = () => setLocalIssueLinks([]);

  const onSaveLinks = () => {
    onSave('attached_links', localIssueLinks);
    onClose();
  };

  return (
    <AddLinksSidePanel
      {...props}
      panelTitle="Add Link to Injury/Illness"
      addLink={addLink}
      removeLink={removeLink}
      currentLinks={localIssueLinks}
      resetLinks={resetLinks}
      onSave={onSaveLinks}
    />
  );
};

export default AddIssueLinksSidePanel;
