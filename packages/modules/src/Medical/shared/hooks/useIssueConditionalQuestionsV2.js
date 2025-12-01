// @flow
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import { getConditionsContext } from '@kitman/modules/src/ConditionalFields/shared/utils';
import type { ConditionWithQuestions } from '../../../ConditionalFields/shared/types';

import { useGetConditionalFieldsFormQuery } from '../redux/services/medical';

export default (
  issue: IssueOccurrenceRequested
): { conditions: Array<ConditionWithQuestions> } => {
  const {
    data: conditionsResponse = { conditions: [] },
    isLoading: issueConditionsLoading,
    isError: issueConditionsError,
  } = useGetConditionalFieldsFormQuery(issue && getConditionsContext(issue), {
    skip:
      !window.featureFlags['conditional-fields-v1-stop'] ||
      (window.featureFlags['conditional-fields-v1-stop'] && !issue),
  });

  const { conditions } = conditionsResponse;

  return {
    conditions,
    issueConditionsLoading,
    issueConditionsError,
  };
};
