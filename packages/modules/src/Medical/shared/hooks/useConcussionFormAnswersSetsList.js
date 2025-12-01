// @flow
import { useState, useEffect } from 'react';
import { getConcussionFormAnswersSetsList } from '@kitman/services';
import i18n from '@kitman/common/src/utils/i18n';
import type {
  FormSummary,
  FormAnswerSet,
  Baselines,
  BaselinesRoster,
  FormAnswersSetsFilter,
} from '../types/medical';
import type { RequestStatus } from '../types';

const useConcussionFormAnswersSetsList = (
  formAnswersSetsFilter: FormAnswersSetsFilter
) => {
  const [concussionFormAnswersSetsList, setConcussionFormAnswersSetsList] =
    useState<Array<FormAnswerSet> | BaselinesRoster>([]);

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  const [concussionSummaryList, setConcussionSummaryList] = useState<
    Array<FormSummary>
  >([]);

  const outstandingValues = {
    id: null,
    status: {
      description: i18n.t('Outstanding', {
        context: 'Unresolved, not dealt with',
      }),
      key: 'outstanding',
      completionDate: null,
      expiryDate: null,
    },
    formTypeFullName: null,
    completionDate: null,
    editorFullName: '-',
    expiryDate: null,
  };

  const convertFormAnswerToBaselineFormSummary = (
    answerSetsList: BaselinesRoster
  ): Array<FormSummary> => {
    const convertFromAnswerSets = [];
    if (answerSetsList.athlete_baselines) {
      answerSetsList.athlete_baselines.forEach((answerSet: Baselines) => {
        const baselineRowAnswer = {};
        baselineRowAnswer.athlete = answerSet.athlete;
        answerSet.baselines.forEach((baseline) => {
          baselineRowAnswer[baseline.group] = baseline.status;
          baselineRowAnswer[baseline.group].completionDate =
            baseline.date_completed;
          baselineRowAnswer[baseline.group].expiryDate = baseline.expiry_date;
        });
        convertFromAnswerSets.push(baselineRowAnswer);
      });
    }
    return convertFromAnswerSets;
  };

  const convertFormAnswerSetToFormSummary = (
    answerSetsList: Array<FormAnswerSet>
  ): Array<FormSummary> => {
    const convertFromAnswerSets = [];
    answerSetsList.forEach((answerSet: FormAnswerSet) => {
      if (answerSet.baselines) {
        answerSet.baselines.forEach((baseline, index) => {
          if (baseline.status.key === 'outstanding') {
            convertFromAnswerSets.push({
              ...outstandingValues,
              id: `baseline_outstanding_${
                answerSet.athlete?.id || 'unknown'
              }_${index}`,
              formType: baseline.test,
            });
          } else {
            convertFromAnswerSets.push({
              id: baseline.form_id,
              formType: baseline.test,
              formTypeFullName: null,
              status: baseline.status,
              completionDate: baseline.date_completed,
              editorFullName: baseline.examiner,
              expiryDate: baseline.expiry_date,
              athlete: answerSet.athlete,
            });
          }
        });
      } else if (!answerSet.baselines) {
        convertFromAnswerSets.push({
          id: answerSet.id,
          formType: answerSet.form.name,
          formTypeFullName: answerSet.form.fullname,
          status: answerSet.status,
          completionDate: answerSet.date,
          editorFullName: answerSet.editor.fullname,
          concussionDiagnosed: answerSet.concussion_diagnosed,
          linkedIssue: answerSet.concussion_injury,
          expiryDate: answerSet.expiry_date,
          athlete: answerSet.athlete,
        });
      }
    });
    return convertFromAnswerSets;
  };

  const fetchConcussionFormAnswersSetsList = (
    filter: FormAnswersSetsFilter
  ): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) =>
      getConcussionFormAnswersSetsList(filter).then(
        (answerSetsList: Array<FormAnswerSet> | BaselinesRoster) => {
          if (Array.isArray(answerSetsList)) {
            setConcussionSummaryList(
              convertFormAnswerSetToFormSummary(answerSetsList)
            );
          } else {
            setConcussionSummaryList(
              convertFormAnswerToBaselineFormSummary(answerSetsList)
            );
          }
          setConcussionFormAnswersSetsList(answerSetsList);
          setRequestStatus('SUCCESS');
          setIsLoading(false);
          resolve();
        },
        () => {
          setRequestStatus('FAILURE');
          setIsLoading(false);
          reject();
        }
      )
    );

  const lazyLoadMoreConcussionFormAnswersSetsList = (
    filter: FormAnswersSetsFilter
  ): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) =>
      getConcussionFormAnswersSetsList(filter).then(
        (answerSetsList: Array<FormAnswerSet> | BaselinesRoster) => {
          if (!Array.isArray(answerSetsList)) {
            if (
              answerSetsList.meta.current_page ===
              answerSetsList.meta.total_pages
            ) {
              setIsFullyLoaded(true);
            }
            const loadedBaselines =
              convertFormAnswerToBaselineFormSummary(answerSetsList);
            setConcussionSummaryList(
              concussionSummaryList.concat(loadedBaselines)
            );
            setConcussionFormAnswersSetsList(answerSetsList);
            setIsLoading(false);
            resolve();
          }
        },
        () => {
          setRequestStatus('FAILURE');
          setIsLoading(false);
          reject();
        }
      )
    );

  useEffect(() => {
    setRequestStatus('PENDING');
    setIsLoading(false);
    fetchConcussionFormAnswersSetsList(formAnswersSetsFilter);
  }, [
    formAnswersSetsFilter.athleteId,
    formAnswersSetsFilter.category,
    formAnswersSetsFilter.group,
    formAnswersSetsFilter.formType,
  ]);

  useEffect(() => {
    if (
      isFullyLoaded ||
      formAnswersSetsFilter.page === 1 ||
      !formAnswersSetsFilter.page
    ) {
      return;
    }
    setIsLoading(true);
    lazyLoadMoreConcussionFormAnswersSetsList(formAnswersSetsFilter);
  }, [formAnswersSetsFilter.page]);

  return {
    concussionSummaryList,
    concussionFormAnswersSetsList,
    fetchConcussionFormAnswersSetsList,
    requestStatus,
    isLoading,
    isFullyLoaded,
  };
};

export default useConcussionFormAnswersSetsList;
