import i18n from 'i18next';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { useFetchRequirementSectionHistoryQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';
import {
  getRequirementById,
  getPanelFormSectionId,
  getRegistrationProfile,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import { getIsPanelOpen } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationHistorySelectors';
import { REDUCER_KEY as REQUIREMENTS_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';
import { REDUCER_KEY as HISTORY_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationHistorySlice';

import RequirementHistory from '../components/RequirementHistory';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi'
    ),
    useFetchRequirementSectionHistoryQuery: jest.fn(),
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
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationHistorySelectors'
    ),
    getRequirementById: jest.fn(),
    getPanelFormSectionId: jest.fn(),
    getRegistrationProfile: jest.fn(),
  })
);

const props = {
  t: i18nT,
};

const mockSelectors = ({ isOpen = false }) => {
  getIsPanelOpen.mockReturnValue(isOpen);
  getRegistrationProfile.mockReturnValue(MOCK_REGISTRATION_PROFILE);
  getPanelFormSectionId.mockReturnValue(1);
  getRequirementById.mockReturnValue(() => 1);
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

describe('<RequirementHistory/>', () => {
  describe('initial render with no data', () => {
    beforeEach(() => {
      useFetchRequirementSectionHistoryQuery.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });
      mockSelectors({ isOpen: false });
      render(
        <Provider store={storeFake(defaultStore)}>
          <RequirementHistory {...props} />
        </Provider>
      );
    });
    it('renders, but is disabled', () => {
      expect(
        screen.getByRole('button', { name: 'Show requirement history' })
      ).toBeInTheDocument();
    });
  });

  describe('data available', () => {
    beforeEach(() => {
      mockSelectors({ isOpen: true });
      useFetchRequirementSectionHistoryQuery.mockReturnValue({
        data: {
          status_history: [
            {
              id: 1,
              status: 'approved',
              registration_system_status: {
                id: 1,
                name: 'Approved',
                type: 'approved',
              },
              created_at: '2024-07-15T11:03:49Z',
              current_status: false,
              annotations: [],
            },
          ],
        },
        isLoading: false,
        isError: false,
      });
      render(
        <Provider store={storeFake(defaultStore)}>
          <RequirementHistory {...props} />
        </Provider>
      );
    });
    it('renders', async () => {
      const user = userEvent.setup();
      const button = screen.getByRole('button', {
        name: 'Show requirement history',
      });
      await user.click(button);
      expect(screen.getByText('MLS Next')).toBeInTheDocument();
      expect(screen.getByText('Approved')).toBeInTheDocument();
      expect(screen.getByText('Jul 15, 2024 - 11:03am')).toBeInTheDocument();
    });
  });
});
