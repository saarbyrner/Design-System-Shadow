// @flow
import { useState } from 'react';
import type { Node } from 'react';
import ReactDOM from 'react-dom';
import { withNamespaces } from 'react-i18next';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import styles from './styles';

type Props = {
  onExpand?: Function,
  title: string,
  children?: Node,
  alignLeft?: boolean,
};

const PopupBox = (props: I18nProps<Props>) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleExpand = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    props.onExpand?.();
  };

  return ReactDOM.createPortal(
    <div
      css={props.alignLeft ? styles.containerLeft : styles.containerRight}
      data-testid="PopupBox"
    >
      <section
        css={styles.header}
        data-testid="PopupBox|Header"
        onClick={() => setIsCollapsed((collapsedValue) => !collapsedValue)}
      >
        <p>{props.title}</p>

        <div>
          <span
            css={styles.icon}
            className={isCollapsed ? 'icon-down' : 'icon-up'}
          />

          {props.onExpand && (
            <button
              css={styles.button}
              type="button"
              onClick={(e) => handleExpand(e)}
            >
              <span css={styles.icon} className="icon-expand" />
            </button>
          )}
        </div>
      </section>

      {!isCollapsed && (
        <section css={styles.content} data-testid="PopupBox|Content">
          {props.children}
        </section>
      )}
    </div>,
    document.getElementById('root')
  );
};

export const PopupBoxTranslated = withNamespaces()(PopupBox);
export default PopupBox;
