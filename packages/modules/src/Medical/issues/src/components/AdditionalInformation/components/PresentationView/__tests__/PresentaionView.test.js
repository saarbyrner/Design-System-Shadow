import { render, screen } from '@testing-library/react';
import { data as mockIssueData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue';

import { getFlattenedInitialConditionalFieldsAnswers } from '@kitman/modules/src/ConditionalFields/shared/utils';
import { mockedConditionsWithAnswers } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue/data.mock';

import PresentationViewV2 from '..';

describe('<PresentationViewV2 />', () => {
  const props = {
    conditionalFields: mockedConditionsWithAnswers,
    conditionalFieldsAnswers: getFlattenedInitialConditionalFieldsAnswers({
      issue: mockIssueData.issue,
      isConditionalFieldsV2Flow: true,
    }),
  };

  it('displays parent questions & answers list correctly', () => {
    render(<PresentationViewV2 {...props} />);

    // ensure each each condition's question list is rendered
    props.conditionalFields.forEach((condition) => {
      condition.questions.forEach(({ question }) => {
        expect(screen.getByText(`${question.question}:`)).toBeInTheDocument();
        question.answers?.forEach((answer) => {
          expect(screen.getByText(`${answer.value}`)).toBeInTheDocument();
        });
      });
    });
  });
  it('displays followup questions and answers correctly', () => {
    render(<PresentationViewV2 {...props} />);

    const conditionAnswersWithFollowups = props.conditionalFields.map(
      (condition) => {
        // using map instead of filter b/c need to return the child, not parent
        // already know we're rendering parents correctly in test above
        return condition.questions.map(({ question, children }) => {
          const matchingChild = children.find(
            (child) => child.question.trigger_value === question.value
          );
          // returning child or undefined need to filter for undefined after
          return matchingChild;
        });
      }
    );

    conditionAnswersWithFollowups
      // filtering for undefined/no-matchingChild
      .filter((condition) => condition[0])
      .forEach((condition) => {
        condition?.forEach(({ question: followupQuestion }) => {
          expect(
            screen.getByText(`${followupQuestion.question}:`)
          ).toBeInTheDocument();
          expect(
            screen.getByText(`${followupQuestion.value}`)
          ).toBeInTheDocument();
        });
      });
  });
});
