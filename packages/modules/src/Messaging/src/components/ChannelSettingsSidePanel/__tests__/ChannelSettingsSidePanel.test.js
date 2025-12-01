import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { CHANNEL_CREATION } from '@kitman/modules/src/Messaging/src/types';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import ChannelSettingsSidePanel from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<ChannelSettingsSidePanel />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      allowEdit: true,
      status: 'IDLE',
      currentChannel: {
        sid: '123',
        friendlyName: 'Test Channel',
        description: 'For tests',
        creationType: 'private',
        avatarUrl: 'https://someurl.com',
      },
      onClose: jest.fn(),
      onUpdateChannelDetails: jest.fn(),
      onOpenChannelImageUploadModal: jest.fn(),
      onUpdateNotificationLevel: jest.fn(),
      t: i18nextTranslateStub(),
    };
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: jest.fn(),
    });
  });

  it('renders the component with editable inputs and enabled buttons', () => {
    render(<ChannelSettingsSidePanel {...baseProps} />);

    // Check that inputs are rendered with the correct values and are enabled
    const nameInput = screen.getByLabelText('Channel name');
    expect(nameInput).toHaveValue('Test Channel');
    expect(nameInput).toBeEnabled();

    const descriptionInput = screen.getByLabelText('Description');
    expect(descriptionInput).toHaveValue('For tests');
    expect(descriptionInput).toBeEnabled();

    // Check that buttons are rendered and enabled
    expect(
      screen.getByRole('button', { name: 'Upload new avatar' })
    ).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('calls onUpdateChannelDetails with form data when the save button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChannelSettingsSidePanel {...baseProps} />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(baseProps.onUpdateChannelDetails).toHaveBeenCalledTimes(1);
    expect(baseProps.onUpdateChannelDetails).toHaveBeenCalledWith(
      '123',
      'Test Channel',
      'For tests',
      'https://someurl.com'
    );
  });

  it('renders the component with disabled inputs and buttons when allowEdit is false', () => {
    render(<ChannelSettingsSidePanel {...baseProps} allowEdit={false} />);

    // Check that inputs are disabled
    expect(screen.getByLabelText('Channel name')).toBeDisabled();
    expect(screen.getByLabelText('Description')).toBeDisabled();

    // Check that action buttons are disabled
    expect(
      screen.getByRole('button', { name: 'Upload new avatar' })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();

    // The 'Cancel' button should still be enabled
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  });

  it('does not renders the component with inputs when channel is "direct"', () => {
    render(
      <ChannelSettingsSidePanel
        {...baseProps}
        currentChannel={{
          ...baseProps.currentChannel,
          creationType: CHANNEL_CREATION.DIRECT,
        }}
      />
    );

    const channelNameInput = screen.queryByLabelText('Channel name');
    expect(channelNameInput).not.toBeInTheDocument();

    const descriptionInput = screen.queryByLabelText('Description');
    expect(descriptionInput).not.toBeInTheDocument();

    const uploadButton = screen.queryByRole('button', {
      name: 'Upload new avatar',
    });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(uploadButton).not.toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('does not renders Switch Mute notifications when feature flags are disabled', () => {
    render(<ChannelSettingsSidePanel {...baseProps} />);

    expect(screen.queryByText('Mute notifications')).not.toBeInTheDocument();
  });

  describe('when feature flags [cp-messaging-notifications] and [single-page-application] are enabled', () => {
    beforeEach(() => {
      window.setFlag('cp-messaging-notifications', true);
      window.setFlag('single-page-application', true);
    });

    afterEach(() => {
      window.setFlag('cp-messaging-notifications', false);
      window.setFlag('single-page-application', false);
    });

    it('does renders Switch Mute notifications', () => {
      render(<ChannelSettingsSidePanel {...baseProps} />);

      expect(screen.getByText('Mute notifications')).toBeInTheDocument();
    });

    it('does renders the component with enabled "Save" button when allowEdit is false and isNotificationEnabled is true', () => {
      render(<ChannelSettingsSidePanel {...baseProps} allowEdit={false} />);

      // Inputs are disabled
      expect(screen.getByLabelText('Channel name')).toBeDisabled();
      expect(screen.getByLabelText('Description')).toBeDisabled();

      // Action buttons are disabled
      expect(
        screen.getByRole('button', { name: 'Upload new avatar' })
      ).toBeDisabled();

      // Cancel and Save buttons are enabled
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    });

    it('renders the component with enabled buttons and inputs when allowEdit and isNotificationEnabled are true', () => {
      render(<ChannelSettingsSidePanel {...baseProps} allowEdit />);

      // Inputs are enabled
      expect(screen.getByLabelText('Channel name')).toBeEnabled();
      expect(screen.getByLabelText('Description')).toBeEnabled();

      // Action buttons are enabled
      expect(
        screen.getByRole('button', { name: 'Upload new avatar' })
      ).toBeEnabled();

      // Cancel and Save buttons are enabled
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    });
  });
});
