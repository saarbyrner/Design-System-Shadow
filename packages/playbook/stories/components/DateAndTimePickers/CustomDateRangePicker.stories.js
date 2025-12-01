import moment from 'moment';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { getDesign, getPage } from '../../utils';
import CustomDateRangePicker from '../../../components/wrappers/CustomDateRangePicker';

// Create a minimal Redux store for Storybook
const store = configureStore({
  reducer: {
    [globalApi.reducerPath]: globalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(globalApi.middleware),
});

const docs = {
  // No MUI link since this is a custom component
  // Figma link will be added later
};

export default {
  title: 'Date & Time Pickers/CustomDateRangePicker',
  component: CustomDateRangePicker,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <div style={{ minHeight: '50vh' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
  render: ({ ...args }) => <CustomDateRangePicker {...args} />,
  parameters: {
    layout: 'centered',
    docs: {
      page: getPage(docs),
      description: {
        component:
          'Custom date range picker component with mobile support, quick filters, and manual input capabilities.',
      },
    },
    design: getDesign(docs),
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: {
      description:
        'Callback function called when the selected date range changes',
      action: 'onChange',
      table: {
        type: { summary: '(range: DateRangeOutput | null) => void' },
      },
    },
    variant: {
      description: 'Display variant of the component',
      control: { type: 'select' },
      options: ['default', 'menuFilters'],
      table: {
        type: { summary: "'default' | 'menuFilters'" },
        defaultValue: { summary: 'default' },
      },
    },
    disableFuture: {
      description: 'Disables selection of future dates',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disablePast: {
      description: 'Disables selection of past dates',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    minDate: {
      description: 'Minimum selectable date',
      control: { type: 'date' },
      table: {
        type: { summary: 'MomentType' },
      },
    },
    maxDate: {
      description: 'Maximum selectable date',
      control: { type: 'date' },
      table: {
        type: { summary: 'MomentType' },
      },
    },
    customFilters: {
      description: 'Additional quick filter options',
      control: { type: 'object' },
      table: {
        type: { summary: 'Array<CustomFilter>' },
      },
    },
  },
};

// Primary story - basic usage
export const Default = {
  args: {
    onChange: (range) => {
      console.log('Selected range:', range);
    },
  },
};

// Story with menuFilters variant
export const MenuFilters = {
  args: {
    variant: 'menuFilters',
    onChange: (range) => {
      console.log('Selected range:', range);
    },
  },
};

// Story with disabled future dates
export const DisableFuture = {
  args: {
    disableFuture: true,
    onChange: (range) => {
      console.log('Selected range:', range);
    },
  },
};

// Story with disabled past dates
export const DisablePast = {
  args: {
    disablePast: true,
    onChange: (range) => {
      console.log('Selected range:', range);
    },
  },
};

// Story with date range limits
export const WithDateLimits = {
  args: {
    minDate: moment().subtract(30, 'days'),
    maxDate: moment().add(30, 'days'),
    onChange: (range) => {
      console.log('Selected range:', range);
    },
  },
};

// Story with custom filters
export const WithCustomFilters = {
  args: {
    customFilters: [
      {
        key: 'last7days',
        label: 'Last 7 Days',
        getDateRange: () => [
          moment().subtract(7, 'days').startOf('day'),
          moment().endOf('day'),
        ],
      },
      {
        key: 'last30days',
        label: 'Last 30 Days',
        getDateRange: () => [
          moment().subtract(30, 'days').startOf('day'),
          moment().endOf('day'),
        ],
      },
      {
        key: 'thisQuarter',
        label: 'This Quarter',
        getDateRange: () => [
          moment().startOf('quarter'),
          moment().endOf('quarter'),
        ],
      },
    ],
    onChange: (range) => {
      console.log('Selected range:', range);
    },
  },
};

// Example with full configuration
export const FullyConfigured = {
  args: {
    variant: 'default',
    disableFuture: false,
    disablePast: false,
    minDate: moment().subtract(1, 'year'),
    maxDate: moment().add(1, 'year'),
    customFilters: [
      {
        key: 'yesterday',
        label: 'Yesterday',
        getDateRange: () => [
          moment().subtract(1, 'day').startOf('day'),
          moment().subtract(1, 'day').endOf('day'),
        ],
      },
      {
        key: 'lastWeek',
        label: 'Last Week',
        getDateRange: () => [
          moment().subtract(1, 'week').startOf('week'),
          moment().subtract(1, 'week').endOf('week'),
        ],
      },
    ],
    onChange: (range) => {
      console.log('Selected range:', range);
    },
  },
};

// Story demonstrating keyboard input functionality
export const KeyboardInput = {
  args: {
    onChange: (range) => {
      console.log('Selected range:', range);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Try typing dates directly into the input field. Supports formats like "01012024" for single dates or "0101202431122024" for date ranges.',
      },
    },
  },
};
