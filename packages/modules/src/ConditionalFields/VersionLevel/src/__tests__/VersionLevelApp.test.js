import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

import {
  useFetchVersionQuery,
  useSaveVersionMutation,
  usePublishVersionMutation,
  useDeleteConditionMutation,
} from '../../../shared/services/conditionalFields';
import { defaultOrganisationContext } from '../../../shared/utils/test_utils.mock';
import { data as MOCK_VERSION } from '../../../shared/services/mocks/data/mock_version';

import VersionApp from '../..';

jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);
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
  conditionalFieldsApi: {
    useFetchVersionQuery: jest.fn(),
    userSaveVersionMutation: jest.fn(),
    useDeleteConditionMutation: jest.fn(),
  },
  conditionBuildViewSlice: {
    activeCondition: MOCK_VERSION.conditions[0],
    allConditions: MOCK_VERSION.conditions,
  },
});
const props = {
  organisationId: defaultOrganisationContext.organisation.id,
  rulesetId: 666,
  versionId: 1,
  t: i18nextTranslateStub(),
};

describe('<VersionLevelApp/>', () => {
  beforeEach(() => {
    i18nextTranslateStub();
    window.featureFlags['conditional-fields-creation-in-ip'] = true;
    useGlobal.mockReturnValue({
      data: [],
      isError: false,
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
    useFetchVersionQuery.mockReturnValue({
      data: MOCK_VERSION,
      isSuccess: true,
    });
    useSaveVersionMutation.mockReturnValue([{}, {}]);
    usePublishVersionMutation.mockReturnValue([{}, {}]);
    useDeleteConditionMutation.mockReturnValue([{}, {}]);
  });

  afterEach(() => {
    window.featureFlags['conditional-fields-creation-in-ip'] = false;
    jest.restoreAllMocks();
  });

  it('renders', () => {
    render(
      <Provider store={defaultStore}>
        <VersionApp {...props} />
      </Provider>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      MOCK_VERSION.name
    );
  });

  it('renders with old permission', () => {
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
        <VersionApp {...props} />
      </Provider>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      MOCK_VERSION.name
    );
  });

  describe('[FF/PERMISSIONS]', () => {
    describe('[conditional-fields-view-organisation]', () => {
      const MOCK_CONDITION_NAME = MOCK_VERSION.conditions[0].name;
      it('renders the Versions details tab when true', () => {
        render(
          <Provider store={defaultStore}>
            <VersionApp {...props} />
          </Provider>
        );

        expect(screen.getAllByRole('tab').at(0)).toHaveTextContent(
          'Build/view'
        );
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
          MOCK_VERSION.name
        );
        expect(
          screen.getAllByRole('heading', { level: 3 }).at(0)
        ).toHaveTextContent(/Rules/i);
        expect(screen.getByText(MOCK_CONDITION_NAME)).toBeInTheDocument();
      });
      // currently we don't have permissions on this and will use FF to toggle access
      it('does not render any tabs if the user has no permissions/FF is off', async () => {
        window.featureFlags['conditional-fields-creation-in-ip'] = false;

        render(
          <Provider store={defaultStore}>
            <VersionApp {...props} />
          </Provider>
        );

        expect(screen.queryByText('Rules')).not.toBeInTheDocument();
        expect(screen.queryByText(MOCK_CONDITION_NAME)).not.toBeInTheDocument();
      });
    });
  });
  describe('HEADER', () => {
    beforeEach(() => {
      useFetchVersionQuery.mockReturnValue({
        // set current version to be unpublished
        data: { ...MOCK_VERSION, published_at: null },
        isSuccess: true,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('renders editable header when version is unpublished', () => {
      render(
        <Provider store={defaultStore}>
          <VersionApp {...props} />
        </Provider>
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        MOCK_VERSION.name
      );

      // accounting for addition of VersionAppHeader component
      const iconElement = document.querySelector('.icon-edit');
      expect(iconElement).toBeInTheDocument();
    });
  });
});
