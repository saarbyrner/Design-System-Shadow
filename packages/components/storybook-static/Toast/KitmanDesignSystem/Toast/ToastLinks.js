// @flow
import { TextLink } from '@kitman/components';
import { css } from '@emotion/react';
import type { ToastLink } from '@kitman/components/src/types';

const style = {
  wrapper: css`
    grid-column: 2 / 4;
  `,
  link: css`
    display: inline-block;
    margin-right: 6px;
  `,
};

type Props = {
  links: ToastLink[],
  onClickToastLink?: (toastLink: ToastLink) => void,
};

const ToastLinks = (props: Props) => {
  return (
    <div css={style.wrapper}>
      {props.links.map((link) => (
        <div key={link.id} css={style.link}>
          <TextLink
            text={link.text}
            href={link.link}
            withHashParam={link.withHashParam}
            onClick={(event) => {
              if (
                typeof props.onClickToastLink === 'function' &&
                link.metadata?.action
              ) {
                props.onClickToastLink(link);
                event.preventDefault();
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastLinks;
