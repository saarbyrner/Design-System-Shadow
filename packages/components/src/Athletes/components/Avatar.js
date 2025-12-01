// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { UserAvatar } from '@kitman/components';
import type { OptionType } from '../types';

type Props = {
  type: OptionType,
  firstname?: string,
  lastname?: string,
  url?: string,
};

function Avatar(props: Props) {
  if (props.type !== 'athletes') {
    return (
      <div
        css={css`
          width: 24px;
          height: 24px;
          clip-path: circle(50%);
          background-color: ${colors.neutral_400};
          color: ${colors.white};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        `}
      >
        <i className="icon-athletes" />
      </div>
    );
  }

  return (
    <UserAvatar
      size="EXTRA_SMALL"
      firstname={props.firstname}
      lastname={props.lastname}
      url={props.url}
      displayInitialsAsFallback
    />
  );
}

export default Avatar;
