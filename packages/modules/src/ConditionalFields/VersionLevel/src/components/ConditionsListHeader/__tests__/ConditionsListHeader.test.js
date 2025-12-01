import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import ConditionsListHeader from '..';
import { data as MOCK_VERSION } from '../../../../../shared/services/mocks/data/mock_version';
import { MOCK_CONDITIONS } from '../../../../../shared/utils/test_utils.mock';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  global: {
    useGetOrganisationQuery: jest.fn(),
    useGlobal: jest.fn(),
  },
  conditionalFieldsApi: {
    useFetchVersionQuery: jest.fn(),
    useUpdateOwnerRulesetMutation: jest.fn(),
  },
  conditionBuildViewSlice: {
    activeCondition: MOCK_CONDITIONS[0],
    allConditions: MOCK_CONDITIONS,
  },
});

describe('<ConditionsListHeader />', () => {
  const props = {
    version: MOCK_VERSION,
    isPublished: false,
    t: i18nextTranslateStub(),
  };
  
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays heading and Add button', () => {
    render(
      <Provider store={defaultStore}>
        <ConditionsListHeader {...props} />
      </Provider>
    );
    expect(
      screen.getAllByRole('heading', { level: 3 }).at(0)
    ).toHaveTextContent(/Rules/i);
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });
  it('does not render Add button when isPublish is true', () => {
    render(
      <Provider store={defaultStore}>
        <ConditionsListHeader {...props} isPublished />
      </Provider>
    );

    expect(screen.queryByText('Add')).not.toBeInTheDocument();
  });
});
