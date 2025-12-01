import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { useGetConditionalFieldsFormQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { data } from '@kitman/services/src/mocks/handlers/medical/getConditionalFieldsForm';

import { Provider } from 'react-redux';

import ConditionalFieldsFormContainer from '../ConditionalFieldsFormContainer';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical');

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {
    useGetConditionalFieldsFormQuery: jest.fn(),
  },
  addIssuePanel: {
    initialInfo: {
      type: null,
    },
    eventInfo: { eventType: 5, activity: 1 },
    diagnosisInfo: {
      coding: {
        [codingSystemKeys.OSICS_10]: {
          osics_pathology_id: 3,
          osics_classification_id: 2,
          osics_body_area_id: 4,
        },
      },
      onset: 6,
    },
    additionalInfo: {
      conditionalFieldsAnswers: [],
      questions: [],
      requestStatus: 'PENDING',
    },
  },
});

const props = {
  t: i18nextTranslateStub(),
};

describe('<ConditionalFieldsFormContainer/>', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });

  describe('Loading state', () => {
    beforeEach(() => {
      useGetConditionalFieldsFormQuery.mockReturnValue({
        data: [],
        isError: false,
        isSuccess: false,
        isLoading: true,
      });
    });

    it('renders the loading message', () => {
      render(
        <Provider store={store}>
          <ConditionalFieldsFormContainer {...props} />
        </Provider>
      );

      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    beforeEach(() => {
      useGetConditionalFieldsFormQuery.mockReturnValue({
        data: [],
        isError: true,
        isSuccess: false,
        isLoading: false,
      });
    });

    it('renders the error state', () => {
      render(
        <Provider store={store}>
          <ConditionalFieldsFormContainer {...props} />
        </Provider>
      );

      expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
      expect(screen.getByText(/Go back and try again/i)).toBeInTheDocument();
    });
  });

  describe('Success state', () => {
    beforeEach(() => {
      useGetConditionalFieldsFormQuery.mockReturnValue({
        data,
        isError: false,
        isLoading: false,
      });
    });

    it('renders the Logic builder form', () => {
      render(
        <Provider store={store}>
          <ConditionalFieldsFormContainer {...props} />
        </Provider>
      );

      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        'Logic builder'
      );

      // ensure all data response the questions from conditions are rendered
      data.conditions.forEach((condition) => {
        condition.questions.forEach(({ question }) => {
          expect(screen.getByText(`${question.question}`)).toBeInTheDocument();
        });
      });
    });
  });
});
