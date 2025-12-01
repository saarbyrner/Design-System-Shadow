// @flow
import { useState } from 'react';
import { SelectWrapper } from '../../../components';
import { getPage, getDesign } from '../../utils';
import type { SelectWrapperProps } from '../../../components/wrappers/SelectWrapper/types';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-select/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6569-39888&mode=design&t=dVWmZs6V1GrauSOi-0',
};
const label = 'Example Label';
const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
];

export default {
  title: 'Select Wrapper',
  render: (args: SelectWrapperProps) => {
    return <SelectWrapper {...args} onChange={() => {}} />;
  },
  parameters: {
    layout: 'centered',
    docs: {
      page: getPage(docs),
    },
    design: getDesign(docs),
  },
  tags: ['autodocs'],

  argTypes: {
    label: {
      description: 'Required label for the input',
      control: 'text',
    },
    value: {
      description: 'The currently selected option',
    },
    options: {
      description: 'Options to choose from',
      control: 'select',
      options,
    },
    minWidth: {
      description: 'Minimum width of the component',
      control: 'number',
    },
    fullWidth: {
      description: 'If the Select should fill its parent',
      control: 'boolean',
    },
    invalid: {
      description: 'If the invalid styling should show',
      control: 'boolean',
    },
  },
};

export const Story = {
  args: {
    label,
    options,
    fullWidth: true,
    minWidth: 300,
    isMulti: false,
    invalid: false,
  },
};

export const WithMultipleSelect = () => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedValues(value);
  };

  return (
    <SelectWrapper
      label={label}
      options={options}
      value={selectedValues}
      onChange={handleChange}
      isMulti
    />
  );
};
