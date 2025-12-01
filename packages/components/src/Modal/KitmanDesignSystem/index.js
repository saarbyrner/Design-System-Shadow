// @flow
import type { Node } from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactModal from 'react-modal';
import { ClassNames } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { ObjectStyle } from '@kitman/common/src/types/styles';

import { getStyles } from './utils';

type Props = {
  isOpen: boolean,
  width?: 'small' | 'medium' | 'large' | 'x-large',
  // It is mandatory to close the modal when the user presses escape
  onPressEscape: Function,
  children?: Node,
  overlapSidePanel?: boolean,
  additionalStyle?: SerializedStyles | ObjectStyle,
};

const ModalHeader = (props: { children?: Node }) => (
  <header css={getStyles().header}>{props.children}</header>
);

const ModalTitle = (props: { children?: Node }) => (
  <h4 css={getStyles().title} data-testid="Modal|Title">
    {props.children}
  </h4>
);

export type ScrollStatus = {
  canScrollUp: boolean,
  canScrollDown: boolean,
};

const ModalContent = (props: {
  children?: $PropertyType<Props, 'children'>,
  additionalStyle?: $PropertyType<Props, 'additionalStyle'>,
  onScroll?: (scrollStatus: ScrollStatus) => void,
}) => {
  const scrollableContentRef = useRef(null);
  const [isScrollableUp, setIsScrollableUp] = useState(false);
  const [isScrollableDown, setIsScrollableDown] = useState(false);

  // We track if the modal content is scrollable up/down so we
  // can show a visual clue that there is an hidden content
  const setScrollableStates = useDebouncedCallback(() => {
    if (!scrollableContentRef.current) {
      return;
    }

    const scrollTop = scrollableContentRef.current.scrollTop;
    const scrollHeight = scrollableContentRef.current.scrollHeight;
    const clientHeight = scrollableContentRef.current.clientHeight;

    const canScrollUp = scrollTop !== 0;
    setIsScrollableUp(canScrollUp);

    const canScrollDown = Math.round(scrollTop + clientHeight) < scrollHeight;
    setIsScrollableDown(canScrollDown);

    if (props.onScroll) {
      const scrollStatus: ScrollStatus = { canScrollUp, canScrollDown };
      props.onScroll(scrollStatus);
    }
  }, 10);

  useEffect(() => setScrollableStates(), [setScrollableStates]);
  return (
    <div
      css={[
        getStyles({ isScrollableUp, isScrollableDown }).content,
        props.additionalStyle,
      ]}
      onScroll={setScrollableStates}
      ref={scrollableContentRef}
      data-testid="Modal|Content"
    >
      {props.children}
    </div>
  );
};

const ModalFooter = (props: { children?: Node, showBorder?: boolean }) => {
  return (
    <footer
      css={getStyles({ showBorder: props.showBorder }).footer}
      data-testid="Modal|Footer"
    >
      {props.children}
    </footer>
  );
};

const Modal = (props: Props) => {
  const getModalWidth = () => {
    switch (props.width) {
      case 'small':
        return 400;
      case 'large':
        return 752;
      case 'x-large':
        return 968;
      case 'medium':
      default:
        return 600;
    }
  };

  // Close the modal when the user presses escape
  const onKeydown = (event: any) => {
    if (event.keyCode === 27) {
      props.onPressEscape();
    }
  };

  useEffect(() => {
    if (props.isOpen) {
      document.addEventListener('keydown', onKeydown, false);
    } else {
      document.removeEventListener('keydown', onKeydown, false);
    }

    return function cleanup() {
      document.removeEventListener('keydown', onKeydown, false);
    };
  });

  return (
    <ClassNames>
      {(cn) => (
        <ReactModal
          isOpen={props.isOpen}
          appElement={document.body}
          className={cn.cx(
            'reactModal',
            cn.css(getStyles({ modalWidth: getModalWidth() }).modal),
            cn.css(props.additionalStyle)
          )}
          overlayClassName={cn.cx(
            'reactModal__overlay',
            cn.css(
              props.overlapSidePanel
                ? getStyles().overlapSidePanel
                : getStyles().overlay
            )
          )}
        >
          {props.children}
        </ReactModal>
      )}
    </ClassNames>
  );
};

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
