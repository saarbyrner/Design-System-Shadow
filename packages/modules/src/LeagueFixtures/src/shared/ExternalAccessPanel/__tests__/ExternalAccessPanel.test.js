import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  getIsPanelOpen,
  getGameId,
} from '@kitman/modules/src/LeagueFixtures/src/redux/selectors/externalAccessSelectors';
import { REDUCER_KEY } from '@kitman/modules/src/LeagueFixtures/src/redux/slices/ExternalAccessSlice';

import ExternalAccessSidePanel from '..';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/LeagueFixtures/src/redux/selectors/externalAccessSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueFixtures/src/redux/selectors/externalAccessSelectors'
    ),
    getIsPanelOpen: jest.fn(),
    getGameId: jest.fn(),
  })
);

const props = {
  t: i18nT,
  fixtures: [
    {
      id: 1111,
      type: 'game_event',
      squad: {
        owner_name: 'KL Club1',
      },
      opponent_squad: {
        owner_name: 'KL Club2',
      },
      start_date: '2024-10-28T00:00:00Z',
    },
    {
      id: 2222,
      type: 'game_event',
      squad: {
        owner_name: 'KL Club1',
      },
      opponent_squad: {
        owner_name: 'KL Club2',
      },
      start_date: '2024-10-28T00:00:00Z',
    },
  ],
};

const mockSelectors = ({ isOpen = false, gameId = 1111 }) => {
  getIsPanelOpen.mockReturnValue(isOpen);
  getGameId.mockReturnValue(gameId);
};

const defaultStore = {
  [REDUCER_KEY]: {},
};

describe('<ExternalAccessSidePanel />', () => {
  const renderComponent = (extraProps) => {
    return renderWithRedux(
      <ExternalAccessSidePanel {...props} {...extraProps} />,
      {
        preloadedState: defaultStore,
        useGlobalStore: true,
      }
    );
  };
  describe('NOT OPEN', () => {
    beforeEach(() => {
      mockSelectors({ isOpen: false });
    });
    it('does not render', () => {
      renderComponent();
      expect(screen.queryByText('Request Access')).not.toBeInTheDocument();
    });
  });

  describe('IS OPEN', () => {
    beforeEach(() => {
      mockSelectors({ isOpen: true });
    });
    it('does render', () => {
      renderComponent();
      expect(
        screen.getByText('Request access to KL Club1 vs KL Club2')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Maximum number of requests per game: 5')
      ).toBeInTheDocument();
    });
  });
});
