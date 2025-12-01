import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';

import { MOCK_REGISTRATION_SQUAD } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import { getSquad } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationSquadSelectors';

import TabSquadDetails from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationSquadSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationSquadSelectors'
    ),
    getSquad: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const props = {
  t: i18nextTranslateStub(),
};

const renderWithProviders = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <TabSquadDetails {...props} />
    </Provider>
  );
};

const mockSelectors = () => {
  getSquad.mockReturnValue(MOCK_REGISTRATION_SQUAD);
};

describe('<TabSquadDetails/>', () => {
  describe('Squad details', () => {
    beforeEach(() => {
      mockSelectors();

      renderWithProviders(storeFake({}));
    });
    it('renders the squad details card', () => {
      expect(screen.getByText('Name:')).toBeInTheDocument();
      expect(screen.getByText('U13')).toBeInTheDocument();
      expect(screen.getByText('Address:')).toBeInTheDocument();
      expect(
        screen.getByText(
          '64523524a609c745dbaca047, Cazadero, [object Object], 679, Elm Avenue, Coleridge Street, Tennessee, 6782'
        )
      ).toBeInTheDocument();
    });
  });
});
