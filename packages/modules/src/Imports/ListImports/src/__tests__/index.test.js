import { screen, render, act } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { Provider } from 'react-redux';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import {
  useFetchImportTypeOptionsQuery,
  useFetchImportCreatorOptionsQuery,
  useSearchImportsListQuery,
} from '@kitman/modules/src/Imports/services/imports';

import ListImportsApp from '../../index';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('../../../services/imports');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  importsApi: {
    useFetchImportTypeOptionsQuery: jest.fn(),
    useFetchImportCreatorOptionsQuery: jest.fn(),
  },
});

const i18nT = i18nextTranslateStub();

setI18n(i18n);

const props = {
  t: i18nT,
};

describe('<ListImportsApp/>', () => {
  describe('LOADING', () => {
    beforeEach(() => {
      useFetchImportTypeOptionsQuery.mockReturnValue({
        isLoading: true,
      });
      useFetchImportCreatorOptionsQuery.mockReturnValue({
        isLoading: true,
      });
    });
    it('renders the loading state', async () => {
      act(() => {
        render(
          <Provider store={store}>
            <ListImportsApp {...props} />
          </Provider>
        );
      });
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });
  });
  describe('ERROR', () => {
    beforeEach(() => {
      useFetchImportTypeOptionsQuery.mockReturnValue({
        isError: true,
      });
      useFetchImportCreatorOptionsQuery.mockReturnValue({
        isError: true,
      });
    });
    it('renders the ERROR state', async () => {
      act(() => {
        render(
          <Provider store={store}>
            <ListImportsApp {...props} />
          </Provider>
        );
      });
      expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Go back and try again/i })
      ).toBeInTheDocument();
    });
  });
});
describe('SUCCESS', () => {
  beforeEach(() => {
    useFetchImportTypeOptionsQuery.mockReturnValue({
      data: [],
      isSuccess: true,
    });
    useFetchImportCreatorOptionsQuery.mockReturnValue({
      data: [],
      isSuccess: true,
    });
    useSearchImportsListQuery.mockReturnValue({
      data: [],
      isSuccess: true,
    });
  });
  it('renders the SUCCESS state', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <MockedOrganisationContextProvider
            organisationContext={{
              organisation: { id: 37 },
              organisationRequestStatus: 'SUCCESS',
            }}
          >
            <MockedPermissionContextProvider
              permissionsContext={{
                permissions: {},
                permissionsRequestStatus: 'SUCCESS',
              }}
            >
              <ListImportsApp {...props} />
            </MockedPermissionContextProvider>
          </MockedOrganisationContextProvider>
        </Provider>
      );
    });

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /Your Imports/i,
      })
    ).toBeInTheDocument();
  });
});
