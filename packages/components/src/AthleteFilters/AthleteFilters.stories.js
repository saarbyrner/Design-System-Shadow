// @flow
import { useArgs } from '@storybook/client-api';
import { AthleteFiltersTranslated as AthleteFilters } from '.';

export const Basic = () => {
  const [args] = useArgs();

  return (
    <div style={{ width: '200px' }}>
      <AthleteFilters {...args} />
    </div>
  );
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  athletes: [],
  selectedGroupBy: 'availability',
  selectedAlarmFilters: ['inAlarm', 'noAlarms'],
  showAlarmFilter: false,
  selectedAvailabilityFilters: false,
  selectedAthleteFilters: [],
};

export default {
  title: 'Form Components/Complex Inputs/Athlete Filters',
  component: Basic,
  argTypes: {
    athletes: { control: { type: 'array' } },
    selectedGroupBy: { control: { type: 'text' } },
    selectedAlarmFilters: { control: { type: 'array' } },
    showAlarmFilter: { control: { type: 'boolean' } },
    selectedAvailabilityFilters: { control: { type: 'boolean' } },
    selectedAthleteFilters: { control: { type: 'array' } },
  },
};
