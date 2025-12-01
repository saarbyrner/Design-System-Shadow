import { I18nextProvider, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';

import ConditionalFieldsFormContainer from '../ConditionalFieldsForm';

const mockedQuestions = [
  {
    id: 123,
    parent_question_id: null,
    question: 'Favourite animal?',
    question_type: 'multiple-choice',
    order: 1,
    question_metadata: [
      { value: 'Wombats', order: 2 },
      { value: 'Koalas', order: 1 },
    ],
  },
  {
    id: 456,
    parent_question_id: null,
    question: 'Name every timtam flavour.',
    question_type: 'free-text',
    order: 2,
    question_metadata: [],
  },
  {
    id: 789,
    parent_question_id: null,
    question: 'Which city is better?',
    question_type: 'free-text',
    order: 1,
    question_metadata: [],
  },
];

// Mock the global $ object and its ajax method
global.$ = {
  ajax: jest.fn(),
  Deferred: () => {
    return {
      resolveWith: jest.fn().mockReturnThis(),
      reject: jest.fn().mockReturnThis(),
      promise: jest.fn().mockReturnThis(),
    };
  },
};

const storeFake = (state) => ({
  default() {},
  subscribe() {},
  dispatch: jest.fn(),
  getState() {
    return { ...state };
  },
});

describe('ConditionalFieldsFormContainer', () => {
  let store;

  const containerProps = {};

  const defaultStore = {
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
        conditionalFieldsAnswers: [{ value: 'Wombats', id: '123' }],
        questions: mockedQuestions,
        requestStatus: 'SUCCESS',
      },
    },
  };

  beforeEach(() => {
    store = storeFake(defaultStore);
    setI18n(i18n);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When the server response is successful', () => {
    let originalAjax;
    beforeEach(() => {
      originalAjax = global.$.ajax;
      $.ajax.mockImplementation(() => {
        const deferred = new global.$.Deferred();
        deferred.resolveWith(null, [{ questions: mockedQuestions }]);
        return deferred.promise();
      });
    });

    afterEach(() => {
      global.$.ajax = originalAjax;
    });

    it('renders the form', async () => {
      render(
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <ConditionalFieldsFormContainer {...containerProps} />
          </Provider>
        </I18nextProvider>
      );

      expect(await screen.findByText('Favourite animal?')).toBeInTheDocument();
      expect(
        await screen.findByText('Name every timtam flavour.')
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Which city is better?')
      ).toBeInTheDocument();
    });
  });

  describe('When the request fails', () => {
    beforeEach(() => {
      $.ajax.mockImplementation(() => {
        const deferred = new global.$.Deferred();
        deferred.reject();
        return deferred.promise();
      });
    });

    it('renders an error message', async () => {
      const failureStore = {
        addIssuePanel: {
          initialInfo: {
            type: null,
          },
          eventInfo: { eventType: 'nonfootball', activity: 1 },
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
            conditionalFieldsAnswers: null,
            questions: null,
            requestStatus: 'FAILURE',
          },
        },
      };

      store = storeFake(failureStore);

      render(
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <ConditionalFieldsFormContainer {...containerProps} />
          </Provider>
        </I18nextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
      });
    });
  });
});
