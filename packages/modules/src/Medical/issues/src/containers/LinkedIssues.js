// @flow
import { useGetAthleteIssuesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { LinkedIssuesTranslated as LinkedIssues } from '@kitman/modules/src/Medical/issues/src/components/LinkedIssues';

type Props = {
  athleteId: number,
};

export default (props: Props) => {
  const { data = { closed_issues: [], open_issues: [] }, isLoading } =
    useGetAthleteIssuesQuery({
      athleteId: props.athleteId,
      // Workaround fix to stay consistent with the data on issues tab listing until
      // product team devise new design changes.
      issuesPerPage: 100,
      grouped: true,
    });

  return <LinkedIssues allAthleteIssues={data} isLoadingIssues={isLoading} />;
};
