// @flow
import classNames from 'classnames';

import style from './style';
import type { GetStyleParams } from './utils';
import { getStyle } from './utils';

export type Props = {
  url?: ?string,
  userInitials?: string,
  firstname?: string,
  lastname?: string,
  displayInitialsAsFallback: boolean,
  ...GetStyleParams,
};

const UserAvatar = ({
  url,
  userInitials,
  firstname,
  lastname,
  size,
  displayPointerCursor,
  displayInitialsAsFallback,
  statusColor,
  availability,
  statusDotMargin,
}: Props) => {
  const styles = {
    ...getStyle({
      size,
      statusDotMargin,
      statusColor,
      displayPointerCursor,
      availability,
    }),
    ...style,
  };

  const statusIndicator =
    statusColor || availability ? (
      <span
        css={styles.statusIndicator}
        className={classNames(
          'planningEventGridTab__availabilityCircle',
          availability &&
            `planningEventGridTab__availabilityCircle--${availability}`
        )}
      />
    ) : null;

  let initials;
  if (userInitials) {
    initials = userInitials;
  } else {
    const first = firstname ? firstname[0] : '';
    const last = lastname ? lastname[0] : '';
    initials = `${first}${last}`;
  }

  if (url) {
    return (
      <div role="img" css={styles.avatar}>
        <img css={styles.userImage} alt={initials} src={url} />
        {statusIndicator}
      </div>
    );
  }

  return (
    <div
      role="img"
      css={[
        styles.avatar,
        displayInitialsAsFallback && styles.userInitialsBackground,
      ]}
    >
      {displayInitialsAsFallback ? (
        <span css={style.userInitials}>{initials}</span>
      ) : (
        <div css={styles.userImageFallback} />
      )}
      {statusIndicator}
    </div>
  );
};

UserAvatar.defaultProps = {
  size: 'MEDIUM',
  displayPointerCursor: false,
};

export default UserAvatar;
