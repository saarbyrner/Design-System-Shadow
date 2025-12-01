import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useUnsavedChanges from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';
import useSaveRegistration from '@kitman/modules/src/LeagueOperations/shared/hooks/useSaveRegistration';
import useRegistrationOperations from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationOperations';
import { SAVE_PROGRESS_FEATURE_FLAG } from '@kitman/modules/src/LeagueOperations/shared/consts/index';

import ButtonSaveProgress from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationOperations'
);
jest.mock('@kitman/modules/src/HumanInput/hooks/useUnsavedChanges');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useSaveRegistration'
);

const i18nT = i18nextTranslateStub();

const props = {
  t: i18nT,
};

const mockedUseRegistrationOperations = useRegistrationOperations;
const mockedUseUnsavedChanges = useUnsavedChanges;
const mockedUseSaveRegistration = useSaveRegistration;
const handleOnSaveRegistration = jest.fn();

const setup = ({
  featureFlag = true,
  permissions = false,
  unsavedChanges = false,
  isSaveInProgress = false,
  isRefetchingProfile = false,
}) => {
  window.featureFlags[SAVE_PROGRESS_FEATURE_FLAG] = featureFlag;
  mockedUseRegistrationOperations.mockReturnValue({
    registration: {
      athlete: {
        canCreate: !!permissions,
      },
      staff: {
        canCreate: !!permissions,
      },
    },
  });
  mockedUseUnsavedChanges.mockReturnValue({
    hasUnsavedChanges: unsavedChanges,
  });
  mockedUseSaveRegistration.mockReturnValue({
    handleOnSaveRegistration,
    isSaveInProgress,
    isRefetchingProfile,
  });
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => state,
  });
  render(
    <Provider store={storeFake({})}>
      <ButtonSaveProgress {...props} />
    </Provider>
  );
};

describe('<ButtonSaveProgress/>', () => {
  afterEach(() => {
    window.featureFlags = {};
  });

  it('renders when feature flag is true and canCreate is true', () => {
    setup({ featureFlag: true, permissions: true });

    expect(
      screen.getByRole('button', { name: 'Save Progress' })
    ).toBeInTheDocument();
  });

  it('does not render when feature flag is false', () => {
    setup({ featureFlag: false, permissions: true });
    expect(() =>
      screen.getByRole('button', { name: 'Save Progress' })
    ).toThrow();
  });

  it('does not render when canCreate is false', () => {
    setup({ featureFlag: true, permissions: false });
    expect(() =>
      screen.getByRole('button', { name: 'Save Progress' })
    ).toThrow();
  });

  it('calls handleOnSaveRegistration when clicked', async () => {
    const user = userEvent.setup();

    setup({ featureFlag: true, permissions: true, unsavedChanges: true });

    expect(screen.getByRole('button', { name: 'Save Progress' })).toBeEnabled();
    const button = screen.getByRole('button', { name: /Save Progress/i });
    await user.click(button);

    expect(handleOnSaveRegistration).toHaveBeenCalled();
  });

  it('is disabled when there are no unsaved changes', () => {
    setup({ featureFlag: true, permissions: true, unsavedChanges: false });

    expect(
      screen.getByRole('button', { name: 'Save Progress' })
    ).toBeDisabled();
  });

  it('is disabled when save is in progress', () => {
    setup({
      featureFlag: true,
      permissions: true,
      unsavedChanges: true,
      isSaveInProgress: true,
    });

    expect(
      screen.getByRole('button', { name: 'Save Progress' })
    ).toBeDisabled();
  });

  it('is disabled when profile is being refetched', () => {
    setup({
      featureFlag: true,
      permissions: true,
      unsavedChanges: true,
      isRefetchingProfile: true,
    });

    expect(
      screen.getByRole('button', { name: 'Save Progress' })
    ).toBeDisabled();
  });

  it('is enabled when there are unsaved changes, save is not in progress, and profile is not being refetched', () => {
    setup({
      featureFlag: true,
      permissions: true,
      unsavedChanges: true,
      isSaveInProgress: false,
      isRefetchingProfile: false,
    });

    expect(screen.getByRole('button', { name: 'Save Progress' })).toBeEnabled();
  });
});
