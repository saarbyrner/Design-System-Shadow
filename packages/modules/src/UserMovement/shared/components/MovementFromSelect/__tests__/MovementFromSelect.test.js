import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { initialState as initialCreateMovementState } from '../../../utils/index';
import { REDUCER_KEY as createMovementReducerKey } from '../../../redux/slices/createMovementSlice';

import {
  initialState as initialProfileState,
  REDUCER_KEY as movementProfileState,
} from '../../../redux/slices/movementProfileSlice';
import { data as mockAthletes } from '../../../redux/services/mocks/data/mock_search_athletes';
import {
  getUserProfile,
  getProfileResult,
} from '../../../redux/selectors/movementProfileSelectors';

import { mockUserResult, sixthFebruary2024 } from '../../../utils/test_utils';

import MovementFromSelect from '..';

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

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <MovementFromSelect {...props} />
    </Provider>
  );
};

const defaultFormState = {
  user_id: 1,
  transfer_type: 'trade',
  join_organisation_ids: [],
  leave_organisation_ids: [],
  joined_at: sixthFebruary2024,
};

const mockLocalState = (
  mockedFormState,
  mockedProfileState,
  mockValidationState
) => {
  return {
    [createMovementReducerKey]: {
      ...initialCreateMovementState,
      form: {
        ...defaultFormState,
        ...mockedFormState,
      },
      validation: {
        leave_organisation_ids: {
          status: 'PENDING',
          message: null,
        },
        ...mockValidationState,
      },
    },

    [movementProfileState]: {
      profile: {
        ...initialProfileState,
        ...mockedProfileState,
      },
    },
  };
};

/** mockCreateSelector
 * This was a frustrating case of trial and error.
 * Given an endpoint that accepts params and a selector to get the result:
 * const getFetchResult = (params) => myApi.endpoints.fetchData.select(params)
 * Given another selector that uses this selector as an argument to createSelector:
 * export const getFetch = (params) =>
 *     createSelector([getFetchResult(params)], (response) => response.data);
 *
 * If I have a component that uses the selector that acceptas a selector as an argument,
 * both selectors need to be mocked.
 *
 * In this scenario, it just so happens my endpoint only returns a single object
 * But given a scenario where the endpoint returns a list and you wish to select one object
 * from that list
 *
 * Well, this is how you do that.
 */

jest.mock('../../../redux/selectors/movementProfileSelectors', () => ({
  ...jest.requireActual('../../../redux/selectors/movementProfileSelectors'),
  getProfileResult: jest.fn(),
  getUserProfile: jest.fn(),
}));

const mockCreateSelector = () => {
  getProfileResult.mockReturnValue(mockUserResult);
  getUserProfile.mockReturnValue(() => mockUserResult.data);
};

describe('<MovementFromSelect/>', () => {
  describe('selecting a value', () => {
    let localStore;
    let localState;
    const mockDispatch = jest.fn();

    describe('selecting a value', () => {
      beforeEach(() => {
        localState = mockLocalState(defaultFormState, mockAthletes[0]);
        localStore = storeFake(localState);
        localStore.dispatch = mockDispatch;
        mockCreateSelector();
      });
      it('selects the correct value', async () => {
        renderWithProviders(localStore);
        expect(screen.getByText(/Traded from/i)).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await userEvent.click(screen.getByRole('img', { name: 'KL Galaxy' }));
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            leave_organisation_ids: [1267],
          },
          type: `${createMovementReducerKey}/onUpdateCreateMovementForm`,
        });
        expect(screen.getByRole('combobox')).toHaveValue('KL Galaxy');
      });
    });

    describe('clearing a value', () => {
      beforeEach(() => {
        localState = mockLocalState(
          {
            leave_organisation_ids: [1267],
          },
          mockAthletes[0]
        );
        localStore = storeFake(localState);
        localStore.dispatch = mockDispatch;
      });
      it('clears the values', async () => {
        renderWithProviders(localStore);
        expect(screen.getByRole('combobox')).toHaveValue('KL Galaxy');

        await userEvent.click(screen.getByRole('button', { name: 'Open' }));
        await userEvent.clear(screen.getByRole('combobox'));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            leave_organisation_ids: [],
          },
          type: `${createMovementReducerKey}/onUpdateCreateMovementForm`,
        });
      });
    });
  });

  describe('validation', () => {
    let localStore;
    let localState;
    const mockDispatch = jest.fn();
    beforeEach(() => {
      localState = mockLocalState(defaultFormState, initialProfileState, {
        leave_organisation_ids: {
          status: 'INVALID',
          message: 'This is invalid',
        },
      });
      localStore = storeFake(localState);
      localStore.dispatch = mockDispatch;
      mockCreateSelector();
    });
    it('renders the correct helper text', async () => {
      renderWithProviders(localStore);
      expect(screen.getByText(/Traded from/i)).toBeInTheDocument();
      expect(screen.getByText(/This is invalid/i)).toBeInTheDocument();
    });
  });
});
