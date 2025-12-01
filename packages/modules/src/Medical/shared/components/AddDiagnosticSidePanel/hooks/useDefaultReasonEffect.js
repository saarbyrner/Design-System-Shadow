// @flow
import { useEffect } from 'react';
import type { Dispatch } from '@kitman/common/src/types';
import type { EnrichedAthleteIssue } from '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues';
import type { FormAction } from './useDiagnosticForm';

type Params = {
  isEditing: boolean,
  athleteId: ?number,
  enrichedAthleteIssues: Array<EnrichedAthleteIssue>,
  issueId: mixed,
  injuryIllnessReasonId: mixed,
  dispatch: Dispatch<FormAction>,
};

const useDefaultReasonEffect = ({
  isEditing,
  athleteId,
  enrichedAthleteIssues,
  issueId,
  injuryIllnessReasonId,
  dispatch,
}: Params) => {
  useEffect(() => {
    if (!isEditing) {
      const hasAssociations = Boolean(
        (enrichedAthleteIssues[0]?.options || []).length > 0 ||
          (enrichedAthleteIssues[1]?.options || []).length > 0 ||
          (enrichedAthleteIssues[2]?.options || []).length > 0 ||
          issueId
      );
      dispatch({
        type: 'SET_REASON_ID',
        reasonId: hasAssociations ? (injuryIllnessReasonId: any) : (null: any),
      });
    }
  }, [
    athleteId,
    enrichedAthleteIssues,
    isEditing,
    issueId,
    injuryIllnessReasonId,
  ]);
};

export default useDefaultReasonEffect;
