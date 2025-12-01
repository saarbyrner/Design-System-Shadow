import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import useRegistrationHistory from '@kitman/modules/src/LeagueOperations/shared/components/RegistrationHistoryPanel/hooks/useRegistrationHistory';

import { getRegistrationProfile } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';

import { getIsPanelOpen } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationHistorySelectors';

import { REDUCER_KEY as REQUIREMENTS_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';
import { REDUCER_KEY as HISTORY_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationHistorySlice';

import RegistrationHistoryPanel from '..';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
    ),
    getRegistrationProfile: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationHistorySelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationHistorySelectors'
    ),
    getIsPanelOpen: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/components/RegistrationHistoryPanel/hooks/useRegistrationHistory'
);

const props = {
  t: i18nT,
};

const mockSelectors = ({ isOpen = false }) => {
  getIsPanelOpen.mockReturnValue(isOpen);
  getRegistrationProfile.mockReturnValue(MOCK_REGISTRATION_PROFILE);
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  [REQUIREMENTS_REDUCER_KEY]: {},
  [HISTORY_REDUCER_KEY]: {
    panel: {
      isOpen: false,
    },
  },
};

const userName = `${MOCK_REGISTRATION_PROFILE.firstname} ${MOCK_REGISTRATION_PROFILE.lastname}`;

describe('<RegistrationHistoryPanel/>', () => {
  describe('NOT OPEN', () => {
    beforeEach(() => {
      useRegistrationHistory.mockReturnValue({
        history: [],
      });
      mockSelectors({ isOpen: false });
      render(
        <Provider store={storeFake(defaultStore)}>
          <RegistrationHistoryPanel {...props} />
        </Provider>
      );
    });
    it('does not render', () => {
      expect(() => screen.getByText(userName)).toThrow();
    });
  });

  describe('IS OPEN', () => {
    beforeEach(() => {
      mockSelectors({ isOpen: true });
      useRegistrationHistory.mockReturnValue({
        history: [],
      });
      render(
        <Provider store={storeFake(defaultStore)}>
          <RegistrationHistoryPanel {...props} />
        </Provider>
      );
    });
    it('does render', () => {
      expect(screen.getByText(userName)).toBeInTheDocument();
      expect(screen.getByText('Registration history')).toBeInTheDocument();
      expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
    });
  });
});
