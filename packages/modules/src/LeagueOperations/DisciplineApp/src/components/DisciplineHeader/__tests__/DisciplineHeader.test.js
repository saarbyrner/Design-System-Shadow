import userEvent from '@testing-library/user-event';
import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { onTogglePanel } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import { getDisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import {
  MOCK_PERMISSIONS,
  MOCK_NO_PERMISSIONS,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import DisciplineHeader from '..';

const props = {
  t: i18nextTranslateStub(),
};

const mockDispatch = jest.fn();

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getDisciplinePermissions: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({});

const renderWithProviders = (storeArg, children) => {
  render(<Provider store={storeArg}>{children}</Provider>);
};

describe('<DisciplineHeader/>', () => {
  describe('User can add discipline', () => {
    beforeEach(() => {
      getDisciplinePermissions.mockReturnValue(
        () => MOCK_PERMISSIONS.discipline
      );
    });
    it('renders', () => {
      renderWithProviders(defaultStore, <DisciplineHeader {...props} />);

      expect(screen.getByText(`Discipline`)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Suspend' })
      ).toBeInTheDocument();
    });

    it('toggles the panel action', async () => {
      const user = userEvent.setup();
      const store = defaultStore;
      store.dispatch = mockDispatch;
      renderWithProviders(store, <DisciplineHeader {...props} />);
      await user.click(screen.getByRole('button', { name: 'Suspend' }));

      expect(mockDispatch).toHaveBeenCalledWith(
        onTogglePanel({ isOpen: true })
      );
    });
  });
  describe('User cannot add discipline', () => {
    beforeEach(() => {
      getDisciplinePermissions.mockReturnValue(
        () => MOCK_NO_PERMISSIONS.discipline
      );
    });
    it('renders with suspend button disabled', () => {
      renderWithProviders(defaultStore, <DisciplineHeader {...props} />);

      expect(screen.getByText(`Discipline`)).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Suspend' })
      ).not.toBeInTheDocument();
    });
  });
});
