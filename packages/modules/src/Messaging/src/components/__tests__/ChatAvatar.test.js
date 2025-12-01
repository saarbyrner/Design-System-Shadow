import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import ChatAvatar from '../ChatAvatar';

const preloadedState = {
  athleteChat: {
    searchableItemGroups: {
      staff: [
        { identifier: 'id||001', avatar_url: undefined },
        {
          identifier: 'id||002',
          avatar_url: 'https://www.someimage.com/img_002.jpg',
        },
      ],
      athletes: [],
    },
  },
};

jest.mock('../ChannelAvatar', () => ({ url, size }) => (
  <div data-testid="mock-channel-avatar" data-url={url} data-size={size} />
));

describe('<ChatAvatar /> component', () => {
  const baseProps = {
    userIdentity: 'id||002',
    size: 'SMALL',
  };

  it('passes the correct url for the provided userIdentity', () => {
    renderWithRedux(<ChatAvatar {...baseProps} />, {
      preloadedState,
      useGlobalStore: false,
    });

    const avatar = screen.getByTestId('mock-channel-avatar');
    expect(avatar).toHaveAttribute(
      'data-url',
      'https://www.someimage.com/img_002.jpg'
    );
  });

  it('passes an undefined url if the userIdentity cannot be matched', () => {
    renderWithRedux(<ChatAvatar {...baseProps} userIdentity="unmatchable" />, {
      preloadedState,
      useGlobalStore: false,
    });

    const avatar = screen.getByTestId('mock-channel-avatar');
    expect(avatar).not.toHaveAttribute('data-url');
  });

  it('passes an undefined url if the matched user has no avatar_url', () => {
    renderWithRedux(<ChatAvatar {...baseProps} userIdentity="id||001" />, {
      preloadedState,
      useGlobalStore: false,
    });

    const avatar = screen.getByTestId('mock-channel-avatar');
    expect(avatar).not.toHaveAttribute('data-url');
  });

  it('passes the correct size prop to the child component', () => {
    renderWithRedux(<ChatAvatar {...baseProps} size="LARGE" />, {
      preloadedState,
      useGlobalStore: false,
    });

    const avatar = screen.getByTestId('mock-channel-avatar');
    expect(avatar).toHaveAttribute('data-size', 'LARGE');
  });
});
