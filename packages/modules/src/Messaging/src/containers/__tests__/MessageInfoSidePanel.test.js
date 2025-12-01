import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import moment from 'moment';
import MessageInfoSidePanelContainer from '../MessageInfoSidePanel';
import * as messageInfoActions from '../../components/MessageInfoSidePanel/actions';

// Mock the entire actions module to spy on the dispatched actions
jest.mock('../../components/MessageInfoSidePanel/actions');

// Mock the MessageBubble component to simplify assertions
jest.mock('../../components/MessageBubble', () => ({
  MessageBubbleTranslated: ({ message }) => (
    <div data-testid="message-bubble">{message.body}</div>
  ),
}));

describe('MessageInfoSidePanel Container', () => {
  let preloadedState;
  const date1 = moment('2020-11-01T12:00:00Z');
  const date2 = moment('2020-11-02T12:01:00Z');
  const date3 = moment('2020-11-03T13:00:00Z');

  beforeEach(() => {
    jest.clearAllMocks();

    preloadedState = {
      athleteChat: {
        username: 'id1',
        selectedMessageIndex: 2,
        selectedMessageMediaChangedTime: null,
        currentChannel: {
          sid: '123',
        },
        currentChannelExtraData: {
          members: [
            { messagingIdentity: 'id1', lastReadMessageIndex: 1 },
            { messagingIdentity: 'id2', lastReadMessageIndex: 1 },
            { messagingIdentity: 'id3', lastReadMessageIndex: 2 },
            { messagingIdentity: 'id4', lastReadMessageIndex: 0 },
          ],
        },
        messages: [
          {
            messageType: 'ME',
            body: 'First Hello!',
            index: 1,
            authorDetails: { authorName: 'Author1', friendlyName: 'Nice 1' },
            time: '12:00 pm',
            date: date1,
          },
          {
            messageType: 'ME',
            body: 'Second message from me!',
            index: 2,
            authorDetails: { authorName: 'Author1', friendlyName: 'Nice 1' },
            time: '12:01 pm',
            date: date2,
          },
          {
            messageType: 'THEM',
            body: 'Hey there!',
            index: 3,
            authorDetails: { authorName: 'Author2', friendlyName: 'Nice 2' },
            time: '1:00 pm',
            date: date3,
          },
        ],
        searchableItemGroups: {
          staff: [],
          athletes: [],
          privateChannels: [],
          directChannels: [],
        },
      },
      messagingSidePanel: {
        activeSidePanel: 'MessageInfo',
      },
    };
  });

  it('renders and displays the correct message based on selectedMessageIndex', () => {
    renderWithRedux(<MessageInfoSidePanelContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The state selects message with index 2, which is "Second message from me!"
    expect(screen.getByTestId('message-bubble')).toHaveTextContent(
      'Second message from me!'
    );
  });

  it('displays the correct members in "Read by" and "Delivered to" sections', () => {
    renderWithRedux(<MessageInfoSidePanelContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const readBySection = screen
      .getByText('Read')
      .closest('.chatMessageInfo__readGroup');
    expect(within(readBySection).getByText('id3')).toBeInTheDocument();
    expect(within(readBySection).queryByText('id2')).not.toBeInTheDocument();
    expect(within(readBySection).queryByText('id4')).not.toBeInTheDocument();

    const deliveredToSection = screen
      .getByText('Unread')
      .closest('.chatMessageInfo__unreadGroup');
    expect(within(deliveredToSection).getByText('id2')).toBeInTheDocument();
    expect(within(deliveredToSection).getByText('id4')).toBeInTheDocument();
    expect(
      within(deliveredToSection).queryByText('id3')
    ).not.toBeInTheDocument();
  });

  it('maps dispatch to props and calls closeMessageInfoSidePanel when the close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRedux(<MessageInfoSidePanelContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The side panel component should have a close button
    const closeButton = screen.getByTestId('panel-close-button');
    await user.click(closeButton);

    expect(messageInfoActions.closeMessageInfoSidePanel).toHaveBeenCalledTimes(
      1
    );
  });

  it('does not render if the activeSidePanel is not "MessageInfo"', () => {
    preloadedState.messagingSidePanel.activeSidePanel = 'SomeOtherPanel';
    const { container } = renderWithRedux(<MessageInfoSidePanelContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The component should render null, so its container should be empty
    expect(container).toBeEmptyDOMElement();
  });
});
