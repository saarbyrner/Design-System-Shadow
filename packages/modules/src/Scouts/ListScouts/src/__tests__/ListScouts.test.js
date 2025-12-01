import { render, screen, waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetCurrentUserQuery,
  useGetPreferencesQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import ListScoutsApp from '../../index';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/common/src/redux/global/services/globalApi');

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
});

describe('<ListScoutsApp/>', () => {
  const setUpMockQueryReturns = (isLoading, isError, isSuccess) => {
    useGetOrganisationQuery.mockReturnValue({
      data: {},
      isSuccess,
      isError,
      isLoading,
    });
    useGetCurrentUserQuery.mockReturnValue({
      data: {},
      isSuccess,
      isError,
      isLoading,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: {},
      isSuccess,
      isError,
      isLoading,
    });
    useGetPreferencesQuery.mockReturnValue({
      data: {},
      isSuccess,
      isError,
      isLoading,
    });
    useGetActiveSquadQuery.mockReturnValue({
      data: {},
      isSuccess,
      isError,
      isLoading,
    });
  };
  describe('LOADING STATE', () => {
    beforeEach(() => {
      setUpMockQueryReturns(true, false, false);
    });
    it('renders the LOADING state', async () => {
      render(
        <Provider store={defaultStore}>
          <ListScoutsApp />
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
          <ListScoutsApp />
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
          <ListScoutsApp />
        </Provider>
      );
      await waitFor(() => {
        expect(screen.getByText(/Manage Scouts/i)).toBeInTheDocument();
      });
    });
  });
});
