// @flow
import { type Node, type ElementRef } from 'react';
import { type SerializedStyles } from '@emotion/react';
import type { ObjectStyle } from '@kitman/common/src/types/styles';
import styles from './style';

type Props = {
  children: Node,
  styles?: (SerializedStyles | ObjectStyle)[],
  className?: string,
  innerRef?: ElementRef<any>,
};

function getStyling(defaultStyle: SerializedStyles, props: Props) {
  if (window.getFlag('rep-dashboard-ui-upgrade')) {
    return {
      styling: [...(props.styles || []), defaultStyle],
      className: props.className,
    };
  }
  return {
    styling: props.styles || [],
    className: props.className,
  };
}

function renderWithStyling(props: Props, defaultStyle) {
  const { styling, className } = getStyling(defaultStyle, props);
  return (
    <div ref={props.innerRef} css={styling} className={className}>
      {props.children}
    </div>
  );
}

function WidgetCard(props: Props) {
  return renderWithStyling(props, styles.card);
}

const Header = (props: Props) => {
  return renderWithStyling(props, styles.cardHeader);
};

const Content = (props: Props) => {
  return renderWithStyling(props, styles.content);
};

const Title = (props: Props) => {
  return renderWithStyling(props, styles.title);
};

const iconStyles = {
  fontSize: '30px',
  cursor: 'pointer',
};
const MenuIcon = (props: { label?: string }) => {
  return (
    <i
      aria-label={props.label || null}
      css={window.getFlag('rep-dashboard-ui-upgrade') ? iconStyles : null}
      className={
        window.getFlag('rep-dashboard-ui-upgrade')
          ? 'icon-hamburger-circled-dots'
          : 'icon-more'
      }
    />
  );
};

WidgetCard.Header = Header;
WidgetCard.Title = Title;
WidgetCard.MenuIcon = MenuIcon;
WidgetCard.Content = Content;

export default WidgetCard;
