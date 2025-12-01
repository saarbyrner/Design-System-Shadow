// @flow
import type { Node } from 'react';
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import classNames from 'classnames';
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';
import useClickOutside from '@kitman/common/src/hooks/useClickOutside';

export type Props = {
  align?: 'left' | 'right',
  children?: Node,
  cssTop: number,
  isOpen: boolean,
  kitmanDesignSystem?: boolean,
  title?: string,
  togglePanel: Function,
  width?: number | string,
  hideHeader?: boolean,
  position?: 'relative' | 'absolute' | 'fixed',
  leftMargin?: number, // this will override the default 60px left margin when the alignment is set to left. This is to retain backwards compatibility.
  useClickToClose?: boolean,
  removeFixedLeftMargin: boolean,
  styles?: Object,
};

function SlidingPanel(props: Props) {
  const [height, setHeight] = useState(`calc(100vh - ${props.cssTop}px)`);
  const [top, setTop] = useState(props.cssTop);

  const { windowHeight } = useWindowSize();
  const slidingPanelRef = useClickOutside(
    props.togglePanel,
    !props.useClickToClose || !props.isOpen
  );

  const classes = classNames('slidingPanel', {
    slidingPanelFixed: props.position === 'fixed',
    slidingPanel__left: props.align === 'left',
    'slidingPanel__left--closed': props.align === 'left' && !props.isOpen,
    slidingPanel__right: props.align === 'right',
    'slidingPanel__right--closed': props.align === 'right' && !props.isOpen,
    'slidingPanel--kitmanDesignSystem': props.kitmanDesignSystem,
  });

  const handleScroll = () => {
    if (window.pageYOffset >= props.cssTop) {
      setHeight('100vh');
    } else {
      setHeight(`calc(100vh - (${props.cssTop}px - ${window.pageYOffset}px)`);
      setTop(props.cssTop - window.pageYOffset);
    }

    if (document.body && document.body.offsetHeight > windowHeight) {
      setTop(props.cssTop - window.pageYOffset);

      if (window.pageYOffset >= props.cssTop) {
        setTop(0);
      }
    }
  };

  // Close the panel when the user presses escape
  const onKeydown = (event: any) => {
    if (event.keyCode === 27) {
      props.togglePanel();
    }
  };

  useEffect(() => {
    if (props.isOpen) {
      window.addEventListener('scroll', handleScroll);
      document.addEventListener('keydown', onKeydown, false);
    } else {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', onKeydown, false);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', onKeydown, false);
    };
  }, [props.isOpen]);

  const getStyle = () => {
    const {
      align,
      position,
      width,
      leftMargin,
      removeFixedLeftMargin,
      styles,
    } = props;

    return {
      height: position === 'fixed' ? height : '100%',
      top,
      width,
      position,
      ...(styles || {}),
      ...(align === 'left' && !removeFixedLeftMargin
        ? { left: leftMargin || leftMargin === 0 ? leftMargin : 60 }
        : {}),
    };
  };

  return (
    <div ref={slidingPanelRef} className={classes} style={getStyle()}>
      {!props.hideHeader && (
        <div className="slidingPanel__heading">
          <span
            css={css({ visibility: props.isOpen ? 'visible' : 'hidden' })}
            className="slidingPanel__title"
          >
            {props.title}
          </span>
          <button
            type="button"
            data-testid="panel-close-button"
            onClick={props.togglePanel}
            className="slidingPanel__closeIcon reactModal__closeBtn icon-close"
          />
        </div>
      )}
      {props.children}
    </div>
  );
}

SlidingPanel.defaultProps = {
  align: 'right',
  cssTop: 0,
  isOpen: false,
  title: '',
  togglePanel: () => {},
  width: 460,
  position: 'fixed',
  removeFixedLeftMargin: false,
};

export default SlidingPanel;
