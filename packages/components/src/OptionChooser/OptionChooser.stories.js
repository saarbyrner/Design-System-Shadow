// @flow
import { useArgs } from '@storybook/client-api';
import OptionChooser from '.';
import type { Props } from '.';

export default {
  title: 'Form Components/Simple Inputs/OptionChooser',
  component: OptionChooser,
};

const selectableOptions = [
  {
    value: '1',
    image: '',
    text: 'Document',
    icon: 'icon-document',
  },
  {
    value: '2',
    image: '',
    text: 'Mail',
    icon: 'icon-mail',
  },
  {
    value: '3',
    image: '',
    text: 'Bar Graph',
    icon: 'icon-bar-graph',
  },
  {
    value: '4',
    image: '',
    text: 'Stack Column',
    icon: 'icon-stack-column-graph',
  },
  {
    value: '5',
    image: '',
    text: 'Athletes',
    icon: 'icon-athletes',
  },
  {
    value: '6',
    image: '',
    text: 'Workload',
    icon: 'icon-workload',
  },
];

// eslint-disable-next-line no-unused-vars
export const Basic = (inputArgs: Props) => {
  const [args, updateArgs] = useArgs();
  const handleChange = (optionValue) => {
    updateArgs({ value: optionValue });
  };

  return <OptionChooser {...args} onChange={handleChange} />;
};

Basic.args = {
  options: selectableOptions,
  value: 1,
};
