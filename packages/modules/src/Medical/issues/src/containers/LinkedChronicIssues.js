// @flow
import { getAthleteChronicIssues } from '@kitman/services';
import { useEffect, useState } from 'react';
import type { ChronicIssues } from '@kitman/services/src/services/medical/getAthleteChronicIssues';
import { LinkedChronicIssuesTranslated as LinkedChronicIssues } from '@kitman/modules/src/Medical/issues/src/components/LinkedChronicIssues';

type Props = {
  athleteId: number,
};

const useChronicIssues = (athleteId) => {
  const [chronicIssues, setChronicIssues] = useState<ChronicIssues>([]);
  const [isChronicIssuesLoading, setIsChronicIssuesLoading] =
    useState<boolean>(false);

  useEffect(() => {
    if (athleteId !== null) {
      setIsChronicIssuesLoading(true);
      getAthleteChronicIssues({ athleteId })
        .then((fetchedIssues) => {
          // $FlowFixMe Flow(prop-missing)
          setChronicIssues(fetchedIssues);
        })
        .finally(() => {
          setIsChronicIssuesLoading(false);
        });
    }
  }, [athleteId]);

  return { chronicIssues, isChronicIssuesLoading };
};

export default (props: Props) => {
  const { chronicIssues, isChronicIssuesLoading } = useChronicIssues(
    props.athleteId
  );

  return (
    <LinkedChronicIssues
      athleteId={props.athleteId}
      chronicIssues={chronicIssues}
      isLoading={isChronicIssuesLoading}
    />
  );
};
