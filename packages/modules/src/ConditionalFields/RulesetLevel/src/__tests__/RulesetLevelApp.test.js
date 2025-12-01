import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';

import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

import { defaultOrganisationContext } from '../../../shared/utils/test_utils.mock';

import RulesetApp from '../..';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/common/src/hooks/useLocationSearch');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  global: {
    useGlobal: jest.fn(),
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
  },
  toastsSlice: {
    value: [],
  },
  assigneesSlice: {
    editMode: false,
    assignments: [],
  },
});
const props = {
  organisationId: defaultOrganisationContext.organisation.id,
  rulesetId: 666,
  title: 'Concussion',
  t: i18nextTranslateStub(),
};

describe('<RulesetLevelApp/>', () => {
  beforeEach(() => {
    i18nextTranslateStub();
    window.featureFlags['conditional-fields-creation-in-ip'] = true;
    useGlobal.mockReturnValue({
      isLoading: false,
      hasFailed: false,
      isSuccess: true,
    });
    useGetOrganisationQuery.mockReturnValue({
      data: [],
      isError: false,
      isSuccess: true,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: {
        logicBuilder: {
          canAdmin: true,
        },
      },
      isSuccess: true,
    });
    useLocationSearch.mockReturnValue(
      new URLSearchParams({ title: 'Fake title from URL params' })
    );
  });

  afterEach(() => {
    window.featureFlags['conditional-fields-creation-in-ip'] = false;
    jest.restoreAllMocks();
  });

  it('renders', async () => {
    render(
      <Provider store={defaultStore}>
        <RulesetApp {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        /Fake title from URL params/i
      );
    });
  });

  it('renders with old permission', async () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        injurySurveillance: {
          canAdmin: true,
        },
      },
      isSuccess: true,
    });
    render(
      <Provider store={defaultStore}>
        <RulesetApp {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        /Fake title from URL params/i
      );
    });
  });

  it('does not render any tabs if useGlobal has failed', async () => {
    useGlobal.mockReturnValue({
      isLoading: false,
      hasFailed: true,
      isSuccess: false,
    });

    render(
      <Provider store={defaultStore}>
        <RulesetApp {...props} />
      </Provider>
    );

    expect(screen.queryByText(/Versions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Assignees/i)).not.toBeInTheDocument();
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });

  describe('[FF/PERMISSIONS]', () => {
    describe('[conditional-fields-view-organisation]', () => {
      it('renders the Rulesets details tab when true', async () => {
        render(
          <Provider store={defaultStore}>
            <RulesetApp {...props} />
          </Provider>
        );
        expect(screen.getAllByRole('tab').at(0)).toHaveTextContent('Versions');
        expect(screen.getAllByRole('tab').at(1)).toHaveTextContent('Assignees');
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
          /Fake title from URL/i
        );
        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
          /Versions/i
        );

        await userEvent.click(screen.getAllByRole('tab').at(1));
        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
          /Assignees/i
        );
      });
    });
  });

  // currently we don't have permissions on this and will use FF to toggle access
  it('does not render any tabs if the user has no permissions/FF is off', async () => {
    window.featureFlags['conditional-fields-creation-in-ip'] = false;

    render(
      <Provider store={defaultStore}>
        <RulesetApp {...props} />
      </Provider>
    );

    expect(screen.queryByText(/Versions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Assignees/i)).not.toBeInTheDocument();
  });
});
