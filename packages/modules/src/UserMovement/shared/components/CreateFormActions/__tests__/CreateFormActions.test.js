import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { initialState as initialCreateMovementState } from '@kitman/modules/src/UserMovement/shared/utils/index';
import { REDUCER_KEY as createMovementReducerKey } from '../../../redux/slices/createMovementSlice';
import CreateFormActions from '..';

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <CreateFormActions {...props} />
    </Provider>
  );
};
const tradeTransferType = { transfer_type: 'trade' };
const retireTransferType = { transfer_type: 'retire' };
const releaseTransferType = { transfer_type: 'release' };
const multiAssignTransferType = { transfer_type: 'multi_assign' };
const medicalTransferType = { transfer_type: 'medical_trial' };

const mockLocalState = (mockFormState = {}, mockValidationState = {}) => {
  return {
    'UserMovement.slice.createMovement': {
      ...initialCreateMovementState,
      form: {
        ...initialCreateMovementState.form,
        ...mockFormState,
      },
      validation: {
        ...initialCreateMovementState.validation,
        ...mockValidationState,
      },
    },
  };
};

const renderCreateFormActions = (mockFormState = {}, status = null) => {
  let validationState;

  switch (mockFormState.transfer_type) {
    case 'trade':
      validationState = {
        join_organisation_ids: { status },
        join_squad_ids: { status },
        leave_organisation_ids: { status },
      };
      break;
    case 'retire':
    case 'release':
      validationState = { leave_organisation_ids: { status } };
      break;
    case 'medical_trial':
      validationState = { join_organisation_ids: { status } };
      break;
    case 'multi_assign':
      validationState = {
        join_organisation_ids: { status },
        join_squad_ids: { status },
      };
      break;
    default:
      validationState = {};
  }
  renderWithProviders(
    storeFake(mockLocalState(mockFormState, validationState))
  );
};

describe('<CreateFormActions/>', () => {
  const testTransferType = (transferType) => {
    it('renders the actions in default state', () => {
      renderCreateFormActions(transferType);
      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Review' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Review' })).toBeDisabled();
    });

    it('renders the retry action as disabled when the form state keys are INVALID', () => {
      renderCreateFormActions(transferType, 'INVALID');
      expect(screen.getByRole('button', { name: 'Review' })).toBeDisabled();
    });

    it('renders the retry action as disabled when the form state keys are PENDING', () => {
      renderCreateFormActions(transferType, 'PENDING');
      expect(screen.getByRole('button', { name: 'Review' })).toBeDisabled();
    });
    it('renders the retry action as enabled when the form state keys are VALID', () => {
      renderCreateFormActions(transferType, 'VALID');
      expect(screen.getByRole('button', { name: 'Review' })).toBeEnabled();
    });
  };

  describe('transfer_type TRADE', () => {
    testTransferType(tradeTransferType);
  });

  describe('transfer_type RETIRE', () => {
    testTransferType(retireTransferType);
  });
  describe('transfer_type RELEASE', () => {
    testTransferType(releaseTransferType);
  });

  describe('transfer_type MEDICAL_TRIAL', () => {
    testTransferType(medicalTransferType);
  });

  describe('transfer_type MULTI_ASSIGN', () => {
    testTransferType(multiAssignTransferType);
  });

  describe('dispatch', () => {
    const mockDispatch = jest.fn();
    let localStore;
    let localState;

    beforeEach(() => {
      localState = mockLocalState(tradeTransferType, {
        join_organisation_ids: { status: 'VALID' },
        join_squad_ids: { status: 'VALID' },
        leave_organisation_ids: { status: 'VALID' },
      });
      localStore = storeFake(localState);
      localStore.dispatch = mockDispatch;
    });

    it('dispatches the correct event for Cancel', async () => {
      renderWithProviders(localStore);
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: `${createMovementReducerKey}/onReset`,
      });
    });

    it('dispatches the correct event for Review', async () => {
      renderWithProviders(localStore);
      const reviewButton = screen.getByRole('button', { name: 'Review' });
      await userEvent.click(reviewButton);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: `${createMovementReducerKey}/onToggleModal`,
      });
    });
  });
});
