import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { initialState as initialCreateMovementState } from '../../../utils/index';

import { REDUCER_KEY as createMovementReducerKey } from '../../../redux/slices/createMovementSlice';

import MovementDate from '..';

import { sixthFebruary2024 } from '../../../utils/test_utils';

const props = {
  movementType: null,
  date: sixthFebruary2024,
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultFormState = {
  user_id: null,
  transfer_type: null,
  join_organisation_ids: [],
  leave_organisation_ids: [],
  joined_at: sixthFebruary2024,
};

const mockLocalState = (mockedFormState) => {
  return {
    [createMovementReducerKey]: {
      ...initialCreateMovementState,
      form: {
        ...defaultFormState,
        ...mockedFormState,
      },
    },
  };
};

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <MovementDate {...props} />
    </Provider>
  );
};

describe('<MovementDate/>', () => {
  it('renders the default values when no movementType is passed', () => {
    renderWithProviders(storeFake(mockLocalState()));
    expect(screen.getByText(/Unsupported:/i)).toBeInTheDocument();
    expect(screen.getByText('6 Feb 2024')).toBeInTheDocument();
  });

  describe('different movemment types', () => {
    const assertions = [
      { expected: 'Medical Trial Date', movementType: 'medical_trial' },
      { expected: 'Multi Assign Date', movementType: 'multi_assign' },
      { expected: 'Retired Date', movementType: 'retire' },
      { expected: 'Date of Trade', movementType: 'trade' },
      { expected: 'Release Date', movementType: 'release' },
      { expected: 'Loan Date', movementType: 'loan' },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct label for ${assertion.movementType}`, () => {
        renderWithProviders(
          storeFake(mockLocalState({ transfer_type: assertion.movementType }))
        );
        expect(screen.getByText(`${assertion.expected}:`)).toBeInTheDocument();
        expect(screen.getByText('6 Feb 2024')).toBeInTheDocument();
      });
    });
  });
});
