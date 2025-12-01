import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { getIsPanelOpen } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/createFixtureSelectors';
import { REDUCER_KEY as CREATE_FIXTURE_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/createFixtureSlice';
import CreateFixturePanel from '..';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/createFixtureSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/createFixtureSelectors'
    ),
    getIsPanelOpen: jest.fn(),
  })
);

const props = {
  t: i18nT,
};

const mockSelectors = ({ isOpen = false }) => {
  getIsPanelOpen.mockReturnValue(isOpen);
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  [CREATE_FIXTURE_REDUCER_KEY]: {},
};

describe('<CreateFixturePanel />', () => {
  describe('NOT OPEN', () => {
    beforeEach(() => {
      mockSelectors({ isOpen: false });
    });
    it('does not render', () => {
      render(
        <Provider store={storeFake(defaultStore)}>
          <CreateFixturePanel />
        </Provider>
      );
      expect(screen.queryByText('Create Fixture')).not.toBeInTheDocument();
    });
  });

  describe('IS OPEN', () => {
    beforeEach(() => {
      mockSelectors({ isOpen: true });
    });
    it('does render', () => {
      render(
        <Provider store={storeFake(defaultStore)}>
          <CreateFixturePanel {...props} />
        </Provider>
      );
      expect(screen.getByText('Create Fixture')).toBeInTheDocument();
    });
  });
});
