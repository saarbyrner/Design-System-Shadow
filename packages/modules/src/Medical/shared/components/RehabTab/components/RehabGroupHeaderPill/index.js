/* eslint-disable camelcase */
// @flow
import { css } from '@emotion/react';
import { IconButton, TextTag } from '@kitman/components';
import type { RehabGroupHeading } from '../../types';

const style = {
  container: css`
    width: fit-content;
    border-radius: 3px;
    margin: 4px 0px 4px 0px;
  `,
  textTagWrapper: css`
    width: inherit;
    border-radius: 0px 3px 3px 0px;
    padding-right: 4px;
  `,
};

const RehabGroupHeaderPill = ({
  section: { name, theme_colour },
}: {
  section: RehabGroupHeading,
}) => {
  return (
    <div
      id="GroupPillHeaderContainer"
      css={[style.container, { borderLeft: `4px solid ${theme_colour}` }]}
    >
      <TextTag
        displayEllipsisWidth={75}
        wrapperCustomStyles={style.textTagWrapper}
        content={name}
      >
        <IconButton
          icon="icon-close"
          isTransparent
          onClick={() => {}}
          customStyles={{
            height: 'auto',
            padding: '0px 0px 0px 10px',
            margin: '0',
            minWidth: '10px',
            color: 'inherit',
            fontSize: 'inherit',
          }}
        />
      </TextTag>
    </div>
  );
};

export default RehabGroupHeaderPill;
