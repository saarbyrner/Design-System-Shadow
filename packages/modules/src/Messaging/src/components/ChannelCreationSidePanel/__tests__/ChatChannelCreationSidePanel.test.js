import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ChatChannelCreationSidePanel from '../index';

const preloadedState = {
  athleteChat: {
    searchableItemGroups: { staff: [], athletes: [] },
  },
};

describe('<ChatChannelCreationSidePanel /> component', () => {
  const staff = [{ id: 'uidStaff2', firstname: 'staff', lastname: 'member 2' }];
  const baseProps = {
    userRole: { staffUserId: 'uidStaff3' },
    staff,
    squads: [],
    channelType: 'private',
    onCreate: jest.fn(),
    onClose: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the member selection step (step 0) by default', () => {
    renderWithRedux(<ChatChannelCreationSidePanel {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });
    expect(screen.getByText('Channel members')).toBeInTheDocument();
    expect(screen.queryByText('Channel details')).not.toBeInTheDocument();
  });

  it('renders the details step (step 1) when flowStep prop is 1', () => {
    renderWithRedux(
      <ChatChannelCreationSidePanel {...baseProps} flowStep={1} />,
      {
        preloadedState,
        useGlobalStore: false,
      }
    );
    expect(screen.getByText('Channel details')).toBeInTheDocument();
    expect(screen.queryByText('Channel members')).not.toBeInTheDocument();
  });
});
