// @flow

import { useDispatch, useSelector } from 'react-redux';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import _isEqual from 'lodash/isEqual';
import { ConditionalFieldsFormV2Translated as ConditionalFieldsFormV2 } from '@kitman/modules/src/Medical/shared/components/ConditionalFieldsFormV2';
import { updateConditionalFieldsAnswers } from '@kitman/modules/src/Medical/rosters/src/redux/actions';
import {
  getCodingSystemFromCoding,
  getIssueTypeValueFromSidePanel,
  isInfoEvent,
} from '@kitman/modules/src/Medical/shared/utils';
import { useGetConditionalFieldsFormQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';

// Types:
import type { ConditionalFieldAnswer as ConditionalFieldAnswerV2 } from '@kitman/modules/src/ConditionalFields/shared/types';

export default () => {
  const dispatch = useDispatch();
  const conditionalFieldsAnswers = useSelector(
    (state) => state.addIssuePanel.additionalInfo.conditionalFieldsAnswers
  );
  const eventInfoEventType = useSelector(
    (state) => state.addIssuePanel.eventInfo.eventType
  );

  const getIssueClassName = (
    addIssuePanel: Object
  ): ?('injury' | 'illness') => {
    const type = addIssuePanel?.initialInfo.type?.toUpperCase();
    let issueClassName = null;

    if (type?.includes('CHRONIC')) {
      return issueClassName;
    }
    if (type?.includes('INJURY')) {
      issueClassName = 'injury';
    }

    if (type?.includes('ILLNESS')) {
      issueClassName = 'illness';
    }
    return issueClassName;
  };

  const conditions = useSelector((state) => {
    const addIssuePanel = state.addIssuePanel;
    const codingSystem = getCodingSystemFromCoding(
      addIssuePanel.diagnosisInfo.coding
    );
    const issueClassName = getIssueClassName(addIssuePanel);

    return {
      athlete_id: addIssuePanel.initialInfo.athlete,
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
      issue_class_name: issueClassName,
      reported_date: addIssuePanel.initialInfo.reportedDate,
      occurrence_date: addIssuePanel.initialInfo.diagnosisDate,
      other_event_value: isInfoEvent(eventInfoEventType)
        ? null
        : eventInfoEventType,
    };
  }, _isEqual);

  const {
    data: conditionsV2,
    isLoading,
    isError,
  } = useGetConditionalFieldsFormQuery(conditions, {
    skip: !window.featureFlags['conditional-fields-v1-stop'],
  });

  if (isError) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }

  if (conditionsV2) {
    return (
      <ConditionalFieldsFormV2
        conditions={conditionsV2.conditions}
        conditionalFieldsAnswers={conditionalFieldsAnswers}
        onChange={(answers: Array<ConditionalFieldAnswerV2>) =>
          dispatch(updateConditionalFieldsAnswers(answers))
        }
        validQuestionEvent={isInfoEvent(eventInfoEventType)}
      />
    );
  }

  return null;
};
