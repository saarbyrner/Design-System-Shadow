import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import useApproveRegistration from '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';

import { getRegistrationProfile } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';

import { getIsPanelOpen } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationApprovalSelectors';

import { REDUCER_KEY as REQUIREMENTS_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';
import { REDUCER_KEY as APPROVAL_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationApprovalSlice';

import ApproveRegistrationPanel from '..';

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
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationApprovalSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationApprovalSelectors'
    ),
    getIsPanelOpen: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus'
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
  [APPROVAL_REDUCER_KEY]: {
    approval: {
      status: null,
    },
  },
};

const userName = `${MOCK_REGISTRATION_PROFILE.firstname} ${MOCK_REGISTRATION_PROFILE.lastname}`;

describe('<ApproveRegistrationPanel/>', () => {
  describe('NOT OPEN', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-update-registration-status'] = false;
      mockSelectors({ isOpen: false });
      render(
        <Provider store={storeFake(defaultStore)}>
          <ApproveRegistrationPanel {...props} />
        </Provider>
      );
    });
    it('does not render', () => {
      expect(() => screen.getByText(userName)).toThrow();
    });
  });

  describe('IS OPEN', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-update-registration-status'] = true;
      useApproveRegistration.mockReturnValue({
        approvalOptions: [
          { value: 'approve', label: 'Approve' },
          { value: 'reject', label: 'Reject' },
        ],
      });
      useRegistrationStatus.mockReturnValue({
        registrationFilterStatuses: [{ value: 'pending', label: 'Pending' }],
      });

      mockSelectors({ isOpen: true });
      render(
        <Provider store={storeFake(defaultStore)}>
          <ApproveRegistrationPanel {...props} />
        </Provider>
      );
    });
    it('does render', () => {
      expect(screen.getByText(userName)).toBeInTheDocument();
      expect(screen.getByText('Approve Registration')).toBeInTheDocument();
      expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
    });
  });
});
