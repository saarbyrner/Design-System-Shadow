// @flow
import { useDispatch, useSelector } from 'react-redux';
import { ManageLinksInformation } from '@kitman/components';
import { updateIssueLinks } from '../redux/actions';
import type { IssueLink } from '../redux/types/actions';

type Props = {
  onRemove: Function,
};

export default (props: Props) => {
  const { onRemove } = props;

  const dispatch = useDispatch();
  const issueLinks = useSelector(
    (state) => state.addIssuePanel.additionalInfo.issueLinks
  );

  const addLink = (value: IssueLink[]) => dispatch(updateIssueLinks(value));

  const removeIssueLink = (link: IssueLink) => {
    const filteredLinks = issueLinks.filter(
      (currLink) => currLink.title !== link.title
    );
    dispatch(updateIssueLinks(filteredLinks));
  };

  const resetLinks = () => dispatch(updateIssueLinks([]));

  return (
    <ManageLinksInformation
      visibleHeader
      onRemove={onRemove}
      currentLinks={issueLinks}
      onAddLink={addLink}
      onRemoveLink={removeIssueLink}
      resetLinks={resetLinks}
    />
  );
};
