import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { useSearchMovementOrganisationsListQuery } from '@kitman/modules/src/UserMovement/shared/redux/services';

import { initialState as initialCreateMovementState } from '../../../utils/index';
import { REDUCER_KEY as createMovementReducerKey } from '../../../redux/slices/createMovementSlice';
import { response } from '../../../redux/services/mocks/data/mock_search_movement_organisation_list';

import { sixthFebruary2024 } from '../../../utils/test_utils';

import MovementToSelect from '..';

jest.mock('@kitman/modules/src/UserMovement/shared/redux/services');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
};

const defaultStore = {
  [createMovementReducerKey]: {
    ...initialCreateMovementState,
  },
  'UserMovement.services': {
    useSearchMovementOrganisationsListQuery: jest.fn(),
  },
};

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <MovementToSelect {...props} />
    </Provider>
  );
};

const defaultFormState = {
  user_id: null,
  transfer_type: 'trade',
  join_organisation_ids: [],
  leave_organisation_ids: [],
  joined_at: sixthFebruary2024,
};

const mockLocalState = (mockedFormState, mockValidationState) => {
  return {
    [createMovementReducerKey]: {
      ...initialCreateMovementState,
      form: {
        ...defaultFormState,
        ...mockedFormState,
      },

      validation: {
        join_organisation_ids: {
          status: 'PENDING',
          message: null,
        },
        ...mockValidationState,
      },
    },

    'UserMovement.services': {
      useSearchMovementOrganisationsListQuery: jest.fn(),
    },
  };
};

describe('<MovementToSelect/>', () => {
  describe('sad paths', () => {
    it('is disabled while loading', () => {
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        data: null,
        isLoading: true,
      });
      renderWithProviders(storeFake(defaultStore));

      expect(screen.getByText(/Unsupported/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
    it('is renders the alert when isError', () => {
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        data: null,
        isError: true,
      });
      renderWithProviders(storeFake(defaultStore));

      expect(screen.getByText(/Unsupported/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('is renders the alert when noDataError', () => {
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        data: [],
        isSuccess: true,
      });
      renderWithProviders(storeFake(defaultStore));

      expect(screen.getAllByText(/Unsupported/i)).toHaveLength(3);
    });
  });

  describe('selecting a value', () => {
    let localStore;
    let localState;
    const mockDispatch = jest.fn();

    describe('selecting a value', () => {
      beforeEach(() => {
        localState = mockLocalState({
          join_organisation_ids: [],
          join_squad_ids: [],
        });
        localStore = storeFake(localState);
        localStore.dispatch = mockDispatch;
        useSearchMovementOrganisationsListQuery.mockReturnValue({
          data: response,
          isSuccess: true,
          isError: false,
          isLoading: false,
        });
      });
      it('selects the correct value', async () => {
        renderWithProviders(localStore);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await userEvent.click(
          screen.getByRole('img', { name: 'Manchester United' })
        );
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            join_organisation_ids: [115],
          },
          type: `${createMovementReducerKey}/onUpdateCreateMovementForm`,
        });
        expect(screen.getByRole('combobox')).toHaveValue('Manchester United');
      });
    });

    describe('clearing a value', () => {
      beforeEach(() => {
        localState = mockLocalState({
          join_organisation_ids: [115],
          join_squad_ids: [],
        });
        localStore = storeFake(localState);
        localStore.dispatch = mockDispatch;
        useSearchMovementOrganisationsListQuery.mockReturnValue({
          data: response,
          isSuccess: true,
          isError: false,
          isLoading: false,
        });
      });
      it('clears the values', async () => {
        renderWithProviders(localStore);
        expect(screen.getByRole('combobox')).toHaveValue('Manchester United');

        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await userEvent.clear(screen.getByRole('combobox'));
        await userEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            join_organisation_ids: [],
            join_squad_ids: [],
          },
          type: `${createMovementReducerKey}/onUpdateCreateMovementForm`,
        });
      });
    });

    describe('clearing team and squad ids', () => {
      beforeEach(() => {
        localState = mockLocalState({
          join_organisation_ids: [115],
          join_squad_ids: [123],
        });
        localStore = storeFake(localState);
        localStore.dispatch = mockDispatch;
        useSearchMovementOrganisationsListQuery.mockReturnValue({
          data: response,
          isSuccess: true,
          isError: false,
          isLoading: false,
        });
      });
      it('clears the values and dispatches correct payloads', async () => {
        renderWithProviders(localStore);
        expect(screen.getByRole('combobox')).toHaveValue('Manchester United');

        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await userEvent.clear(screen.getByRole('combobox'));
        await userEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          payload: {
            join_organisation_ids: {
              message: 'Traded to is a required field',
              status: 'INVALID',
            },
          },
          type: `${createMovementReducerKey}/onUpdateValidation`,
        });

        expect(mockDispatch).toHaveBeenNthCalledWith(2, {
          payload: {
            join_squad_ids: {
              message: 'Team is a required field',
              status: 'INVALID',
            },
          },
          type: `${createMovementReducerKey}/onUpdateValidation`,
        });
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          payload: {
            join_organisation_ids: [],
            join_squad_ids: [],
          },
          type: `${createMovementReducerKey}/onUpdateCreateMovementForm`,
        });
      });
    });
  });

  describe('handling failures', () => {
    let localStore;
    let localState;
    const mockDispatch = jest.fn();

    describe('no data returned', () => {
      beforeEach(() => {
        localState = mockLocalState();
        localStore = storeFake(localState);
        localStore.dispatch = mockDispatch;
        useSearchMovementOrganisationsListQuery.mockReturnValue({
          data: [],
          isSuccess: true,
          isError: false,
          isLoading: false,
        });
      });
      it('renders the no data alert', async () => {
        renderWithProviders(localStore);
        expect(screen.getByText('Traded to')).toBeInTheDocument();
        expect(
          screen.getByText(/Traded to organisations not available/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            /An association must have at least 2 organisations to continue/i
          )
        ).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeDisabled();
      });
    });

    describe('failed api call', () => {
      const mockRefetch = jest.fn();
      beforeEach(() => {
        localState = mockLocalState();
        localStore = storeFake(localState);
        localStore.dispatch = mockDispatch;
        useSearchMovementOrganisationsListQuery.mockReturnValue({
          isError: true,
          refetch: mockRefetch,
        });
      });
      it('renders the retry alert', async () => {
        renderWithProviders(localStore);
        expect(
          screen.getByRole('button', { name: 'Retry' })
        ).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
        expect(mockRefetch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('validation', () => {
    let localStore;
    let localState;
    const mockDispatch = jest.fn();
    beforeEach(() => {
      localState = mockLocalState(
        {},
        {
          join_organisation_ids: {
            status: 'INVALID',
            message: 'This is invalid',
          },
        }
      );
      localStore = storeFake(localState);
      localStore.dispatch = mockDispatch;
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        data: response,
        isSuccess: true,
        isError: false,
        isLoading: false,
      });
    });

    it('renders the correct helper text', async () => {
      renderWithProviders(localStore);
      expect(screen.getByText(/Traded to/i)).toBeInTheDocument();
      expect(screen.getByText(/This is invalid/i)).toBeInTheDocument();
    });
  });
});
