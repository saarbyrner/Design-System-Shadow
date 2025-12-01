import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChannelMembersSidePanel from '..';

const preloadedState = {
  athleteChat: {
    searchableItemGroups: { staff: [], athletes: [] },
  },
};

describe('<ChannelMembersSidePanel /> component', () => {
  const staff = [{ id: 'uidStaff1', firstname: 'staff', lastname: 'member 1' }];
  const baseProps = {
    userRole: { staffUserId: 'uidStaff3' },
    staff,
    athletes: [],
    squads: [],
    channelMembers: [
      { friendlyName: 'Test Athlete', memberKind: 'ATHLETE' },
      { friendlyName: 'Test Staff', memberKind: 'STAFF' },
    ],
    updateRequestStatus: 'IDLE',
    onClose: jest.fn(),
    onAddOrRemoveChannelMembers: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "Reset" and "Save" action buttons', () => {
    renderWithRedux(<ChannelMembersSidePanel {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders the view/add tabs correctly', () => {
    renderWithRedux(<ChannelMembersSidePanel {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(
      screen.getByRole('button', { name: 'Current members' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add members' })
    ).toBeInTheDocument();
  });

  it('defaults to the "Current members" view', () => {
    renderWithRedux(<ChannelMembersSidePanel {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('Athletes')).toBeInTheDocument();
  });

  it('switches to the "Add members" view when the tab is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<ChannelMembersSidePanel {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    await user.click(screen.getByRole('button', { name: 'Add members' }));

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.queryByText('Athletes')).not.toBeInTheDocument();
  });

  it('renders a loading status when updateRequestStatus is IN_PROGRESS', () => {
    renderWithRedux(
      <ChannelMembersSidePanel
        {...baseProps}
        updateRequestStatus="IN_PROGRESS"
      />,
      { preloadedState, useGlobalStore: false }
    );
    expect(screen.getByText('Updating members')).toBeInTheDocument();
  });

  it('does not render a loading status when updateRequestStatus is not in progress', () => {
    renderWithRedux(
      <ChannelMembersSidePanel {...baseProps} updateRequestStatus="COMPLETE" />,
      { preloadedState, useGlobalStore: false }
    );
    expect(screen.queryByText('Updating members')).not.toBeInTheDocument();
  });
});
