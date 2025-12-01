// @flow
import { forwardRef, type Node } from 'react';
import classNames from 'classnames';
import { colors } from '@kitman/common/src/variables';
import LoadingSpinner from '../LoadingSpinner';
import type { ButtonType, ButtonSize } from './types';

type Props = {
  id?: ?string,
  type?: ButtonType,
  size?: ButtonSize,
  iconBefore?: string,
  iconAfter?: string,
  isDisabled?: boolean,
  isSubmit?: boolean,
  isActive?: boolean,
  text?: Node,
  onClick?: Function,
  isLoading?: ?boolean,
  shouldFitContainer?: boolean,
  kitmanDesignSystem?: boolean,
  tabIndex?: string,
  testId?: string,
  className?: string,
  style?: Object,
};

const TextButton = (props: Props, ref) => {
  // prevent undefined coercion in an string literal
  const size = props.size || '';
  const type = props.type || '';

  const buttonBaseClass = props.kitmanDesignSystem
    ? 'textButton--kitmanDesignSystem'
    : 'textButton';
  const classes = classNames(
    buttonBaseClass,
    {
      [`${buttonBaseClass}--${type}`]: type || false,
      [`${buttonBaseClass}--${size}`]: props.size || false,
      [`${buttonBaseClass}--isActive`]: props.isActive,
      [`${buttonBaseClass}--fitContainer`]: props.shouldFitContainer,
      [`${buttonBaseClass}--iconOnly`]: !props.text,
    },
    props.className
  );

  const renderButtonContent = () => {
    if (props.isLoading) {
      return <LoadingSpinner color={colors.grey_200} />;
    }
    return (
      <>
        {props.iconBefore && (
          <span
            className={`textButton__icon textButton__icon--before ${props.iconBefore}`}
          />
        )}
        {props.text && <span className="textButton__text">{props.text}</span>}
        {props.iconAfter && (
          <span
            className={`textButton__icon textButton__icon--after ${props.iconAfter}`}
          />
        )}
      </>
    );
  };

  return (
    <button
      id={props.id || null}
      className={classes}
      onClick={props.onClick}
      disabled={props.isDisabled || props.isLoading}
      type={props.isSubmit ? 'submit' : 'button'}
      tabIndex={props.tabIndex}
      ref={ref}
      style={props.style}
      data-testid={props.testId || ''}
    >
      {renderButtonContent()}
    </button>
  );
};

export default forwardRef<Props, HTMLButtonElement>(TextButton);
