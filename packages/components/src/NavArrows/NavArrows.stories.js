// @flow
import { useArgs } from '@storybook/client-api';
import { css } from '@emotion/react';
import NavArrows from '.';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div
      css={css`
        div[class^='navArrows_'] {
          display: contents;
        }
      `}
    >
      <NavArrows {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  customClassname: 'customClassname',
  rightNavBtnClasses: 'navArrows__rightBtn isDisabled',
  onLeftBtnClick: () => {},
  onRightBtnClick: () => {},
};

export default {
  title: 'NavArrows',
  component: Basic,
  argTypes: {
    rightNavBtnClasses: {
      control: {
        type: 'select',
        options: ['navArrows__rightBtn isDisabled', 'navArrows__rightBtn'],
      },
    },
  },
};
