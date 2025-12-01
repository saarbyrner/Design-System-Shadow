import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';

import {
  useFetchVersionQuery,
  useFetchPredicateOptionsQuery,
  useSaveVersionMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import { onAddQuestion } from '@kitman/modules/src/ConditionalFields/shared/redux/slices/conditionBuildViewSlice';
import { data as MOCK_VERSION } from '@kitman/modules/src/ConditionalFields/shared/services/mocks/data/mock_version';
import { data as MOCK_PREDICATE_OPTIONS } from '@kitman/modules/src/ConditionalFields/shared/services/mocks/data/mock_predicate_options_list';
import {
  defaultOrganisationContext,
  MOCK_ACTIVE_CONDITION,
} from '@kitman/modules/src/ConditionalFields/shared/utils/test_utils.mock';

import ActiveCondition from '..';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);

const mockDispatch = jest.fn();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  global: {
    useGetOrganisationQuery: jest.fn(),
    useGlobal: jest.fn(),
  },
  conditionalFieldsApi: {
    useFetchVersionQuery: jest.fn(),
    useFetchPredicateOptionsQuery: jest.fn(),
    useUpdateOwnerRulesetMutation: jest.fn(),
    useSaveVersionMutation: jest.fn(),
  },
  conditionBuildViewSlice: {
    activeCondition: MOCK_ACTIVE_CONDITION,
    allConditions: [MOCK_ACTIVE_CONDITION],
    requestStatus: 'SUCCESS',
    flattenedNames: [],
  },
});

const defaultProps = {
  t: i18nextTranslateStub(),
  isPublished: false,
};

const renderWithProviders = (store = defaultStore, props = defaultProps) => {
  render(
    <Provider store={store}>
      <ActiveCondition {...props} />
    </Provider>
  );
};

describe('<ActiveCondition />', () => {
  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue({
      data: {
        id: defaultOrganisationContext.organisation.id,
      },
      isError: false,
      isLoading: false,
      isSuccess: true,
    });
    useFetchVersionQuery.mockReturnValue({
      data: { ...MOCK_VERSION, published_at: null },
      isError: false,
      isLoading: false,
      isSuccess: true,
    });
    useFetchPredicateOptionsQuery.mockReturnValue({
      data: MOCK_PREDICATE_OPTIONS,
      isError: false,
      isSuccess: true,
    });
    useSaveVersionMutation.mockReturnValue([{}, {}]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('[requestStatus]', () => {
    it('[FAILURE] renders error app status', async () => {
      renderWithProviders(
        storeFake({
          global: {
            useGetOrganisationQuery: jest.fn(),
            useGlobal: jest.fn(),
          },
          conditionalFieldsApi: {
            useFetchVersionQuery: jest.fn(),
            useFetchPredicateOptionsQuery: jest.fn(),
            useUpdateOwnerRulesetMutation: jest.fn(),
            useSaveVersionMutation: jest.fn(),
          },
          conditionBuildViewSlice: {
            activeCondition: MOCK_ACTIVE_CONDITION,
            allConditions: [MOCK_ACTIVE_CONDITION],
            requestStatus: 'FAILURE',
          },
        })
      );

      await expect(
        screen.getByText('Something went wrong!')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Go back and try again' })
      ).toBeInTheDocument();
    });
    it('[PENDING] renders loading spinner', () => {
      renderWithProviders(
        storeFake({
          global: {
            useGetOrganisationQuery: jest.fn(),
            useGlobal: jest.fn(),
          },
          conditionalFieldsApi: {
            useFetchVersionQuery: jest.fn(),
            useFetchPredicateOptionsQuery: jest.fn(),
            useUpdateOwnerRulesetMutation: jest.fn(),
            useSaveVersionMutation: jest.fn(),
          },
          conditionBuildViewSlice: {
            activeCondition: MOCK_ACTIVE_CONDITION,
            allConditions: [MOCK_ACTIVE_CONDITION],
            requestStatus: 'PENDING',
          },
        })
      );

      expect(screen.getByTestId('LoadingSpinner')).toBeInTheDocument();
    });
    it('[SUCCESS] renders the active condition', () => {
      renderWithProviders();

      expect(
        screen.getAllByRole('heading', { level: 3 }).at(0)
      ).toHaveTextContent(/Rule 1/i);
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Discard changes' })
      ).toBeInTheDocument();
    });
  });

  describe('[Add question button]', () => {
    it('renders', () => {
      renderWithProviders();
      const addQuestionButton = screen.getByRole('button', {
        name: '+ Add question',
      });

      expect(addQuestionButton).toBeInTheDocument();
      expect(addQuestionButton).toBeEnabled();
    });

    it('is disabled when isPublished prop is present', () => {
      renderWithProviders(defaultStore, { ...defaultProps, isPublished: true });
      const addQuestionButton = screen.getByRole('button', {
        name: '+ Add question',
      });

      expect(addQuestionButton).toBeInTheDocument();
      expect(addQuestionButton).toBeDisabled();
    });

    it('dispatches addQuestion() on click', async () => {
      renderWithProviders();
      const addQuestionButton = screen.getByRole('button', {
        name: '+ Add question',
      });

      expect(addQuestionButton).toBeInTheDocument();
      await userEvent.click(addQuestionButton);
      expect(mockDispatch).toHaveBeenCalledWith(onAddQuestion());
    });
  });
});
