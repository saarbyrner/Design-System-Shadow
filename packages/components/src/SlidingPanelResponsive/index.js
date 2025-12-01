// @flow
import useClickOutside from '@kitman/common/src/hooks/useClickOutside';
import type { Node } from 'react';
import { useEffect } from 'react';
import type { SerializedStyles } from '@emotion/react';
import type { ObjectStyle } from '@kitman/common/src/types/styles';
import styleWithProps, { childrenStyles } from './style';

export type Props = {
  width: number,
  title?: Node,
  children?: Node,
  onClose: Function,
  animate?: boolean,
  isOpen: boolean,
  intercomTarget?: string,
  useClickToClose?: boolean,
};

const SlidingPanel = (props: Props) => {
  const slidingPanelRef = useClickOutside(
    props.onClose,
    !props.useClickToClose || !props.isOpen
  );

  // Close the panel when the user presses escape
  const onKeydown = (event: any) => {
    if (event.keyCode === 27) {
      props.onClose();
    }
  };

  useEffect(() => {
    if (props.isOpen) {
      document.addEventListener('keydown', onKeydown, false);
    } else {
      document.removeEventListener('keydown', onKeydown, false);
    }
    return () => {
      document.removeEventListener('keydown', onKeydown, false);
    };
  }, [props.isOpen]);

  const style = styleWithProps(props.width, props.isOpen, props.animate);

  return (
    <div
      ref={slidingPanelRef}
      css={style.slidingPanel}
      data-testid="sliding-panel"
      data-intercom-target={props.intercomTarget}
    >
      <div css={style.heading}>
        {props.title && (
          <span css={style.title} data-testid="sliding-panel|title">
            {props.title}
          </span>
        )}

        <button
          type="button"
          onClick={props.onClose}
          css={style.closeButton}
          className="icon-close"
          data-testid="sliding-panel|close-button"
        />
      </div>
      {props.children}
    </div>
  );
};

const Content = (props: {
  children?: Node,
  styles?: SerializedStyles | ObjectStyle,
}) => <div css={[childrenStyles.content, props.styles]}>{props.children}</div>;

const Actions = (props: {
  children?: Node,
  styles?: SerializedStyles | ObjectStyle,
}) => <div css={[childrenStyles.actions, props.styles]}>{props.children}</div>;

SlidingPanel.Content = Content;
SlidingPanel.Actions = Actions;

SlidingPanel.defaultProps = {
  isOpen: false,
  animate: true,
  onClose: () => {},
  width: 460,
};

export default SlidingPanel;
