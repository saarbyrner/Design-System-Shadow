// @flow
import { useState, useEffect } from 'react';
import { getConcussionInjuryList } from '@kitman/services';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import type { ConcussionFilters } from '../types/medical';
import type {
  ConcussionIssue,
  RequestStatus,
  ConcussionInjurySummary,
  ConcussionSelectOptions,
} from '../types';

const useConcussionInjuryResults = (concussionFilters: ConcussionFilters) => {
  const [concussionInjuryResults, setConcussionInjuryResults] = useState<
    Array<ConcussionIssue>
  >([]);

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');

  const [concussionInjurySummaryList, setConcussionInjurySummaryList] =
    useState<Array<ConcussionInjurySummary>>([]);

  const [concussionSelectOptions, setConcussionSelectOptions] = useState<
    Array<ConcussionSelectOptions>
  >([]);

  const convertFormAnswerSetToFormSummary = (
    answerSetsList: Array<ConcussionIssue>
  ): Array<ConcussionInjurySummary> => {
    return answerSetsList.map((answerSet) => ({
      id: answerSet.id,
      occurrenceDate: answerSet.occurrence_date,
      issue: answerSet.full_pathology,
      closed: answerSet.closed,
      status: answerSet.injury_status,
      resolutionDate: answerSet.resolved_date,
      athlete: answerSet.athlete,
      unavailableDuration: answerSet.unavailability_duration,
    }));
  };

  const convertFormAnswerSetSelectOptions = (
    answerSetsList: Array<ConcussionIssue>
  ): Array<ConcussionSelectOptions> => {
    return answerSetsList.map((answerSet) => ({
      value: answerSet.id,
      label: `${answerSet.full_pathology} - ${DateFormatter.formatStandard({
        date: moment(answerSet.occurrence_date),
      })}`,
    }));
  };

  const fetchConcussionInjuryResults = (
    filter: ConcussionFilters
  ): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) =>
      getConcussionInjuryList(filter).then(
        (answerSetsList: Array<ConcussionIssue>) => {
          setConcussionInjurySummaryList(
            convertFormAnswerSetToFormSummary(answerSetsList)
          );
          setConcussionSelectOptions(
            convertFormAnswerSetSelectOptions(answerSetsList)
          );
          setConcussionInjuryResults(answerSetsList);
          setRequestStatus('SUCCESS');
          resolve();
        },
        () => {
          setRequestStatus('FAILURE');
          reject();
        }
      )
    );

  useEffect(() => {
    fetchConcussionInjuryResults(concussionFilters);
  }, [concussionFilters.athleteId]);

  return {
    concussionInjurySummaryList,
    concussionInjuryResults,
    concussionSelectOptions,
    fetchConcussionInjuryResults,
    requestStatus,
    setRequestStatus,
  };
};

export default useConcussionInjuryResults;
