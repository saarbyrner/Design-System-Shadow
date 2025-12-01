import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useSearchAvailableSquadsQuery } from '@kitman/modules/src/UserMovement/shared/redux/services';

import { initialState as initialCreateMovementState } from '../../../utils/index';
import { REDUCER_KEY as createMovementReducerKey } from '../../../redux/slices/createMovementSlice';

import { response } from '../../../redux/services/mocks/data/mock_search_available_squads';

import { sixthFebruary2024 } from '../../../utils/test_utils';

import MovementSquadSelect from '..';

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
    useSearchAvailableSquadsQuery: jest.fn(),
  },
};

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <MovementSquadSelect {...props} />
    </Provider>
  );
};

const defaultFormState = {
  user_id: null,
  transfer_type: 'trade',
  join_organisation_ids: [],
  join_squad_ids: [],
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
        join_squad_ids: {
          status: 'PENDING',
          message: null,
        },
        ...mockValidationState,
      },
    },

    'UserMovement.services': {
      useSearchAvailableSquadsQuery: jest.fn(),
    },
  };
};

describe('<MovementSquadSelect/>', () => {
  describe('sad paths', () => {
    it('is disabled while loading', () => {
      useSearchAvailableSquadsQuery.mockReturnValue({
        data: null,
        isLoading: true,
      });
      renderWithProviders(storeFake(defaultStore));

      expect(screen.getByText(/Team/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('is renders the alert when isError', () => {
      useSearchAvailableSquadsQuery.mockReturnValue({
        data: null,
        isError: true,
      });
      renderWithProviders(storeFake(defaultStore));

      expect(screen.getByText(/No teams/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Team options failed to load/i)
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('is renders the alert when noDataError', () => {
      useSearchAvailableSquadsQuery.mockReturnValue({
        data: [],
        isSuccess: true,
      });
      renderWithProviders(storeFake(defaultStore));

      expect(screen.getByText('No teams')).toBeInTheDocument();
      expect(
        screen.getByText(
          /There are no teams associated with this organisation/i
        )
      ).toBeInTheDocument();
    });
  });

  describe('selecting a value', () => {
    let localStore;
    let localState;
    const mockDispatch = jest.fn();

    describe('selecting a value', () => {
      beforeEach(() => {
        localState = mockLocalState({ join_organisation_ids: [115] });
        localStore = storeFake(localState);
        localStore.dispatch = mockDispatch;
        useSearchAvailableSquadsQuery.mockReturnValue({
          data: response,
          isSuccess: true,
          isError: false,
          isLoading: false,
        });
      });
      it('selects the correct value', async () => {
        renderWithProviders(localStore);
        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await userEvent.click(screen.getByRole('option', { name: 'U19' }));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            join_squad_ids: [115],
          },
          type: `${createMovementReducerKey}/onUpdateCreateMovementForm`,
        });
        expect(screen.getByRole('combobox')).toHaveValue('U19');
      });
    });

    describe('clearing a value', () => {
      beforeEach(() => {
        localState = mockLocalState({
          join_organisation_ids: [115],
          join_squad_ids: [115],
        });
        localStore = storeFake(localState);
        localStore.dispatch = mockDispatch;
        useSearchAvailableSquadsQuery.mockReturnValue({
          data: response,
          isSuccess: true,
          isError: false,
          isLoading: false,
        });
      });
      it('clears the values', async () => {
        renderWithProviders(localStore);
        expect(screen.getByRole('combobox')).toHaveValue('U19');

        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await userEvent.clear(screen.getByRole('combobox'));
        await userEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
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
        useSearchAvailableSquadsQuery.mockReturnValue({
          data: [],
          isSuccess: true,
          isError: false,
          isLoading: false,
        });
      });
      it('renders the no data alert', async () => {
        renderWithProviders(localStore);
        expect(screen.getByText('No teams')).toBeInTheDocument();
        expect(
          screen.getByText(
            /There are no teams associated with this organisation/i
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
        useSearchAvailableSquadsQuery.mockReturnValue({
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
        { join_organisation_ids: [115] },
        {
          join_squad_ids: {
            status: 'INVALID',
            message: 'This is invalid',
          },
        }
      );
      localStore = storeFake(localState);
      localStore.dispatch = mockDispatch;
      useSearchAvailableSquadsQuery.mockReturnValue({
        data: response,
        isSuccess: true,
        isError: false,
        isLoading: false,
      });
    });

    it('renders the correct helper text', async () => {
      renderWithProviders(localStore);
      expect(screen.getByText(/Team/i)).toBeInTheDocument();
      expect(screen.getByText(/This is invalid/i)).toBeInTheDocument();
    });
  });
});
