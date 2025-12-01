import { render, screen, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';

import { Provider } from 'react-redux';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetPreferencesQuery,
  useGetCurrentUserQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import CreateEditScout from '../../index';

import useInitialiseForm from '../hooks/useInitialiseForm';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/hooks/useLocationPathname', () => jest.fn());
jest.mock('../hooks/useInitialiseForm');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
    useGetPreferencesQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useFetchOrganisationQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  },
  registrationFormApi: {
    useFetchFormStructureQuery: jest.fn(),
  },
  scoutApi: {
    useFetchAdditionalUserQuery: jest.fn(),
  },
  formMenuSlice: {
    active: {
      menuGroupIndex: 0,
      menuItemIndex: 0,
    },
  },
  formStateSlice: {
    form: {},
    structure: {
      form_template_version: 0,
    },
  },

  formValidationSlice: {
    validation: {},
  },
});

const i18nT = i18nextTranslateStub();

const props = {
  mode: 'CREATE',
  userType: 'scout',
  t: i18nT,
};

describe('<CreateEditScout/>', () => {
  beforeEach(() => {
    useLocationPathname.mockImplementation(
      () => '/administration/scouts/1/edit'
    );
    Element.prototype.scrollIntoView = jest.fn();
  });
  const setUpMockQueryReturns = (isLoading, isError, isSuccess) => {
    useGetOrganisationQuery.mockReturnValue({
      data: [],
      isLoading,
      isError,
      isSuccess,
    });
    useGetCurrentUserQuery.mockReturnValue({
      data: [],
      isLoading,
      isError,
      isSuccess,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: [],
      isLoading,
      isError,
      isSuccess,
    });
    useGetPreferencesQuery.mockReturnValue({
      data: {},
      isLoading,
      isError,
      isSuccess,
    });
    useInitialiseForm.mockReturnValue({
      isLoading,
      hasFailed: isError,
      isSuccess,
    });
    useGetActiveSquadQuery.mockReturnValue({
      data: {},
      isLoading,
      isError,
      isSuccess,
    });
  };
  describe('LOADING STATE', () => {
    beforeEach(() => {
      setUpMockQueryReturns(true, false, false);
    });
    it('renders the LOADING state', async () => {
      render(
        <Provider store={defaultStore}>
          <CreateEditScout {...props} />
        </Provider>
      );
      await waitFor(() => {
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
      });
    });
  });
  describe('FAILURE STATE', () => {
    beforeEach(() => {
      setUpMockQueryReturns(false, true, false);
    });
    it('renders the FAILURE state', async () => {
      render(
        <Provider store={defaultStore}>
          <CreateEditScout {...props} />
        </Provider>
      );
      await waitFor(() => {
        expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /Go back and try again/i })
        ).toBeInTheDocument();
      });
    });
  });
  describe('SUCCESS STATE', () => {
    beforeEach(() => {
      setUpMockQueryReturns(false, false, true);
    });
    it('renders the SUCCESS state', async () => {
      render(
        <Provider store={defaultStore}>
          <CreateEditScout {...props} />
        </Provider>
      );
      await waitFor(() => {
        expect(screen.getByText(/Create Scout/i)).toBeInTheDocument();
      });
    });
  });
  describe('MODE is CREATE', () => {
    beforeEach(() => {
      setUpMockQueryReturns(false, false, true);
    });
    it('renders the CREATE mode', async () => {
      render(
        <Provider store={defaultStore}>
          <CreateEditScout {...props} />
        </Provider>
      );
      await waitFor(() => {
        expect(screen.getByText(/Create Scout/i)).toBeInTheDocument();
      });
    });
  });
  describe('MODE is EDIT', () => {
    beforeEach(() => {
      setUpMockQueryReturns(false, false, true);
    });
    it('renders the EDIt mode', async () => {
      render(
        <Provider store={defaultStore}>
          <CreateEditScout {...props} mode="EDIT" />
        </Provider>
      );
      await waitFor(() => {
        expect(screen.getByText(/Edit Scout/i)).toBeInTheDocument();
      });
    });
  });
});
