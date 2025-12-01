import { within, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import $ from 'jquery';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import * as PermissionsContext from '@kitman/common/src/contexts/PermissionsContext';
import { transformIssueRequest } from '@kitman/services/src/services/medical/saveIssue';

import {
  mockedIssue,
  mockedConditionalFields,
} from '@kitman/modules/src/Medical/shared/services/getAthleteIssue';
import {
  MockedIssueContextProvider,
  mockedIssueContextValue,
} from '@kitman/modules/src/Medical/shared/contexts/IssueContext/utils/mocks';

import AdditionalInformation from '..';

jest.mock('@kitman/common/src/hooks/useEventTracking');

const trackEventMock = jest.fn();

const props = {
  t: i18nextTranslateStub(),
  onEnterEditMode: jest.fn(),
};

describe('<AdditionalInformation />', () => {
  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  describe('[FEATURE FLAG] - conditional-fields-v1-stop', () => {
    describe('FALSE', () => {
      const { conditional_questions: conditionalQuestionsV1 } =
        mockedIssueContextValue.issue;
      it('renders conditional_questions array from Issue context', () => {
        render(
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AdditionalInformation {...props} />
          </MockedIssueContextProvider>
        );

        // ensure each question and answer is rendered
        conditionalQuestionsV1.forEach(({ question, answer }) => {
          expect(screen.getByText(`${question}:`)).toBeInTheDocument();
          expect(screen.getByText(`${answer.value}`)).toBeInTheDocument();
        });
      });
    });
    describe('TRUE', () => {
      const permissionsTrue = {
        permissions: {
          medical: {
            issues: {
              canEdit: true,
            },
          },
        },
      };

      const { conditions_with_questions: conditionalQuestionsV2 } =
        mockedIssueContextValue.issue;

      beforeEach(() => {
        window.featureFlags = {
          'conditional-fields-v1-stop': true,
        };
        jest
          .spyOn(PermissionsContext, 'usePermissions')
          .mockReturnValue(permissionsTrue);
      });

      afterEach(() => {
        window.featureFlags = {};
      });

      it('renders all questions from conditions_with_questions from Issue context', () => {
        render(
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AdditionalInformation {...props} />
          </MockedIssueContextProvider>
        );

        // ensure each each condition's question list is rendered
        conditionalQuestionsV2.forEach(({ questions }) => {
          // for each question list, ensure each question is rendered
          questions.forEach(({ question }) => {
            expect(
              screen.getByText(`${question.question}:`)
            ).toBeInTheDocument();
          });
        });
      });
      it('renders all answers from conditions_with_questions', () => {
        render(
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AdditionalInformation {...props} />
          </MockedIssueContextProvider>
        );
        // ensure each each condition's question list is rendered
        conditionalQuestionsV2.forEach(({ questions }) => {
          // for each question list, filter for only answered questions
          const onlyAnsweredQuestions = questions.filter(
            ({ question }) => question.value
          );

          // every condition's answered questions list length is different,
          // however none of them are zero in mock data
          expect(onlyAnsweredQuestions.length).not.toEqual(0);

          // above check proves there are answered questions left
          // below check ensures they are all rendered
          onlyAnsweredQuestions.forEach(({ question }) => {
            expect(
              screen.getByText(`${question.question}:`)
            ).toBeInTheDocument();
            expect(screen.getByText(`${question.value}`)).toBeInTheDocument();
          });
        });
      });
      it('displays followup questions and answers correctly', () => {
        render(
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AdditionalInformation {...props} />
          </MockedIssueContextProvider>
        );

        const conditionAnswersWithFollowups = conditionalQuestionsV2.map(
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

        const onlyAnswersWithFollowups = conditionAnswersWithFollowups
          // filtering for undefined/no-matchingChild
          .filter((condition) => condition[0]);

        // every followanswer length is different, however not zero
        expect(onlyAnswersWithFollowups.length).not.toEqual(0);

        onlyAnswersWithFollowups.forEach((condition) => {
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
      it('does not render questions for certain event types', () => {
        render(
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              issue: {
                ...mockedIssueContextValue.issue,
                activity_type: 'nonfootball', // Set activity_type to a value from the isInfoEvent array
              },
            }}
          >
            <AdditionalInformation {...props} />
          </MockedIssueContextProvider>
        );

        // ensure each each condition's question list is rendered
        conditionalQuestionsV2.forEach(({ questions }) => {
          // for each question list, ensure each question is rendered
          questions.forEach(({ question }) => {
            expect(
              screen.queryByText(`${question.question}:`)
            ).not.toBeInTheDocument();
          });
        });
      });

      it('renders form when edit button toggled', async () => {
        render(
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AdditionalInformation {...props} />
          </MockedIssueContextProvider>
        );

        const header = screen.getByRole('banner');

        const editButton = within(header).getByRole('button', {
          name: 'Edit',
        });
        expect(editButton).toBeInTheDocument();

        await userEvent.click(editButton);

        // ensure H4 header from form is rendered
        expect(
          screen.getByRole('heading', {
            level: 4,
            name: 'Logic builder',
          })
        ).toBeInTheDocument();

        // ensure each each condition's question list is rendered
        conditionalQuestionsV2.forEach(({ questions }) => {
          // ensure each question from each question list is rendered
          questions.forEach(({ question }) => {
            expect(
              screen.getByText(`${question.question}`)
            ).toBeInTheDocument();
          });
        });
      });
    });
  });

  describe('Legacy Tests', () => {
    let ajaxSpy;
    let user;

    beforeEach(() => {
      user = userEvent.setup();
      ajaxSpy = jest.spyOn($, 'ajax');
      window.featureFlags = {
        'conditional-fields-showing-in-ip': true,
      };
    });

    afterEach(() => {
      jest.restoreAllMocks();
      window.featureFlags = {};
    });

    describe('when the issue type is Injury', () => {
      const mockedInjury = {
        ...mockedIssue,
        id: 'save_issue_id',
        conditional_questions: [
          ...mockedConditionalFields,
          {
            id: 2,
            parent_rule_id: 1,
            question: 'Question without answer',
            question_type: 'free-text',
          },
        ],
      };

      beforeEach(() => {
        ajaxSpy.mockImplementation((options) => {
          if (options.url === '/athletes/15642/injuries/3') {
            return $.Deferred().resolveWith(null, [mockedInjury]);
          }
          return $.Deferred().reject();
        });
      });

      it('saves the form when clicking the save button', async () => {
        const onEnterEditModeSpy = jest.fn();
        const updateIssueSpy = jest.fn();

        render(
          <MockedIssueContextProvider
            issueContext={{
              ...mockedIssueContextValue,
              updateIssue: updateIssueSpy,
            }}
          >
            <AdditionalInformation onEnterEditMode={onEnterEditModeSpy} />
          </MockedIssueContextProvider>
        );

        const header = screen.getByRole('banner');
        const editButton = within(header).getByText('Edit');
        await user.click(editButton);

        const saveButton = within(header).getByRole('button', { name: 'Save' });
        await user.click(saveButton);

        expect(ajaxSpy).toHaveBeenCalledTimes(1);
        expect(ajaxSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            url: '/athletes/15642/injuries/3',
            data: JSON.stringify({
              detailed: true,
              scope_to_org: true,
              ...transformIssueRequest(mockedIssueContextValue.issue, 'Injury'),
              notes: [],
              rehab_sessions: null,
              conditional_fields_answers: [
                {
                  question_id: 1,
                  value: 'Yes',
                },
                {
                  question_id: 2,
                  value: 'Nordic',
                },
              ],
              presentation_type_id:
                mockedIssueContextValue.issue.presentation_type.id,
              issue_contact_type_id:
                mockedIssueContextValue.issue.issue_contact_type.id,
              include_occurrence_type: true,
            }),
          })
        );

        await within(header).findByRole('button', { name: 'Edit' }); // Wait for the component to re-render after save

        expect(updateIssueSpy).toHaveBeenCalledWith(mockedInjury);
        expect(
          within(header).getByRole('button', { name: 'Edit' })
        ).toBeInTheDocument();
      });
    });
  });
});
