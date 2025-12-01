import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import * as channelSettingsActions from '../../components/ChannelSettingsSidePanel/actions';
import ChannelSettingsSidePanelContainer from '../ChannelSettingsSidePanel';

jest.mock('../../components/ChannelSettingsSidePanel/actions');

describe('ChannelSettingsSidePanel Container', () => {
  const preloadedState = {
    athleteChat: {
      currentChannel: {
        sid: '123',
        friendlyName: 'Test Channel',
        description: 'For tests',
        creationType: 'private',
        avatarUrl: 'https://someurl.com',
      },
      currentChannelExtraData: {
        memberRole: 'channel admin',
      },
      userRole: {
        permissions: {
          canAdministrateChannel: true,
        },
      },
      searchableItemGroups: { staff: [], athletes: [] },
    },
    messagingSidePanel: {
      activeSidePanel: 'ChannelSettings',
    },
    channelSettingsSidePanel: {
      channelIconUrl: null,
      status: 'IDLE',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the panel title when active', () => {
    renderWithRedux(<ChannelSettingsSidePanelContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByText(/channel settings/i)).toBeInTheDocument();
  });

  it('dispatches the close action when the close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<ChannelSettingsSidePanelContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    const closeButton = screen.getByTestId('panel-close-button');
    await user.click(closeButton);

    expect(
      channelSettingsActions.closeChannelSettingsSidePanel
    ).toHaveBeenCalledTimes(1);
  });

  it('does not render when the side panel is not active', () => {
    const closedState = {
      ...preloadedState,
      messagingSidePanel: { activeSidePanel: null },
    };
    const { container } = renderWithRedux(
      <ChannelSettingsSidePanelContainer />,
      {
        preloadedState: closedState,
        useGlobalStore: false,
      }
    );

    expect(container).toBeEmptyDOMElement();
  });
});
