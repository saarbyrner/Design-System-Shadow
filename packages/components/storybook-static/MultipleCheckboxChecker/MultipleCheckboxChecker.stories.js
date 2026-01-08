// @flow
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import MultipleCheckboxChecker from './index';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <MultipleCheckboxChecker {...args} />
    </div>
  );
};

const checkedOptions = {
  allChecked: 'ALL_CHECKED',
  partiallyChecked: 'PARTIALLY_CHECKED',
  empty: 'EMPTY',
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  type: checkedOptions,
  onClick: action('click'),
};

export default {
  title: 'Form Components/Simple Inputs/MultipleCheckboxChecker',
  component: Basic,
  argTypes: {
    type: { control: { type: 'select', options: checkedOptions } },
  },
};
