import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
  useFetchRulesetQuery,
  useUpdateOwnerRulesetMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import { data as MOCK_RULESET } from '@kitman/modules/src/ConditionalFields/shared//services/mocks/data/mock_versions_list';
import { data as MOCK_RULESET_NO_TITLE } from '@kitman/modules/src/ConditionalFields/shared//services/mocks/data/mock_newly-created_ruleset';

import RulesetAppHeader from '..';

jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  conditionalFieldsApi: {
    useFetchRulesetQuery: jest.fn(),
    useUpdateOwnerRulesetMutation: jest.fn(),
  },
});

const defaultProps = {
  title: '',
  rulesetId: 1,
};

const renderWithProviders = (store = defaultStore, props = defaultProps) => {
  render(
    <Provider store={store}>
      <RulesetAppHeader {...props} />
    </Provider>
  );
};

describe('<RulesetAppHeader/>', () => {
  beforeEach(() => {
    useFetchRulesetQuery.mockReturnValue({
      data: MOCK_RULESET,
      isSuccess: true,
    });
    useUpdateOwnerRulesetMutation.mockReturnValue([{}, {}]);
  });

  afterEach(() => {
    window.featureFlags['conditional-fields-creation-in-ip'] = false;
    jest.restoreAllMocks();
  });
  it('renders', () => {
    renderWithProviders();

    expect(
      screen.getByRole('heading', { name: MOCK_RULESET.name })
    ).toBeInTheDocument();
  });

  it('does not render title when null', () => {
    useFetchRulesetQuery.mockReturnValue({
      data: MOCK_RULESET_NO_TITLE,
      isSuccess: true,
    });
    renderWithProviders();

    expect(screen.getByRole('heading', { name: '--' })).toBeInTheDocument();
  });
});
