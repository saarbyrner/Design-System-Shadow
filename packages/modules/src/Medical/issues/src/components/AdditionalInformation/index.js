// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { colors } from '@kitman/common/src/variables';
import { AppStatus, LineLoader } from '@kitman/components';
import { saveIssue } from '@kitman/services';

import { getFlattenedInitialConditionalFieldsAnswers } from '@kitman/modules/src/ConditionalFields/shared/utils';
import { ConditionalFieldsFormV2Translated as ConditionalFieldsFormV2 } from '@kitman/modules/src/Medical/shared/components/ConditionalFieldsFormV2';
import type { ConditionalFieldAnswer as ConditionalFieldAnswerV1 } from '@kitman/modules/src/Medical/shared/types';
import type { ConditionalFieldAnswer as ConditionalFieldAnswerV2 } from '@kitman/modules/src/ConditionalFields/shared/types';

import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import type { RequestStatus } from '../../../../shared/types';
import { HeaderTranslated as Header } from './Header';
import PresentationView from './PresentationView';
import PresentationViewV2 from './components/PresentationView';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import ConditionalFieldsForm from '../../../../shared/components/ConditionalFieldsForm';
import { useIssueTabRequestStatus } from '../../hooks/useIssueTabRequestStatus';
import type { ViewType } from '../../types';
import { isInfoEvent } from '../../../../shared/utils';

const style = {
  section: {
    backgroundColor: `${colors.white}`,
    border: `1px solid ${colors.neutral_300}`,
    borderRadius: '3px',
    padding: '24px',
    position: 'relative',
  },
  sectionLoader: {
    bottom: 0,
    height: '4px',
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
  },
};

type Props = {
  editActionDisabled?: boolean,
  onEnterEditMode: (section: ?string) => null,
};

