// @flow
import { useArgs } from '@storybook/client-api';
import FilterInput from '.';

export const Basic = () => {
  const [args] = useArgs();

  return <FilterInput {...args} />;
};

Basic.args = {
  placeHolder: 'placeHolder string',
  value: 'value',
  setFilter: () => {},
  clearFilter: () => {},
  label: 'label value',
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

export default {
  title: 'FilterInput',
  component: FilterInput,

  argTypes: {
    placeHolder: { control: { type: 'text' } },
    value: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
  },
};
