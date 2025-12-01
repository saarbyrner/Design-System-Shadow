import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useApproveRegistration from '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration';
import useRegistrationHistory from '@kitman/modules/src/LeagueOperations/shared/components/RegistrationHistoryPanel/hooks/useRegistrationHistory';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useCompleteRegistration } from '../hooks/useCompleteRegistration';
import RequirementsActions from '../index';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/components/RegistrationHistoryPanel/hooks/useRegistrationHistory'
);
jest.mock('../hooks/useCompleteRegistration');

const userData = { id: 1, name: 'Test User' };
const requirementId = 123;

describe('RequirementsActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Approve action and triggers onClick', async () => {
    const onOpenPanelMock = jest.fn();
    const user = userEvent.setup();

    useApproveRegistration.mockReturnValue({
      isApproveDisabled: false,
      isApproveVisible: true,
      isLoading: false,
      isError: false,
      onOpenPanel: onOpenPanelMock,
    });

    useCompleteRegistration.mockReturnValue({
      isVisible: false,
      onClick: jest.fn(),
      isRegistrationExternallyManaged: false,
    });

    useRegistrationHistory.mockReturnValue({
      isVisible: false,
      isDisabled: false,
      onOpenPanel: jest.fn(),
    });

    render(
      <RequirementsActions
        user={userData}
        requirementId={requirementId}
        t={i18nextTranslateStub()}
      />
    );

    const desktopActions = screen.getByTestId('reg-req-header-desktop-actions');

    const approveButton = within(desktopActions).getByText('Approve');
    expect(approveButton).toBeInTheDocument();
    expect(approveButton).toBeEnabled();

    await user.click(approveButton);
    expect(onOpenPanelMock).toHaveBeenCalledWith(true);
  });

  it('disables Approve when loading/error/disabled', () => {
    useApproveRegistration.mockReturnValue({
      isApproveDisabled: true,
      isApproveVisible: true,
      isLoading: false,
      isError: false,
      onOpenPanel: jest.fn(),
    });

    useCompleteRegistration.mockReturnValue({
      isVisible: false,
      onClick: jest.fn(),
      isRegistrationExternallyManaged: false,
    });

    useRegistrationHistory.mockReturnValue({
      isVisible: false,
      isDisabled: false,
      onOpenPanel: jest.fn(),
    });

    render(
      <RequirementsActions
        user={userData}
        requirementId={requirementId}
        t={i18nextTranslateStub}
      />
    );
    const desktopActions = screen.getByTestId('reg-req-header-desktop-actions');

    expect(within(desktopActions).getByText('Approve')).toBeDisabled();
  });

  it('renders Register action and triggers onClick', async () => {
    const onClickMock = jest.fn();
    const user = userEvent.setup();

    useApproveRegistration.mockReturnValue({
      isApproveDisabled: false,
      isApproveVisible: true,
      isLoading: false,
      isError: false,
      onOpenPanel: jest.fn(),
    });

    useCompleteRegistration.mockReturnValue({
      isVisible: true,
      onClick: onClickMock,
      isRegistrationExternallyManaged: false,
    });

    useRegistrationHistory.mockReturnValue({
      isVisible: false,
      isDisabled: false,
      onOpenPanel: jest.fn(),
    });

    render(
      <RequirementsActions
        user={userData}
        requirementId={requirementId}
        t={i18nextTranslateStub}
      />
    );

    const desktopActions = screen.getByTestId('reg-req-header-desktop-actions');
    const completeButton = within(desktopActions).getByText('Register');
    await user.click(completeButton);
    expect(onClickMock).toHaveBeenCalled();
  });

  it('renders History action and triggers onClick', async () => {
    const onOpenHistoryMock = jest.fn();
    const user = userEvent.setup();

    useApproveRegistration.mockReturnValue({
      isApproveDisabled: false,
      isApproveVisible: true,
      isLoading: false,
      isError: false,
      onOpenPanel: jest.fn(),
    });

    useCompleteRegistration.mockReturnValue({
      isVisible: false,
      onClick: jest.fn(),
      isRegistrationExternallyManaged: false,
    });

    useRegistrationHistory.mockReturnValue({
      isVisible: true,
      isDisabled: false,
      onOpenPanel: onOpenHistoryMock,
    });

    render(
      <RequirementsActions
        user={userData}
        requirementId={requirementId}
        t={i18nextTranslateStub()}
      />
    );

    const desktopActions = screen.getByTestId('reg-req-header-desktop-actions');
    const historyButton = within(desktopActions).getByText('History');
    await user.click(historyButton);
    expect(onOpenHistoryMock).toHaveBeenCalledWith(true);
  });

  it('disables Registration History button when isDisabled is true', () => {
    useApproveRegistration.mockReturnValue({
      isApproveDisabled: false,
      isApproveVisible: true,
      isLoading: false,
      isError: false,
      onOpenPanel: jest.fn(),
    });

    useCompleteRegistration.mockReturnValue({
      isVisible: false,
      onClick: jest.fn(),
      isRegistrationExternallyManaged: false,
    });

    useRegistrationHistory.mockReturnValue({
      isVisible: true,
      isDisabled: true,
      onOpenPanel: jest.fn(),
    });

    render(
      <RequirementsActions
        user={userData}
        requirementId={requirementId}
        t={i18nextTranslateStub}
      />
    );

    const desktopActions = screen.getByTestId('reg-req-header-desktop-actions');
    expect(within(desktopActions).getByText('History')).toBeDisabled();
  });

  it('does not render Approve action and History action when isRegistrationExternallyManaged is true', () => {
    useCompleteRegistration.mockReturnValue({
      isVisible: false,
      onClick: jest.fn(),
      isRegistrationExternallyManaged: true,
    });

    render(
      <RequirementsActions
        user={userData}
        requirementId={requirementId}
        t={i18nextTranslateStub}
      />
    );

    const desktopActions = screen.getByTestId('reg-req-header-desktop-actions');
    expect(
      within(desktopActions).queryByText('Approve')
    ).not.toBeInTheDocument();
    expect(
      within(desktopActions).queryByText('History')
    ).not.toBeInTheDocument();
  });
});
