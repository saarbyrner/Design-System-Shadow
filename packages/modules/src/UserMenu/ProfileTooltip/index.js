// @flow
import { forwardRef, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import Tippy from '@tippyjs/react';
import { withNamespaces } from 'react-i18next';
import { Link, UserAvatar } from '@kitman/components';
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';
import { zIndices } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  currentUser: Object,
  userInitials: string,
};

const Avatar = forwardRef((props, ref) => {
  return (
    <span ref={ref} className="profileTooltip__avatar">
      <UserAvatar
        displayInitialsAsFallback
        displayPointerCursor={props.displayPointerCursor}
        size={props.size}
        url={props.currentUser.avatar_url}
        userInitials={props.userInitials}
      />
    </span>
  );
});

const ProfileTooltip = (props: I18nProps<Props>) => {
  const [tooltipInstance, setTooltipInstance] = useState(null);
  const { windowWidth, windowHeight } = useWindowSize();

  useEffect(() => {
    if (tooltipInstance) {
      tooltipInstance.hide();
    }
  }, [windowWidth, windowHeight]);

  const tooltipMenu = (
    <div className="profileTooltipMenu">
      <div className="profileTooltipMenu__userDetails">
        <Avatar
          displayPointerCursor={false}
          userInitials={props.userInitials}
          currentUser={props.currentUser}
          size="MEDIUM"
        />
        <div className="profileTooltipMenu__userDetailsNames">
          <span className="profileTooltipMenu__userFullName">
            {`${props.currentUser.firstname} ${props.currentUser.lastname}`}
          </span>
          <span className="profileTooltipMenu__userNickname">
            {props.currentUser.username}
          </span>
        </div>
      </div>

      <ul className="profileTooltipMenu__items">
        {!window.getFlag('nfl-player-portal-web') && (
          <li className="profileTooltipMenu__item">
            <Link
              className="profileTooltipMenu__item__link"
              href="/user_profile/edit"
            >
              <i className="profileTooltipMenu__item__icon icon-person-circle" />
              <span className="profileTooltipMenu__item__label">
                {props.t('View Profile')}
              </span>
            </Link>
          </li>
        )}
        <li className="profileTooltipMenu__item">
          <a
            className="profileTooltipMenu__item__link"
            href="/auth/sign_out"
            rel="nofollow noreferer"
          >
            <i className="profileTooltipMenu__item__icon icon-sign-out" />
            <span className="profileTooltipMenu__item__label">
              {props.t('Sign Out')}
            </span>
          </a>
        </li>
      </ul>

      <div className="profileTooltipMenu__footer">
        <a
          target="_blank"
          href="https://www.kitmanlabs.com/privacy"
          rel="noopener noreferrer"
          className="profileTooltipMenu__tandcLink"
        >
          {props.t('Terms and Policies')}
        </a>
      </div>
    </div>
  );

  return (
    <div
      data-testid="profileTooltip"
      className="profileTooltip"
      css={
        window.featureFlags['league-ops-hide-squad-selector'] &&
        css`
          border: none;
        `
      }
    >
      <Tippy
        offset={[0, 12]}
        placement="bottom-end"
        trigger="click"
        content={tooltipMenu}
        onCreate={setTooltipInstance}
        interactive
        theme="neutral-tooltip--kitmanDesignSystem"
        maxWidth="none"
        appendTo={document.body}
        zIndex={zIndices.navBarDropDown}
      >
        <Avatar
          displayPointerCursor
          currentUser={props.currentUser}
          size="SMALL"
          userInitials={props.userInitials}
        />
      </Tippy>
    </div>
  );
};

export const ProfileTooltipTranslated = withNamespaces()(ProfileTooltip);
export default ProfileTooltip;
