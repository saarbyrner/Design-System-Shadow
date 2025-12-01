import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { initialState as initialCreateMovementState } from '../../../utils/index';
import { REDUCER_KEY } from '../../../redux/slices/createMovementSlice';
import MovementInstructions from '..';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <MovementInstructions />
    </Provider>
  );
};

const defaultFormState = {
  user_id: 1,
  transfer_type: 'trade',
  join_organisation_ids: [],
  leave_organisation_ids: [],
  joined_at: moment().format(dateTransferFormat),
};

const mockLocalState = (mockedFormState) => {
  return {
    [REDUCER_KEY]: {
      ...initialCreateMovementState,
      form: {
        ...defaultFormState,
        ...mockedFormState,
      },
    },
  };
};

describe('<MovementInstructions/>', () => {
  describe('different movemment types', () => {
    const assertions = [
      {
        type: 'medical_trial',
        expected: {
          title: 'Medical Trial will:',
          steps: [
            'Give the chosen club access to this players medical records for 3 days.',
          ],
        },
      },
      {
        type: 'multi_assign',
        expected: {
          title: 'Multi Assignment will:',
          steps: [
            'Add the player to the selected club.',
            'Keep the player in their current club(s) if any.',
          ],
        },
      },
      {
        type: 'retire',
        expected: {
          title: 'Retiring will:',
          steps: [
            'Remove the player from the selected club.',
            'Add the player to the league as a retired player.',
          ],
        },
      },
      {
        type: 'trade',
        expected: {
          title: 'Trade will:',
          steps: [
            'Remove the player from the selected club.',
            'Add the player to the new club.',
            'Add the player to the new team/squad.',
          ],
        },
      },
      {
        type: 'release',
        expected: {
          title: 'Releasing will:',
          steps: ['Remove the player from the selected club.'],
        },
      },
      {
        type: 'loan',
        expected: {
          title: 'Loan will:',
          steps: [
            'Remove the player from the selected club.',
            'Keep the player in their current club(s) if any.',
          ],
        },
      },
    ];

    assertions.forEach((assertion) => {
      it(`returns the correct title and steps for ${assertion.type}`, () => {
        const localState = mockLocalState({
          transfer_type: assertion.type,
        });
        const localStore = storeFake(localState);
        renderWithProviders(localStore);
        expect(screen.getByText(assertion.expected.title)).toBeInTheDocument();
        assertion.expected.steps.forEach((step) => {
          expect(screen.getByText(step)).toBeInTheDocument();
        });
      });
    });
  });
});
