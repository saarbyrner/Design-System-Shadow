// @flow
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import _isEqual from 'lodash/isEqual';
import ConditionalFieldsForm from '../../../shared/components/ConditionalFieldsForm';
import {
  updateConditionalFieldsAnswers,
  fetchConditionalFields,
} from '../redux/actions';
import {
  getCodingSystemFromCoding,
  getIssueTypeValueFromSidePanel,
  isInfoEvent,
} from '../../../shared/utils';

export default () => {
  const dispatch = useDispatch();
  const conditionalFieldsAnswers = useSelector(
    (state) => state.addIssuePanel.additionalInfo.conditionalFieldsAnswers
  );
  const eventInfoEventType = useSelector(
    (state) => state.addIssuePanel.eventInfo.eventType
  );

  const conditions = useSelector((state) => {
    const addIssuePanel = state.addIssuePanel;
    const codingSystem = getCodingSystemFromCoding(
      addIssuePanel.diagnosisInfo.coding
    );

    return {
      activity_id: addIssuePanel.eventInfo.activity || null,
      activity_group_id: null,
      clinical_impression_code:
        addIssuePanel.diagnosisInfo.coding[
          codingSystemKeys.CLINICAL_IMPRESSIONS
        ]?.code || null,
      osics_classification_id:
        addIssuePanel.diagnosisInfo.coding[codingSystemKeys.OSICS_10]
          ?.osics_classification_id || null,
      osics_pathology_id:
        addIssuePanel.diagnosisInfo.coding[codingSystemKeys.OSICS_10]
          ?.osics_pathology_id || null,
      osics_body_area_id:
        addIssuePanel.diagnosisInfo.coding[codingSystemKeys.OSICS_10]
          ?.osics_body_area_id || null,
      event_type_id: addIssuePanel.eventInfo.eventType || null,
      illness_onset_id: addIssuePanel.diagnosisInfo.onset || null,
      pathology_codes:
        window.featureFlags['emr-multiple-coding-systems'] && codingSystem
          ? [
              codingSystem?.code || null,
              ...addIssuePanel.diagnosisInfo.secondary_pathologies.map(
                (pathology) => pathology.record?.value?.code
              ),
            ].filter((val) => typeof val !== 'undefined' && val !== null)
          : [],
      issue_type_name: getIssueTypeValueFromSidePanel(
        addIssuePanel.initialInfo.type
      ),
      reported_date: addIssuePanel.initialInfo.reportedDate,
      occurrence_date: addIssuePanel.initialInfo.diagnosisDate,
      other_event_value: isInfoEvent(eventInfoEventType)
        ? null
        : eventInfoEventType,
    };
  }, _isEqual);
  const conditionalFieldRequestStatus = useSelector(
    (state) => state.addIssuePanel.additionalInfo.requestStatus
  );

  const conditionalFieldQuestions = useSelector(
    (state) => state.addIssuePanel.additionalInfo.questions
  );

  useEffect(() => {
    dispatch(fetchConditionalFields(conditions));
  }, [conditions]);

  switch (conditionalFieldRequestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <ConditionalFieldsForm
          initialQuestions={conditionalFieldQuestions}
          conditions={conditions}
          conditionalFieldsAnswers={conditionalFieldsAnswers}
          onChange={(answers) =>
            dispatch(updateConditionalFieldsAnswers(answers))
          }
          validQuestionEvent={isInfoEvent(eventInfoEventType)}
        />
      );
    default:
      return null;
  }
};