const AdditionalInformation = ({
  editActionDisabled,
  onEnterEditMode,
}: I18nProps<Props>) => {
  const isConditionalFieldsV2Flow =
    window.featureFlags['conditional-fields-v1-stop'];
  const allowValidationCheck = window.featureFlags['incomplete-injury-fields'];

  const { trackEvent } = useEventTracking();

  const getInitialAnswers = (issue) => {
    if (isConditionalFieldsV2Flow) {
      // in V2 flow ensure V1 conditional answers is empty
      return [];
    }

    return (
      issue.conditional_questions?.map((q) => ({
        question_id: q.id,
        value: q.answer?.value,
      })) || []
    );
  };

  const { issue, issueType, updateIssue } = useIssue();
  const { updateIssueTabRequestStatus } = useIssueTabRequestStatus();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [viewType, setViewType] = useState<ViewType>('PRESENTATION');
  const [conditionalFieldsAnswers, setConditionalFieldsAnswers] = useState<
    Array<ConditionalFieldAnswerV1>
  >(() => getInitialAnswers(issue));

  const [conditionalFieldsAnswersV2, setConditionalFieldsAnswersV2] = useState<
    Array<ConditionalFieldAnswerV2>
  >(() =>
    getFlattenedInitialConditionalFieldsAnswers({
      issue,
      isConditionalFieldsV2Flow,
    })
  );

  const containsConditionalQuestionsV1 = issue.conditional_questions?.length;
  const containsConditionalQuestionsV2 =
    issue.conditions_with_questions?.length;

  useEffect(() => {
    setConditionalFieldsAnswers(getInitialAnswers(issue));
    setConditionalFieldsAnswersV2(
      getFlattenedInitialConditionalFieldsAnswers({
        issue,
        isConditionalFieldsV2Flow,
      })
    );
  }, [viewType, issue]);

  const getConditionalFieldsFormContainer = () => {
    if (isConditionalFieldsV2Flow && containsConditionalQuestionsV2) {
      return (
        <ConditionalFieldsFormV2
          conditions={issue.conditions_with_questions}
          conditionalFieldsAnswers={conditionalFieldsAnswersV2}
          onChange={(answers) => {
            setConditionalFieldsAnswersV2(answers);
          }}
          validQuestionEvent={isInfoEvent(issue.activity_type)}
          isValidationCheckAllowed={allowValidationCheck}
        />
      );
    }
    if (!isConditionalFieldsV2Flow) {
      return (
        <ConditionalFieldsForm
          initialQuestions={issue.conditional_questions}
          conditionalFieldsAnswers={conditionalFieldsAnswers}
          onChange={(answers) => setConditionalFieldsAnswers(answers)}
          validQuestionEvent={isInfoEvent(issue.activity_type)}
          isValidationCheckAllowed={allowValidationCheck}
        />
      );
    }
    return null;
  };

  const getPresentationViewContainer = () => {
    if (
      isConditionalFieldsV2Flow &&
      containsConditionalQuestionsV2 &&
      isInfoEvent(issue.activity_type)
    ) {
      return (
        <PresentationViewV2
          conditionalFields={issue.conditions_with_questions} // all questions to ask
          conditionalFieldsAnswers={getFlattenedInitialConditionalFieldsAnswers(
            {
              issue,
              isConditionalFieldsV2Flow,
            }
          )} // answers to questions
          highlightEmptyQuestions={allowValidationCheck}
        />
      );
    }
    if (!isConditionalFieldsV2Flow && issue.conditional_questions.length) {
      return (
        <PresentationView
          conditionalFields={issue.conditional_questions}
          highlightEmptyQuestions={allowValidationCheck}
        />
      );
    }
    return null;
  };

  // Catch is not used here so the global error system can handle the error thrown
  const saveEdit = () => {
    setRequestStatus('PENDING');
    updateIssueTabRequestStatus('PENDING');
    saveIssue(issueType, issue, {
      conditional_fields_answers: conditionalFieldsAnswers?.filter((a) =>
        Boolean(a.value)
      ),
      ...(isConditionalFieldsV2Flow &&
        conditionalFieldsAnswersV2?.length && {
          screening_answers: conditionalFieldsAnswersV2
            // The answer object has two shapes. One that's coming from the API and one that's
            // created onChange. Here we check for both of them.
            .filter((a) => Boolean(a.value) || Boolean(a.answers[0]?.value))
            .map((answer) => ({
              ...answer,
              values:
                answer.value ||
                (answer.answers[0].value && [answer.answers[0].value]),
            })),
        }),
      presentation_type_id: issue.presentation_type?.id || null,
      issue_contact_type_id: issue.issue_contact_type?.id || null,
    })
      .then((updatedIssue) => {
        setRequestStatus('SUCCESS');
        updateIssue(updatedIssue);
        setViewType('PRESENTATION');
        updateIssueTabRequestStatus('DORMANT');
        trackEvent(
          performanceMedicineEventNames.editedInjuryIllnessAdditionalInformation
        );
      })
      .finally(() => {
        onEnterEditMode();
        setRequestStatus(null);
        updateIssueTabRequestStatus(null);
      });
  };
  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  if (!containsConditionalQuestionsV1 && !containsConditionalQuestionsV2) {
    // if there are neither V1 or V2 conditional fields return null
    return null;
  }

  return (
    <section css={style.section}>
      <Header
        viewType={viewType}
        onSave={() => {
          saveEdit();
        }}
        onEdit={() => {
          setViewType('EDIT');
          onEnterEditMode();
        }}
        onDiscardChanges={() => {
          setViewType('PRESENTATION');
          onEnterEditMode();
        }}
        isRequestPending={requestStatus === 'PENDING'}
        editActionDisabled={editActionDisabled}
      />
      {viewType === 'PRESENTATION'
        ? getPresentationViewContainer()
        : getConditionalFieldsFormContainer()}
      {requestStatus === 'PENDING' && (
        <div
          css={style.sectionLoader}
          data-testid="IssueDetailsLoader|lineLoader"
        >
          <LineLoader />
        </div>
      )}
    </section>
  );
};

export const AdditionalInformationTranslated = withNamespaces()(
  AdditionalInformation
);
export default AdditionalInformation;
