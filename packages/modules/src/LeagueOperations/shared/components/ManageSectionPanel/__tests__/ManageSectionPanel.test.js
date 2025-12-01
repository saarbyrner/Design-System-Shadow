import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import {
  getIsPanelOpen,
  getRegistrationProfile,
  getPanelFormElement,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';

import { REDUCER_KEY as REQUIREMENTS_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';
import useManageSection from '@kitman/modules/src/LeagueOperations/shared/components/ManageSectionPanel/hooks/useManageSection';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';

import ManageSectionPanel from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
    ),
    getIsPanelOpen: jest.fn(),
    getRegistrationProfile: jest.fn(),
    getPanelFormElement: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/components/ManageSectionPanel/hooks/useManageSection'
);

const mockSelectors = ({
  isOpen = false,
  formElement = {
    id: 25681,
    element_id: 'playerdetails',
    title: 'Player Details',
  },
}) => {
  getIsPanelOpen.mockReturnValue(isOpen);
  getRegistrationProfile.mockReturnValue(MOCK_REGISTRATION_PROFILE);
  getPanelFormElement.mockReturnValue(formElement);
  useManageSection.mockReturnValue({ isSectionValid: false });
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const genStore = (mode = 'VIEW') => ({
  [REQUIREMENTS_REDUCER_KEY]: {
    panel: {
      isOpen: false,
      formElement: null,
    },
    approval: {
      status: null,
      annotation: '',
    },
    requirementId: null,
    userId: null,
    profile: null,
  },
  formValidationSlice: {},
  formMenuSlice: {},
  formStateSlice: {
    structure: {
      form_template_version: {
        form_elements: [],
      },
    },
    config: {
      mode,
    },
  },
});

const defaultStore = () => storeFake(genStore());

const renderWithProviders = (store = defaultStore()) => {
  render(
    <Provider store={store}>
      <ManageSectionPanel />
    </Provider>
  );
};

const userName = `${MOCK_REGISTRATION_PROFILE.firstname} ${MOCK_REGISTRATION_PROFILE.lastname}`;
const mockRegistrationStatuses = [{ value: 'pending', label: 'Pending' }];

describe('<ManageSectionPanel/>', () => {
  describe('NOT OPEN', () => {
    beforeEach(() => {
      mockSelectors({ isOpen: false });
      renderWithProviders();
    });
    it('does not render', () => {
      expect(() => screen.getByText(userName)).toThrow();
    });
  });

  describe('IS OPEN', () => {
    beforeEach(() => {
      mockSelectors({ isOpen: true });
      useRegistrationStatus.mockReturnValue({
        sectionStatus: mockRegistrationStatuses,
        isSuccessSectionStatuses: false,
      });
      renderWithProviders();
    });
    it('does render', () => {
      expect(screen.getByText(userName)).toBeInTheDocument();
      expect(screen.getByText('Player Details')).toBeInTheDocument();
      expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
    });
  });
});
