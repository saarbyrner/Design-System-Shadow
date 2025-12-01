// @flow
import { useSelector, useDispatch } from 'react-redux';

import { setLinkedIssues } from '../redux/actions';
import { useGetAthleteIssuesQuery } from '../../../shared/redux/services/medical';
import { getSelectedAthlete } from '../redux/selectors/addIssueSidePanel';
import { LinkedIssuesTranslated as LinkedIssues } from '../components/AddIssueSidePanel/components/LinkedIssues';

type Props = {
  onRemove: Function,
};

export default (props: Props) => {
  const dispatch = useDispatch();
  const linkedIssues = useSelector(
    (state) => state.addIssuePanel.additionalInfo.linkedIssues
  );
  const selectedAthlete = useSelector(getSelectedAthlete);
  const { data = { closed_issues: [], open_issues: [] }, isLoading } =
    useGetAthleteIssuesQuery({
      athleteId: selectedAthlete,
      grouped: true,
    });

  return (
    <LinkedIssues
      allIssues={data}
      isLoadingIssues={isLoading}
      selectedLinkedIssues={linkedIssues}
      onSelectLinkedIllness={(value) =>
        dispatch(setLinkedIssues(value, 'Illness'))
      }
      onSelectLinkedInjury={(value) =>
        dispatch(setLinkedIssues(value, 'Injury'))
      }
      onRemove={props.onRemove}
    />
  );
};
