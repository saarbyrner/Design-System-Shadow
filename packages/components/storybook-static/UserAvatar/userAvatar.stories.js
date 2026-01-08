// @flow

import UserAvatar from '.';
import type { Props } from '.';

export default {
  title: 'UserAvatar',
  component: UserAvatar,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['EXTRA_SMALL', 'SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'],
      },
    },
    statusColor: {
      control: {
        type: 'color',
      },
    },
    url: {
      control: {
        type: 'text',
      },
    },
    userInitials: {
      control: {
        type: 'text',
      },
    },
    firstname: {
      control: {
        type: 'text',
      },
    },
    lastname: {
      control: {
        type: 'text',
      },
    },
  },
};

export const Basic = (inputArgs: Props) => {
  return <UserAvatar {...inputArgs} />;
};

Basic.args = {
  size: 'MEDIUM',
  statusColor: undefined,
  url: undefined,
  userInitials: undefined,
  firstname: undefined,
  lastname: undefined,
  displayPointerCursor: true,
  displayInitialsAsFallback: false,
};

export const ImageSet = (inputArgs: Props) => {
  return <UserAvatar {...inputArgs} />;
};

ImageSet.args = {
  size: 'LARGE',
  statusColor: '#2a6ebb',
  url: 'https://pbs.twimg.com/profile_images/1425525237941248004/L2khaHrk_400x400.jpg',
  userInitials: 'DK',
  firstname: undefined,
  lastname: undefined,
  displayPointerCursor: true,
  displayInitialsAsFallback: true,
};
