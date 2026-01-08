// @flow
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import DaySelector from './index';

export const Default = () => (
  <div className="storybook__formComponentHolder">
    <DaySelector
      label="Select days"
      items={[
        { id: 'monday', displayName: 'M', selected: false },
        { id: 'tuesday', displayName: 'T', selected: false },
        { id: 'wednesday', displayName: 'W', selected: false },
        { id: 'thursday', displayName: 'T', selected: false },
        { id: 'friday', displayName: 'F', selected: true },
        { id: 'saturday', displayName: 'S', selected: false },
        { id: 'sunday', displayName: 'S', selected: false },
      ]}
      onToggle={action('toggle')}
    />
    <br />
    <DaySelector
      label="Select days"
      items={[
        { id: 'minus3', displayName: '-3', selected: false },
        { id: 'minus2', displayName: '-2', selected: false },
        { id: 'minus1', displayName: '-1', selected: false },
        { id: 'game_day', displayName: 'GD', selected: false },
        { id: 'plus1', displayName: '+1', selected: true },
        { id: 'plus2', displayName: '+2', selected: false },
        { id: 'plus3', displayName: '+3', selected: false },
      ]}
      onToggle={action('toggle')}
    />
  </div>
);

export default {
  title: 'Form Components/Simple Inputs/DaySelector',
  component: Default,
  decorators: [withKnobs],
};
