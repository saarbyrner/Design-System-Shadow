import * as reduxHooks from 'react-redux';
import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useRegistrationOperations from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationOperations';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import { getRequirementById } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import useApproveRegistration from '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration';

import { useCompleteRegistration } from '@kitman/modules/src/LeagueOperations/RegistrationRequirementsApp/src/components/RequirementsActions/hooks/useCompleteRegistration';
import useRegistrationHistory from '@kitman/modules/src/LeagueOperations/shared/components/RegistrationHistoryPanel/hooks/useRegistrationHistory';
import RequirementsHeader from '..';

jest.mock('@kitman/common/src/hooks/useLocationSearch');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationOperations'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration'
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/components/RegistrationHistoryPanel/hooks/useRegistrationHistory'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/components/RegistrationHistoryPanel/hooks/useRegistrationHistory'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/RegistrationRequirementsApp/src/components/RequirementsActions/hooks/useCompleteRegistration'
);

setI18n(i18n);
const i18nT = i18nextTranslateStub();

const props = {
  isLoading: false,
  user: MOCK_REGISTRATION_PROFILE,
  t: i18nT,
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state,
});

const mockSelectors = () => {
  getRequirementById.mockReturnValue(
    () => MOCK_REGISTRATION_PROFILE.registrations[0]
  );
};

const renderWithProviders = (storeArg, children) => {
  render(<Provider store={storeArg}>{children}</Provider>);
};

describe('<RequirementsHeader/>', () => {
  beforeEach(() => {
    jest.spyOn(reduxHooks, 'useSelector').mockReturnValue({
      id: null,
      user_id: 161211,
      status: 'incomplete',
      division: {
        id: 1,
        name: 'KLS Next',
      },
      registration_requirement: {
        id: 14,
        active: true,
      },
    });
    useApproveRegistration.mockReturnValue({
      isApproveDisabled: false,
      isLoading: false,
      isError: false,
      onOpenPanel: jest.fn(),
    });

    useCompleteRegistration.mockReturnValue({
      isShown: false,
      onClick: jest.fn(),
    });

    useRegistrationHistory.mockReturnValue({
      isVisible: false,
      isDisabled: false,
      onOpenPanel: jest.fn(),
    });
    mockSelectors();
    delete window.location;
    window.location = new URL(
      'http://localhost/registration/requirements?requirement_id=14&user_id=161978'
    );
    useLocationSearch.mockReturnValue(
      new URLSearchParams({ user_id: '161978', requirement_id: 1 })
    );
    useRegistrationOperations.mockReturnValue({
      registration: {
        athlete: {
          canCreate: false,
        },
        staff: {
          canCreate: false,
        },
      },
    });
    renderWithProviders(storeFake({}), <RequirementsHeader {...props} />);
  });
  it('renders the requirements header', () => {
    expect(
      screen.getByText(
        `${MOCK_REGISTRATION_PROFILE.firstname} ${MOCK_REGISTRATION_PROFILE.lastname}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: MOCK_REGISTRATION_PROFILE.firstname })
    ).toBeInTheDocument();

    expect(screen.getByText('KLS Next')).toBeInTheDocument();

    expect(screen.getByText('Incomplete')).toBeInTheDocument();

    expect(screen.getByText('D.O.B.')).toBeInTheDocument();

    expect(screen.getByText('Age')).toBeInTheDocument();

    expect(screen.getByText('Country')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });
});
