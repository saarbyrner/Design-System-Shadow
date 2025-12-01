import { screen, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

import {
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';

import {
  useFetchPredicateOptionsQuery,
  useSaveConditionMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import {
  MOCK_BLANK_ACTIVE_CONDITION,
  MOCK_ACTIVE_CONDITION,
  defaultOrganisationContext,
} from '@kitman/modules/src/ConditionalFields/shared/utils/test_utils.mock';
import { data as MOCK_PREDICATE_OPTIONS } from '@kitman/modules/src/ConditionalFields/shared/services/mocks/data/mock_predicate_options_list';

import PredicateBuild from '..';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);

const defaultStore = storeFake({
  global: {
    useGetOrganisationQuery: jest.fn(),
  },
  conditionBuildViewSlice: {
    activeCondition: MOCK_BLANK_ACTIVE_CONDITION,
    allConditions: [MOCK_BLANK_ACTIVE_CONDITION],
  },
  conditionalFieldsApi: {
    useFetchPredicateOptionsQuery: jest.fn(),
    useSaveConditionMutation: jest.fn(),
  },
});

const defaultProps = {
  t: i18nextTranslateStub(),
  setRequiredFieldsAndValues: jest.fn(),
};

const renderWithProviders = (store = defaultStore, props = defaultProps) => {
  render(
    <Provider store={store}>
      <PredicateBuild {...props} />
    </Provider>
  );
};

describe('<PredicateBuild/>', () => {
  beforeEach(() => {
    useSaveConditionMutation.mockReturnValue([{}, {}]);
    useGetOrganisationQuery.mockReturnValue({
      data: {
        id: defaultOrganisationContext.organisation.id,
      },
      isError: false,
      isSuccess: true,
    });
    useFetchPredicateOptionsQuery.mockReturnValue({
      data: MOCK_PREDICATE_OPTIONS,
      isError: false,
      isSuccess: true,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders expected form fields', () => {
    renderWithProviders();
    expect(
      screen.getByRole('textbox', { name: 'Rule name' })
    ).toBeInTheDocument();
    // accounting for placeholder in Input Select
    expect(screen.queryAllByText('Input')).toHaveLength(2);
    // accounting for Operator Select
    expect(screen.queryByText('Operator')).toBeInTheDocument();
    // Accounting for Trigger Select
    expect(screen.queryByText('Trigger')).toBeInTheDocument();
  });

  describe('[COMPUTED]', () => {
    it('renders expected data from activeCondition', () => {
      renderWithProviders(
        storeFake({
          global: {
            useGetOrganisationQuery: jest.fn(),
          },
          conditionBuildViewSlice: {
            activeCondition: MOCK_ACTIVE_CONDITION,
            allConditions: [MOCK_ACTIVE_CONDITION],
          },
          conditionalFieldsApi: {
            useFetchPredicateOptionsQuery: jest.fn(),
            useSaveConditionMutation: jest.fn(),
          },
        })
      );
      expect(screen.getByRole('textbox', { name: 'Rule name' })).toHaveValue(
        MOCK_ACTIVE_CONDITION.name
      );
      // Input Select
      expect(
        screen.getByText('Organisation Coding System')
      ).toBeInTheDocument();
      // Operator Select
      expect(screen.getByText('Is')).toBeInTheDocument();
      // Trigger Select
      expect(screen.getByText('OSICS-10')).toBeInTheDocument();
    });
  });

  it('shows validation error when entering a duplicate name', async () => {
    const user = userEvent.setup();
    // Add a name to the store to check against
    const store = storeFake({
      global: {
        useGetOrganisationQuery: jest.fn(),
      },
      conditionBuildViewSlice: {
        activeCondition: {
          ...MOCK_BLANK_ACTIVE_CONDITION,
          id: 1,
          name: 'mickfoley',
        },
        allConditions: [
          { ...MOCK_BLANK_ACTIVE_CONDITION, id: 1, name: 'mickfoley' },
          { ...MOCK_BLANK_ACTIVE_CONDITION, id: 2, name: 'undertaker' },
        ],
      },
      conditionalFieldsApi: {
        useFetchPredicateOptionsQuery: jest.fn(),
        useSaveConditionMutation: jest.fn(),
      },
    });

    renderWithProviders(store);

    // add new value in name field
    const input = screen.getByRole('textbox', { name: 'Rule name' });
    await user.clear(input);
    await user.type(input, 'undertaker');

    // wait for validation message to render
    await waitFor(
      () => {
        expect(
          screen.getByText('This field requires a unique value')
        ).toBeInTheDocument();
      },
      { timeout: 700 }
    );
  });
});
