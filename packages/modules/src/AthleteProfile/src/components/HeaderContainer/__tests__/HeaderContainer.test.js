import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  i18nextTranslateStub,
  renderWithProvider,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { initialState as initialFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { setI18n } from 'react-i18next';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { useResetAthletePasswordMutation } from '@kitman/services/src/services/humanInput/humanInput';
import { HeaderContainerTranslated as HeaderContainer } from '../HeaderContainer';
import { getResetPasswordModalTranslations } from '../utils/helpers';

setI18n(i18n);

const resetAthletePasswordMutationMock = jest.fn();

jest.mock(
  '@kitman/services/src/services/humanInput/api/athleteProfile/updateAthleteProfile'
);
jest.mock('@kitman/services/src/services/humanInput/humanInput', () => ({
  ...jest.requireActual('@kitman/services/src/services/humanInput/humanInput'),
  useResetAthletePasswordMutation: jest.fn(),
}));
jest.mock('@kitman/common/src/hooks/useLocationPathname', () => jest.fn());

const userMock = { email: 'pikachu@pokémon.com', username: 'PikachuKetchum' };

const defaultStore = {
  formStateSlice: {
    ...initialFormState,
    structure: {
      id: 1,
      user: userMock,
    },
    form: {
      1: 'Test Answer 1',
      2: 'Test Answer 2',
      3: 'Test Answer 3',
    },
    config: {
      mode: MODES.VIEW,
    },
  },
  formValidationSlice: {
    validation: {},
  },
};

describe('HeaderContainer', () => {
  const props = {
    athlete: { fullname: 'Test Name' },
    t: i18nextTranslateStub(),
    athleteId: 1,
  };

  const withPermission = {
    permissions: {
      settings: {
        canViewSettingsAthletes: true,
      },
    },
    permissionsRequestStatus: 'SUCCESS',
  };

  const renderComponent = ({
    permissions = withPermission,
    store = defaultStore,
    customProps = props,
  }) =>
    renderWithProvider(
      <MockedPermissionContextProvider permissionsContext={permissions}>
        <HeaderContainer {...customProps} />
      </MockedPermissionContextProvider>,
      storeFake(store)
    );

  beforeEach(() => {
    useLocationPathname.mockImplementation(() => '/athletes/1/profile');
    useResetAthletePasswordMutation.mockReturnValue([
      resetAthletePasswordMutationMock,
      { isLoading: false },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('VIEW MODE', () => {
    it('renders in VIEW mode with athlete name', () => {
      renderComponent({});

      expect(screen.getByText('Test Name')).toBeInTheDocument();
      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Name');
    });

    it('renders in VIEW mode without athlete name', () => {
      renderComponent({
        customProps: { athlete: null },
      });

      expect(screen.getByText('View athlete')).toBeInTheDocument();
      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('View athlete');
    });

    it('renders in VIEW mode with athlete name and form title if provided', () => {
      renderComponent({
        customProps: {
          ...props,
          formTitle: 'Form Title example',
        },
      });

      expect(
        screen.getByText('Test Name - Form Title example')
      ).toBeInTheDocument();
    });
  });

  describe('EDIT MODE', () => {
    const editModeState = {
      ...defaultStore,
      formStateSlice: {
        ...initialFormState,
        config: { mode: MODES.EDIT },
      },
    };

    it('renders in EDIT mode with athlete name', () => {
      renderComponent({ store: editModeState });

      expect(screen.getByText('Test Name')).toBeInTheDocument();
      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Name');
    });

    it('renders in EDIT mode without athlete name', () => {
      renderComponent({ store: editModeState, customProps: { athlete: null } });

      expect(screen.getByText('Edit athlete')).toBeInTheDocument();
      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Edit athlete');
    });

    it('renders in EDIT mode with athlete name and form title if provided', () => {
      renderComponent({
        store: editModeState,
        customProps: {
          ...props,
          formTitle: 'Form Title example',
        },
      });

      expect(
        screen.getByText('Test Name - Form Title example')
      ).toBeInTheDocument();
    });
  });

  describe('CREATE MODE', () => {
    const createModeState = {
      ...defaultStore,
      formStateSlice: {
        ...initialFormState,
        config: { mode: MODES.CREATE },
      },
    };

    it('renders in CREATE mode', () => {
      renderComponent({ store: createModeState });

      expect(screen.getByText('Create athlete')).toBeInTheDocument();
      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Create athlete');
    });
  });

  it("should enable the user to reset the athlete's password", async () => {
    const user = userEvent.setup();
    const modalTranslations = getResetPasswordModalTranslations({
      athleteName: props.athlete.fullname,
      athleteUsername: userMock.username,
    });
    renderComponent({});

    const resetPasswordButton = screen.getByRole('button', {
      name: 'Reset Password',
    });
    expect(resetPasswordButton).toBeInTheDocument();
    await user.click(resetPasswordButton);

    expect(
      screen.getByRole('heading', { name: modalTranslations.title })
    ).toBeInTheDocument();
    expect(
      screen.getByText(modalTranslations.content.text)
    ).toBeInTheDocument();

    const emailInput = screen.getByDisplayValue(userMock.email);
    const newEmail = 'Oak@professor.com';
    expect(emailInput).toBeInTheDocument();
    await user.clear(emailInput);
    await user.type(emailInput, newEmail);

    await user.click(
      screen.getByRole('button', { name: modalTranslations.actions.ctaButton })
    );

    expect(resetAthletePasswordMutationMock).toHaveBeenCalledWith({
      athleteId: props.athleteId,
      email: newEmail,
    });
  });
});
