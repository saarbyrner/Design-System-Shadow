import { Provider } from 'react-redux';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { screen, render } from '@testing-library/react';
import { response as mockHistoryResponse } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_post_movement_record_history';

import { getId } from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';

import {
  getMovementHistory,
  getMovementHistoryResult,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementHistorySelectors';
import { movementAssertions } from '../../../utils/test_utils';

import MovementActivityDrawer from '..';

jest.mock('../../../redux/selectors/movementProfileSelectors', () => ({
  ...jest.requireActual('../../../redux/selectors/movementProfileSelectors'),
  getId: jest.fn(),
}));

jest.mock('../../../redux/selectors/movementHistorySelectors', () => ({
  ...jest.requireActual('../../../redux/selectors/movementHistorySelectors'),
  getMovementHistory: jest.fn(),
  getMovementHistoryResult: jest.fn(),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockSelectors = () => {
  getId.mockReturnValue(11111);

  getMovementHistory.mockReturnValue(() => mockHistoryResponse.data);
  getMovementHistoryResult.mockReturnValue(mockHistoryResponse);
};

setI18n(i18n);
const i18nT = i18nextTranslateStub();

const props = {
  isLoading: false,
  t: i18nT,
};

const defaultStore = {};

const renderWithProviders = (storeArg, localProps) => {
  render(
    <Provider store={storeArg}>
      <MovementActivityDrawer {...props} {...localProps} />
    </Provider>
  );
};

describe('<HistoryMovementRecords/>', () => {
  beforeEach(() => {
    mockSelectors();
  });
  it('renders the loading state', () => {
    renderWithProviders(storeFake(defaultStore), { isLoading: true });
    expect(
      screen.getByTestId('HistoryMovementRecords|LoadingState')
    ).toBeInTheDocument();
  });

  describe('the records', () => {
    beforeEach(() => {
      mockSelectors();
      renderWithProviders(storeFake(defaultStore));
    });
    test.each(movementAssertions)(
      'does render the entire movement history',
      (row) => {
        expect(
          screen.getByRole('row', {
            name: row,
          })
        ).toBeInTheDocument();
      }
    );
  });
});
