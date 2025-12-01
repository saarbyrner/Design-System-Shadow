import { Provider } from 'react-redux';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { screen, fireEvent, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getId } from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';
import { getDrawerState } from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';
import { usePostMovementRecordHistoryQuery } from '@kitman/modules/src/UserMovement/shared/redux/services';
import { response as mockHistoryResponse } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_post_movement_record_history';
import { REDUCER_KEY as movementProfileReducerKey } from '@kitman/modules/src/UserMovement/shared/redux/slices/movementProfileSlice';
import { REDUCER_KEY as createMovementReducerKey } from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';

import { medicalTrialAssertions } from '../../../utils/test_utils';
import ActiveMedicalTrials from '..';

const ALTERED_MOVEMENT_HISTORY = mockHistoryResponse.data
  .map((i) => {
    return {
      ...i,
      transfer_type: i.transfer_type === 'trade' ? 'trial' : i.transfer_type,
    };
  })
  .filter((i) => i.transfer_type === 'trial');

jest.mock('@kitman/modules/src/UserMovement/shared/redux/services');

jest.mock('../../../redux/selectors/movementProfileSelectors', () => ({
  ...jest.requireActual('../../../redux/selectors/movementProfileSelectors'),
  getId: jest.fn(),
}));

jest.mock('../../../redux/selectors/createMovementSelectors', () => ({
  ...jest.requireActual('../../../redux/selectors/createMovementSelectors'),
  getDrawerState: jest.fn(),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockSelectors = () => {
  getId.mockReturnValue(11111);
  getDrawerState.mockReturnValue({ isOpen: true });
};

setI18n(i18n);
const i18nT = i18nextTranslateStub();

const props = {
  t: i18nT,
};

const defaultStore = {
  [createMovementReducerKey]: {
    drawer: {
      isOpen: false,
    },
  },
  [movementProfileReducerKey]: {
    id: 11111,
  },
};

const mockQueries = () => {
  usePostMovementRecordHistoryQuery.mockReturnValue({
    data: {
      data: ALTERED_MOVEMENT_HISTORY,
      meta: mockHistoryResponse.meta,
    },
    isSuccess: true,
    isLoading: false,
    isError: false,
    isFetching: false,
  });
};

const renderWithProviders = (storeArg, localProps) => {
  render(
    <Provider store={storeArg}>
      <ActiveMedicalTrials {...props} {...localProps} />
    </Provider>
  );
};

describe('<ActiveMedicalTrials/>', () => {
  describe('the medical trials', () => {
    beforeEach(() => {
      mockSelectors();
      mockQueries();
      renderWithProviders(storeFake(defaultStore));
    });
    it('renders the correct count', () => {
      expect(
        screen.getByRole('button', {
          name: 'Active Medical Trials (5)',
        })
      ).toBeInTheDocument();
    });
    test.each(medicalTrialAssertions)(
      'does render the active medical trials',
      async (row) => {
        const toggleButton = screen.getByRole('button', {
          name: 'Active Medical Trials (5)',
        });
        await fireEvent.click(toggleButton);
        expect(
          screen.getByRole('row', {
            name: row,
          })
        ).toBeInTheDocument();
      }
    );
  });
});
