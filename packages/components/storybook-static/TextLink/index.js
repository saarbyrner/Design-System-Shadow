// @flow
import type { Element } from 'react';
import classNames from 'classnames';
import { Link } from '@kitman/components';
import type { LinkTarget } from './types';

type Props = {
  id: ?string,
  href: string,
  text: string | Element<any>,
  target?: LinkTarget,
  isDisabled?: boolean,
  kitmanDesignSystem?: boolean,
  withHashParam?: boolean,
  onClick?: Function,
  isExternalLink?: boolean,
  maxTextLength?: number,
};

const TextLink = (props: Props) => {
  const { text, maxTextLength } = props;

  const isTextString = typeof text === 'string';
  let displayedText: string | Element<any> = text;
  let shouldTruncate = false;

  if (isTextString && maxTextLength) {
    const stringText: string = (text: any); // Cast to any first to satisfy Flow, then to string
    if (stringText.length > maxTextLength) {
      shouldTruncate = true;
      displayedText = `${stringText.substring(0, maxTextLength)}...`;
    }
  }

  return (
    <Link
      className={classNames('textLink', {
        'textLink--disabled': props.isDisabled,
        'textLink--kitmanDesignSystem': props.kitmanDesignSystem,
      })}
      id={props.id}
      href={props.href}
      onClick={(event) => {
        event.stopPropagation();
        props.onClick?.(event);
      }}
      target={props.target}
      openInNewTab={props.target === '_blank'}
      withHashParam={props.withHashParam}
      rel="noopener noreferrer"
      isExternalLink={props.isExternalLink}
    >
      {shouldTruncate ? (
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'inline-block',
            maxWidth: '100%',
          }}
        >
          {displayedText}
        </span>
      ) : (
        displayedText
      )}
    </Link>
  );
};


TextLink.defaultProps = {
  id: null,
  target: '_self',
  maxTextLength: undefined,
};

export default TextLink;
