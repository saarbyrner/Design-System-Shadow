// @flow
import { useArgs } from '@storybook/client-api';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import ExpandingPanel from './index';
import type { Props } from './index';

export default {
  title: 'ExpandingPanel',
  component: ExpandingPanel,
};

const storyTestStyle = {
  container: css`
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: 0px;
    grid-template-areas: 'main slideout';
    width: 100%;
    height: 100vh;
  `,
  mainArea: css`
    grid-area: main;
    width: 100%;
    background-image: linear-gradient(to right, #ffffff, #7fa8d6);
  `,
  sidePanel: css`
    background-color: #fff;
    filter: drop-shadow(0px 2px 8px ${colors.light_transparent_background})
      drop-shadow(0px 2px 15px ${colors.semi_transparent_background});
    grid-area: slideout;
    overflow-x: clip;
  `,
};

// eslint-disable-next-line no-unused-vars
export const Default = (inputArgs: Props) => {
  const [args, updateArgs] = useArgs();
  const handleChange = () => {
    updateArgs({ isOpen: false });
  };

  return (
    <div css={storyTestStyle.container}>
      <div css={storyTestStyle.mainArea}>
        <p>This side panel is NOT the normal SlidingPanel.</p>
        <p>
          This component is used where we want a contract/expand in width as
          side panel appears and closes
        </p>
        <p>
          This ensure the main area content is not covered over by the side
          panel
        </p>
      </div>
      <div css={storyTestStyle.sidePanel}>
        <ExpandingPanel {...args} onClose={handleChange}>
          Panel content
        </ExpandingPanel>
      </div>
    </div>
  );
};
Default.args = {
  isOpen: true,
  width: 460,
  title: 'Expanding Content Panel Title',
};
