// @flow
import { useArgs } from '@storybook/client-api';

import TextCell from './TextCell';
import TextCellTooltip from './TextCellTooltip';
import TextHeader from './TextHeader';

// TextCell Sub-component
export const TextCellBasic = () => {
  const [args] = useArgs();

  return <TextCell {...args} />;
};
TextCellBasic.parameters = {
  controls: { hideNoControlsWarning: true },
};
TextCellBasic.args = {
  value: 'TextCell title',
};

// TextCellTooltip Sub-component
export const TextCellTooltipBasic = () => {
  const [args] = useArgs();

  return <TextCellTooltip {...args} />;
};

TextCellTooltipBasic.args = {
  longText: 'TextCell title heee',
  valueLimit: 20,
};
TextCellTooltipBasic.parameters = {
  controls: { hideNoControlsWarning: true },
};

// TextHeader Sub-component
export const TextHeaderBasic = () => {
  const [args] = useArgs();

  return <TextHeader {...args} />;
};

TextHeaderBasic.args = {
  value: 'header value',
};
TextHeaderBasic.parameters = {
  controls: { hideNoControlsWarning: true },
};

export default {
  title: 'Table Cells/TableCells',
  components: [TextCell, TextCellTooltip, TextHeader],

  argTypes: {
    value: { control: { type: 'text' } },
    longText: { control: { type: 'text' } },
    valueLimit: { control: { type: 'number' } },
  },
};
