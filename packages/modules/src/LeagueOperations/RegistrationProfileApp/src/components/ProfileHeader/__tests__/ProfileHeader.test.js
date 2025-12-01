import * as reduxHooks from 'react-redux';
import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';

import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { data as MOCK_ACTIVE_SQUAD } from '@kitman/services/src/mocks/handlers/getActiveSquad';
import getCurrentAge from '@kitman/common/src/utils/getCurrentAge';

import ProfileHeader from '..';

jest.mock('@kitman/common/src/hooks/useLocationSearch');
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getActiveSquad: jest.fn(),
}));
jest.mock('@kitman/common/src/utils/getCurrentAge');

const props = {
  isLoading: false,
  user: MOCK_REGISTRATION_PROFILE,
  t: i18nextTranslateStub(),
};
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const defaultStore = storeFake({
  globalApi: {},
});

const commonProfileTest = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <ProfileHeader {...props} />
    </Provider>
  );
  expect(
    screen.getByText(
      `${MOCK_REGISTRATION_PROFILE.firstname} ${MOCK_REGISTRATION_PROFILE.lastname}`
    )
  ).toBeInTheDocument();
  expect(
    screen.getByRole('img', { name: MOCK_REGISTRATION_PROFILE.firstname })
  ).toBeInTheDocument();
};

const commonItemsTest = (storeArg) => {
  render(
    <Provider store={storeArg}>
      <ProfileHeader {...props} />
    </Provider>
  );
  expect(screen.getByText('D.O.B.')).toBeInTheDocument();
  expect(screen.getByText('Jun 2, 1989')).toBeInTheDocument();

  expect(screen.getByText('Age')).toBeInTheDocument();
  expect(screen.getByText('35')).toBeInTheDocument();

  expect(screen.getByText('Country')).toBeInTheDocument();
  expect(screen.getByText('Guadeloupe')).toBeInTheDocument();

  expect(screen.getByText('KLS Next')).toBeInTheDocument();

  expect(screen.getByText('Guadeloupe')).toBeInTheDocument();

  expect(screen.getByText('Incomplete')).toBeInTheDocument();
};

describe('<ProfileHeader/>', () => {
  beforeEach(() => {
    window.featureFlags['league-ops-update-registration-status'] = false;
    getActiveSquad.mockReturnValue(() => MOCK_ACTIVE_SQUAD);
    getCurrentAge.mockReturnValue('35');
  });

  describe('<ProfileHeader/>', () => {
    // eslint-disable-next-line jest/expect-expect
    it('renders the profile header', () => {
      commonProfileTest(storeFake(defaultStore));
    });

    // eslint-disable-next-line jest/expect-expect
    it('renders the profile items', () => {
      commonItemsTest(storeFake(defaultStore));
    });
  });

  it('renders the profile header with correct division, when FF is on', () => {
    window.featureFlags['league-ops-update-registration-status'] = true;

    render(
      <Provider store={storeFake(defaultStore)}>
        <ProfileHeader {...props} />
      </Provider>
    );

    expect(screen.getByText('KLS')).toBeInTheDocument();
  });
  describe('<ProfileHeader/> viewing another', () => {
    beforeEach(() => {
      jest.spyOn(reduxHooks, 'useDispatch').mockReturnValue(jest.fn());
      jest
        .spyOn(reduxHooks, 'useSelector')
        .mockImplementation(() => MODES.VIEW);

      delete window.location;
      window.location = new URL(
        'http://localhost/registration/profile?id=162786'
      );
      useLocationSearch.mockReturnValue(new URLSearchParams({ id: '162786' }));
    });
    // eslint-disable-next-line jest/expect-expect
    it('renders the profile header', () => {
      commonProfileTest(storeFake(defaultStore));
    });

    // eslint-disable-next-line jest/expect-expect
    it('renders the profile items', () => {
      commonItemsTest(storeFake(defaultStore));
    });

    it('renders the back link', () => {
      render(
        <Provider store={storeFake(defaultStore)}>
          <ProfileHeader {...props} />
        </Provider>
      );
      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    });
  });
});
