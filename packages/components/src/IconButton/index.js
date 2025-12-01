// @flow
import { css } from '@emotion/react';
import classNames from 'classnames';
import LoadingSpinner from '../LoadingSpinner';
import type { IconButtonTheme } from './types';

type Props = {
  icon: string,
  theme: IconButtonTheme,
  text?: string,
  isSmall?: boolean,
  isBorderless?: boolean,
  isDisabled?: boolean,
  isActive?: boolean,
  isTransparent?: boolean,
  isLoading?: boolean,
  onClick?: Function,
  isDarkIcon?: boolean,
  tabIndex?: number,
  testId?: string,
  customStyles?: {},
};

const IconButton = (props: Props) => {
  const styles = {
    loaderWrapper: css`
      margin: 0 36px;
    `,
  };
  const classes = classNames(
    'iconButton',
    !props.isLoading && props.icon,
    { [`iconButton--${props.theme}`]: props.theme },
    { 'iconButton--hasText': props.text || false },
    { 'iconButton--small': props.isSmall || false },
    { 'iconButton--isActive': props.isActive },
    { 'iconButton--transparent': props.isTransparent },
    { 'iconButton--borderless': props.isBorderless },
    { 'iconButton--darkIcon': props.isDarkIcon }
  );

  const renderButtonContent = () => {
    if (props.isLoading) {
      return (
        <div css={styles.loaderWrapper}>
          <LoadingSpinner />
        </div>
      );
    }
    return props.text ? (
      <span className="iconButton__text">{props.text}</span>
    ) : null;
  };

  return (
    <button
      type="button"
      className={classes}
      onClick={props.onClick}
      disabled={props.isDisabled || props.isLoading}
      aria-disabled={props.isDisabled || props.isLoading}
      tabIndex={props.tabIndex || 0}
      data-testid={props.testId}
      style={props.customStyles}
    >
      {renderButtonContent()}
    </button>
  );
};

IconButton.defaultProps = {
  theme: 'default',
};

export default IconButton;
